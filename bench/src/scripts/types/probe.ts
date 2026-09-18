import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

import {
  fromTypeStyleSchema,
  type FromTypeCase,
  type FromTypeStyle,
} from "@schema-benchmarks/schemas";
import ts from "typescript-6";
import * as v from "valibot";

/**
 * Reads the types a library infers for the shared product schema, using the TypeScript compiler
 * API: `program.getInstantiationCount()` for the type instantiations a schema costs, and
 * `checker.typeToString()` for the type an editor shows on hover.
 *
 * The repository type checks with TypeScript 7, which ships no compiler API, so the probe pins its
 * own TypeScript 6 - `typescriptVersion` is reported alongside the results, since a count only
 * means anything next to the compiler that produced it.
 *
 * Both halves of the probe are real, type-checked files in the library's own folder rather than
 * hand-written strings: `types/index.ts` (the inference case) exports the schema plus `Input`/
 * `Output` aliases derived from it, and `types/fromType.ts` (the from-type case) builds a schema
 * from the shared `JsonSchemaOutputData` type. `pnpm typecheck` already catches a broken one; this
 * module reads each with the TypeScript AST and recombines the pieces - imports, the `schema`
 * declaration, and the `Input`/`Output` aliases - into the overlay variants below.
 */

/** The `schemas` package root: its entry is `<root>/src/index.ts`. */
export const SCHEMAS_DIR = path.resolve(
  url.fileURLToPath(import.meta.resolve("@schema-benchmarks/schemas")),
  "../..",
);
const PROBE_FILE_NAME = ".type-probe.ts";

const getCompilerOptions = () => {
  const configPath = path.join(SCHEMAS_DIR, "tsconfig.json");
  const { config, error } = ts.readConfigFile(configPath, (file) => ts.sys.readFile(file));
  if (error) throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
  const { options, errors } = ts.parseJsonConfigFileContent(config, ts.sys, SCHEMAS_DIR);
  if (errors.length) {
    throw new AggregateError(
      errors,
      errors.map((e) => ts.flattenDiagnosticMessageText(e.messageText, "\n")).join(),
    );
  }
  // A probe declares more than it uses - every alias below the one being read is dead code.
  return { ...options, noUnusedLocals: false, noUnusedParameters: false };
};

let probe: { fileName: string; text: string; version: number } | undefined;
// Monotonic across the whole run: the language service caches by version, so a counter that
// restarted with each probe would hand back the previous probe's diagnostics.
let probeVersion = 0;

const createService = () => {
  const options = getCompilerOptions();
  const host: ts.LanguageServiceHost = {
    getScriptFileNames: () => (probe ? [probe.fileName] : []),
    getScriptVersion: (fileName) =>
      fileName === probe?.fileName
        ? String(probe.version)
        : String(ts.sys.getModifiedTime?.(fileName)?.getTime() ?? 0),
    getScriptSnapshot: (fileName) => {
      if (fileName === probe?.fileName) return ts.ScriptSnapshot.fromString(probe.text);
      const text = ts.sys.readFile(fileName);
      return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text);
    },
    getCurrentDirectory: () => SCHEMAS_DIR,
    getCompilationSettings: () => options,
    getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
    fileExists: (fileName) => fileName === probe?.fileName || ts.sys.fileExists(fileName),
    readFile: (fileName) => (fileName === probe?.fileName ? probe.text : ts.sys.readFile(fileName)),
    readDirectory: (...args) => ts.sys.readDirectory(...args),
    directoryExists: (directory) => ts.sys.directoryExists(directory),
    getDirectories: (directory) => ts.sys.getDirectories(directory),
    realpath: (fileName) => ts.sys.realpath?.(fileName) ?? fileName,
  };
  return ts.createLanguageService(host);
};

// One service for the whole run, so lib.d.ts and every library's declarations are parsed once.
let service: ts.LanguageService | undefined;

interface Checked {
  program: ts.Program;
  file: ts.SourceFile;
  diagnostics: ReadonlyArray<ts.Diagnostic>;
  instantiations: number;
}

const check = (fileName: string, text: string): Checked => {
  probe = { fileName, text, version: ++probeVersion };
  // The file has to exist on disk as well: module resolution for the library's own relative
  // imports is answered by the real file system, not by the host's overlay.
  fs.writeFileSync(fileName, text);
  service ??= createService();
  const program = service.getProgram();
  if (!program) throw new Error("The language service produced no program");
  const file = program.getSourceFile(fileName);
  if (!file) throw new Error(`The program does not contain ${fileName}`);
  // Merely building the program instantiates nothing - the count only reflects checking actually
  // done, so the diagnostics have to be asked for before it is read.
  const diagnostics = program.getSemanticDiagnostics(file);
  return { program, file, diagnostics, instantiations: program.getInstantiationCount() };
};

const diagnosticsText = (diagnostics: ReadonlyArray<ts.Diagnostic>) =>
  diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n");

/** Prints every top-level `type X = ...` of a checked probe, keyed by alias name. */
const readAliases = (program: ts.Program, file: ts.SourceFile) => {
  const checker = program.getTypeChecker();
  const aliases: Record<string, string> = {};
  for (const node of file.statements) {
    if (!ts.isTypeAliasDeclaration(node)) continue;
    aliases[node.name.text] = checker.typeToString(
      checker.getTypeAtLocation(node.name),
      undefined,
      // InTypeAlias expands the alias being read rather than printing its own name back, and
      // NoTruncation is the whole point here - the length of the type is a result.
      ts.TypeFormatFlags.InTypeAlias | ts.TypeFormatFlags.NoTruncation,
    );
  }
  return aliases;
};

/**
 * Prints the type of the schema itself, exactly as an editor shows it on hover. Read off the
 * declaration rather than a type alias: in an alias, TypeScript expands a type that is itself an
 * alias (sury's `Schema<Input, Output>` becomes its whole structural body), which is not what a
 * reader of the site would see.
 */
const readSchemaType = (program: ts.Program, file: ts.SourceFile) => {
  const checker = program.getTypeChecker();
  for (const node of file.statements) {
    if (!ts.isVariableStatement(node)) continue;
    const declaration = node.declarationList.declarations[0];
    if (declaration?.name.getText(file) !== "schema") continue;
    return checker.typeToString(
      checker.getTypeAtLocation(declaration.name),
      undefined,
      // The length of the type is a result, so it must not be truncated.
      ts.TypeFormatFlags.NoTruncation,
    );
  }
  return "";
};

/**
 * Whether `any` appears anywhere in the type. `0 extends 1 & T` only answers for the type as a
 * whole: a field typed `any` is assignable to and from the data type, so an object with one reads
 * as an exact match while nothing about that field is checked.
 */
const containsAny = (
  checker: ts.TypeChecker,
  type: ts.Type,
  seen = new Set<ts.Type>(),
): boolean => {
  if (type.flags & ts.TypeFlags.Any) return true;
  if (seen.has(type)) return false;
  seen.add(type);
  if (type.isUnionOrIntersection()) {
    return type.types.some((member) => containsAny(checker, member, seen));
  }
  const nested = [
    ...checker.getTypeArguments(type as ts.TypeReference),
    ...[ts.IndexKind.String, ts.IndexKind.Number].map((kind) =>
      checker.getIndexTypeOfType(type, kind),
    ),
    ...type.getProperties().map((property) => checker.getTypeOfSymbol(property)),
  ];
  return nested.some((member) => !!member && containsAny(checker, member, seen));
};

/** Whether the type a `type X = ...` of a checked probe names contains `any`. */
const aliasContainsAny = (program: ts.Program, file: ts.SourceFile, name: string) => {
  const checker = program.getTypeChecker();
  const alias = file.statements.find(
    (node) => ts.isTypeAliasDeclaration(node) && node.name.text === name,
  );
  return (
    !!alias &&
    ts.isTypeAliasDeclaration(alias) &&
    containsAny(checker, checker.getTypeAtLocation(alias.name))
  );
};

/** How an inferred type relates to the data the schema is meant to describe. */
export type TypeMatch = "exact" | "narrower" | "wider" | "any" | "mismatch";

export interface DirectionProbeResult {
  text: string;
  /** The expression the type is read with, e.g. `z.output<typeof schema>`, as written. */
  snippet: string;
  match: TypeMatch;
  instantiations: number;
}

export interface InferenceProbeResult {
  schema: { text: string; instantiations: number };
  input: DirectionProbeResult;
  output: DirectionProbeResult;
  /** Declaring the schema and reading its output type - what a consumer pays for both. */
  instantiations: number;
}

export interface FromTypeProbeResult {
  style: FromTypeStyle;
  /** The schema is generated from the type, so the two cannot disagree. */
  derived?: boolean;
  note?: string;
  /** The `schema` declaration in `types/fromType.ts`, for display. */
  snippet: string;
  /** Whether the compiler rejected each way a schema can disagree with the type. */
  cases: Record<FromTypeCase, boolean>;
}

export interface TypeProbeResult {
  note?: string;
  inference?: InferenceProbeResult;
  /** Why the library infers nothing from a schema; absent when `inference` is given. */
  noInference?: string;
  fromType?: FromTypeProbeResult;
}

/** Only needed for the match comparison below - production `types/index.ts` files don't use it. */
const PRELUDE = `import type { ProductData } from "#src";\n`;

const MATCH_DECLS = `type ProbeInputToData = [Input] extends [ProductData] ? true : false;
type ProbeDataToInput = [ProductData] extends [Input] ? true : false;
type ProbeOutputToData = [Output] extends [ProductData] ? true : false;
type ProbeDataToOutput = [ProductData] extends [Output] ? true : false;
`;

const toMatch = (hasAny: boolean, toData: boolean, fromData: boolean): TypeMatch => {
  if (hasAny) return "any";
  if (toData && fromData) return "exact";
  if (toData) return "narrower";
  if (fromData) return "wider";
  return "mismatch";
};

const assertChecks = (label: string, { diagnostics }: Checked) => {
  if (diagnostics.length) {
    throw new Error(`The ${label} probe does not type check:\n${diagnosticsText(diagnostics)}`);
  }
};

/** The pieces of `types/index.ts` the inference probe recombines into each overlay variant. */
interface InferenceSource {
  imports: string;
  schema: string;
  input: string;
  output: string;
  inputSnippet: string;
  outputSnippet: string;
}

/** `types/index.ts`, parsed: either something to probe, or why there's nothing to. */
interface IndexSource {
  note?: string;
  noInference?: string;
  inference?: InferenceSource;
}

const findDeclarationText = (file: ts.SourceFile, name: string) => {
  for (const statement of file.statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.declarations[0]?.name.getText(file) === name
    ) {
      return statement.getText(file);
    }
  }
  return undefined;
};

const findTypeAlias = (file: ts.SourceFile, name: string) =>
  file.statements.find(
    (statement): statement is ts.TypeAliasDeclaration =>
      ts.isTypeAliasDeclaration(statement) && statement.name.text === name,
  );

/** Reads a top-level `export const <name> = "...";`, the metadata a library's files export. */
const readStringConst = (file: ts.SourceFile, name: string): string | undefined => {
  for (const statement of file.statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.declarations[0]?.name.getText(file) === name
    ) {
      const initializer = statement.declarationList.declarations[0].initializer;
      if (initializer && ts.isStringLiteralLike(initializer)) return initializer.text;
    }
  }
  return undefined;
};

/** Reads a top-level `export const <name> = true;`/`= false;`. */
const readBooleanConst = (file: ts.SourceFile, name: string): boolean | undefined => {
  for (const statement of file.statements) {
    if (
      ts.isVariableStatement(statement) &&
      statement.declarationList.declarations[0]?.name.getText(file) === name
    ) {
      const initializer = statement.declarationList.declarations[0].initializer;
      if (initializer?.kind === ts.SyntaxKind.TrueKeyword) return true;
      if (initializer?.kind === ts.SyntaxKind.FalseKeyword) return false;
    }
  }
  return undefined;
};

/** Parses `types/index.ts`, read off the TypeScript AST rather than hand-typed. */
const parseIndexSource = (fileName: string, text: string): IndexSource => {
  const file = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
  const imports = file.statements.filter(ts.isImportDeclaration).map((s) => s.getText(file));
  const schema = findDeclarationText(file, "schema");
  const input = findTypeAlias(file, "Input");
  const output = findTypeAlias(file, "Output");
  if (!schema) throw new Error(`${fileName} does not export a \`schema\``);
  if ((input === undefined) !== (output === undefined)) {
    throw new Error(`${fileName} exports only one of \`Input\`/\`Output\``);
  }
  const note = readStringConst(file, "note");
  const noInference = readStringConst(file, "noInference");
  if (!input && !noInference) {
    throw new Error(`${fileName} exports neither \`Input\`/\`Output\` nor \`noInference\``);
  }
  return {
    note,
    noInference,
    inference:
      input && output
        ? {
            imports: imports.join("\n"),
            schema,
            input: input.getText(file),
            output: output.getText(file),
            inputSnippet: input.type.getText(file),
            outputSnippet: output.type.getText(file),
          }
        : undefined,
  };
};

const readIndexSource = (fileName: string) =>
  parseIndexSource(fileName, fs.readFileSync(fileName, "utf8"));

const probeInference = (fileName: string, source: InferenceSource): InferenceProbeResult => {
  try {
    const imports = `${PRELUDE}${source.imports}\n`;
    const baseline = check(fileName, imports);
    assertChecks("imports", baseline);
    const schema = `${imports}${source.schema}\n`;
    const schemaOnly = check(fileName, schema);
    assertChecks("schema", schemaOnly);
    const withInput = check(fileName, `${schema}${source.input}\n`);
    assertChecks("input", withInput);
    const withOutput = check(fileName, `${schema}${source.output}\n`);
    assertChecks("output", withOutput);

    const both = `${schema}${source.input}\n${source.output}\n`;
    const withBoth = check(fileName, both);
    assertChecks("combined", withBoth);
    const types = readAliases(withBoth.program, withBoth.file);

    // The comparisons are checked on their own: they are how the result is judged, not part of
    // what a user pays to infer the types.
    const withMatches = check(fileName, `${both}${MATCH_DECLS}`);
    assertChecks("match", withMatches);
    const matches = readAliases(withMatches.program, withMatches.file);

    const isTrue = (name: string) => matches[name] === "true";
    return {
      schema: {
        text: readSchemaType(withBoth.program, withBoth.file),
        instantiations: schemaOnly.instantiations - baseline.instantiations,
      },
      input: {
        text: types.Input ?? "",
        snippet: source.inputSnippet,
        match: toMatch(
          aliasContainsAny(withBoth.program, withBoth.file, "Input"),
          isTrue("ProbeInputToData"),
          isTrue("ProbeDataToInput"),
        ),
        instantiations: withInput.instantiations - schemaOnly.instantiations,
      },
      output: {
        text: types.Output ?? "",
        snippet: source.outputSnippet,
        match: toMatch(
          aliasContainsAny(withBoth.program, withBoth.file, "Output"),
          isTrue("ProbeOutputToData"),
          isTrue("ProbeDataToOutput"),
        ),
        instantiations: withOutput.instantiations - schemaOnly.instantiations,
      },
      instantiations: withBoth.instantiations - baseline.instantiations,
    };
  } finally {
    probe = undefined;
    fs.rmSync(fileName, { force: true });
  }
};

// The schema always describes `{ id: number; name: string; price: number }`; each case redeclares
// the shared `JsonSchemaOutputData` type locally with a different shape. A library that only
// checks assignability accepts a schema that requires a field the type makes optional, or declares
// one the type doesn't have - both build a schema that disagrees with the type it was written for.
const FROM_TYPE_CASES: Record<FromTypeCase, string> = {
  wrongType: "{ id: number; name: string; price: string }",
  missingField: "{ id: number; name: string; price: number; extra: boolean }",
  optionalField: "{ id: number; name: string; price?: number }",
  extraField: "{ id: number; name: string }",
};

/** The pieces of `types/fromType.ts` the from-type probe recombines into each overlay variant. */
interface FromTypeSource {
  style: FromTypeStyle;
  derived?: boolean;
  note?: string;
  /** The file, unmodified: it already imports the real `Product`, so this is the "matching" case. */
  text: string;
  /** Redeclares `Product` locally with a disagreeing shape, in place of the import. */
  withProductType: (shape: string) => string;
  /** The `schema` declaration, for display. */
  snippet: string;
}

/** Parses `types/fromType.ts`, read off the TypeScript AST rather than hand-typed. */
const parseFromTypeSource = (fileName: string, text: string): FromTypeSource => {
  const file = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
  let sharedImport: ts.ImportDeclaration | undefined;
  let sharedSpecifier: ts.ImportSpecifier | undefined;
  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const namedBindings = statement.importClause?.namedBindings;
    if (!namedBindings || !ts.isNamedImports(namedBindings)) continue;
    const specifier = namedBindings.elements.find(
      (element) => (element.propertyName ?? element.name).text === "JsonSchemaOutputData",
    );
    if (specifier) {
      sharedImport = statement;
      sharedSpecifier = specifier;
      break;
    }
  }
  const schema = findDeclarationText(file, "schema");
  const style = readStringConst(file, "style");
  if (!sharedImport || !sharedSpecifier) {
    throw new Error(`${fileName} does not import \`JsonSchemaOutputData\` from #src`);
  }
  if (!schema) throw new Error(`${fileName} does not export a \`schema\``);
  if (!style) throw new Error(`${fileName} does not export a \`style\``);

  // Other names sharing the import (e.g. `FromTypeStyle`) still need to resolve for every case.
  const namedBindings = sharedImport.importClause!.namedBindings as ts.NamedImports;
  const otherSpecifiers = namedBindings.elements.filter((element) => element !== sharedSpecifier);
  const remainingImport = otherSpecifiers.length
    ? `import ${sharedImport.importClause?.phaseModifier === ts.SyntaxKind.TypeKeyword ? "type " : ""}{ ${otherSpecifiers
        .map((element) => element.getText(file))
        .join(", ")} } from ${sharedImport.moduleSpecifier.getText(file)};\n`
    : "";

  const before = text.slice(0, sharedImport.getFullStart());
  const after = text.slice(sharedImport.getEnd());
  return {
    style: v.parse(fromTypeStyleSchema, style),
    derived: readBooleanConst(file, "derived"),
    note: readStringConst(file, "note"),
    text,
    withProductType: (shape) =>
      `${before}${remainingImport}type ${sharedSpecifier.name.text} = ${shape};${after}`,
    snippet: schema.replace(/^export /, ""),
  };
};

const readFromTypeSource = (fileName: string) =>
  parseFromTypeSource(fileName, fs.readFileSync(fileName, "utf8"));

const probeFromType = (fileName: string, source: FromTypeSource): FromTypeProbeResult => {
  try {
    assertChecks("from-type", check(fileName, source.text));

    // A schema generated from the type cannot disagree with it, so there is nothing to reject.
    const rejected = (name: FromTypeCase) =>
      source.derived ||
      check(fileName, source.withProductType(FROM_TYPE_CASES[name])).diagnostics.length > 0;

    return {
      style: source.style,
      derived: source.derived,
      note: source.note,
      snippet: source.snippet,
      cases: {
        wrongType: rejected("wrongType"),
        missingField: rejected("missingField"),
        optionalField: rejected("optionalField"),
        extraField: rejected("extraField"),
      },
    };
  } finally {
    probe = undefined;
    fs.rmSync(fileName, { force: true });
  }
};

/**
 * Measures one library. `directory` is the library's folder under `schemas/libraries`.
 *
 * Every count is a delta: the bare imports are subtracted from the schema declaration, and the
 * schema declaration from each type extraction, so a number covers only the work its own line
 * added. The headline `instantiations` is what a consumer pays for a schema and the types it
 * produces - declaring the schema and reading both input and output types.
 */
export const probeTypes = (directory: string): TypeProbeResult => {
  const typesDir = path.join(directory, "types");
  const fileName = path.join(typesDir, PROBE_FILE_NAME);
  const index = readIndexSource(path.join(typesDir, "index.ts"));
  const fromTypeFile = path.join(typesDir, "fromType.ts");
  return {
    note: index.note,
    noInference: index.noInference,
    inference: index.inference && probeInference(fileName, index.inference),
    fromType: fs.existsSync(fromTypeFile)
      ? probeFromType(fileName, readFromTypeSource(fromTypeFile))
      : undefined,
  };
};

/** Exposed for tests: probes inference against fabricated `types/index.ts` text. */
export const probeInferenceText = (fileName: string, text: string): InferenceProbeResult => {
  const index = parseIndexSource(fileName, text);
  if (!index.inference) throw new Error(`${fileName} exports no \`Input\`/\`Output\` to probe`);
  return probeInference(fileName, index.inference);
};

/** Exposed for tests: probes from-type against fabricated `types/fromType.ts` text. */
export const probeFromTypeText = (fileName: string, text: string): FromTypeProbeResult =>
  probeFromType(fileName, parseFromTypeSource(fileName, text));

export const typescriptVersion = ts.version;
