import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

import type { FromTypeCase, TypeInferenceBenchmarkConfig } from "@schema-benchmarks/schemas";
import ts from "typescript-5";

/**
 * Reads the types a library infers for the shared product schema, using the TypeScript compiler
 * API: `program.getInstantiationCount()` for the type instantiations a schema costs, and
 * `checker.typeToString()` for the type an editor shows on hover.
 *
 * The repository type checks with TypeScript 7, which ships no compiler API, so the probe pins its
 * own TypeScript 5 - `typescriptVersion` is reported alongside the results, since a count only
 * means anything next to the compiler that produced it.
 *
 * The probe file is written into the library's folder so that relative imports and the `schemas`
 * package's own dependencies resolve exactly as they do for the rest of its sources.
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
    throw new Error(errors.map((e) => ts.flattenDiagnosticMessageText(e.messageText, "\n")).join());
  }
  // A probe declares more than it uses - every alias below the one being read is dead code.
  return { ...options, noUnusedLocals: false, noUnusedParameters: false };
};

let probe: { fileName: string; text: string; version: number } | undefined;

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
  probe = { fileName, text, version: (probe?.version ?? 0) + 1 };
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
    if (declaration?.name.getText(file) !== "probeSchema") continue;
    return checker.typeToString(
      checker.getTypeAtLocation(declaration.name),
      undefined,
      // The length of the type is a result, so it must not be truncated.
      ts.TypeFormatFlags.NoTruncation,
    );
  }
  return "";
};

/** How an inferred type relates to the data the schema is meant to describe. */
export type TypeMatch = "exact" | "narrower" | "wider" | "any" | "mismatch";

export interface DirectionProbeResult {
  text: string;
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
  /** Whether the compiler rejected each way a schema can disagree with the type. */
  cases: Record<FromTypeCase, boolean>;
}

export interface TypeProbeResult {
  inference?: InferenceProbeResult;
  fromType?: FromTypeProbeResult;
}

const PRELUDE = `import type { JsonSchemaOutputData, ProductData } from "#src";\n`;
const SCHEMA_DECL = (config: TypeInferenceBenchmarkConfig) =>
  `const probeSchema = ${config.schema};\n`;
const INPUT_DECL = (config: TypeInferenceBenchmarkConfig) => `type ProbeInput = ${config.input};\n`;
const OUTPUT_DECL = (config: TypeInferenceBenchmarkConfig) =>
  `type ProbeOutput = ${config.output};\n`;

// `0 extends 1 & T` is the standard `any` detector: only `any` distributes into both sides.
const MATCH_DECLS = `type ProbeInputIsAny = 0 extends 1 & ProbeInput ? true : false;
type ProbeOutputIsAny = 0 extends 1 & ProbeOutput ? true : false;
type ProbeInputToData = [ProbeInput] extends [ProductData] ? true : false;
type ProbeDataToInput = [ProductData] extends [ProbeInput] ? true : false;
type ProbeOutputToData = [ProbeOutput] extends [ProductData] ? true : false;
type ProbeDataToOutput = [ProductData] extends [ProbeOutput] ? true : false;
`;

const toMatch = (isAny: boolean, toData: boolean, fromData: boolean): TypeMatch => {
  if (isAny) return "any";
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

// The schema always describes `{ id: number; name: string; price: number }`; each case changes the
// type it is checked against. A library that only checks assignability accepts a schema that
// requires a field the type makes optional, or declares one the type doesn't have - both build a
// schema that disagrees with the type it was written for.
const FROM_TYPE_CASES: Record<FromTypeCase | "matching", string> = {
  matching: "{ id: number; name: string; price: number }",
  wrongType: "{ id: number; name: string; price: string }",
  missingField: "{ id: number; name: string; price: number; extra: boolean }",
  optionalField: "{ id: number; name: string; price?: number }",
  extraField: "{ id: number; name: string }",
};

const probeFromType = (
  fileName: string,
  imports: string,
  fromType: NonNullable<TypeInferenceBenchmarkConfig["fromType"]>,
): FromTypeProbeResult => {
  const compile = (type: string) =>
    check(fileName, `${imports}type Product = ${type};\n${fromType.schema}\n`);

  assertChecks("from-type", compile(FROM_TYPE_CASES.matching));

  // A schema generated from the type cannot disagree with it, so there is nothing to reject.
  const rejected = (name: FromTypeCase) =>
    fromType.derived || compile(FROM_TYPE_CASES[name]).diagnostics.length > 0;

  return {
    cases: {
      wrongType: rejected("wrongType"),
      missingField: rejected("missingField"),
      optionalField: rejected("optionalField"),
      extraField: rejected("extraField"),
    },
  };
};

const probeInference = (
  fileName: string,
  imports: string,
  config: TypeInferenceBenchmarkConfig,
): InferenceProbeResult => {
  const schema = `${imports}${SCHEMA_DECL(config)}`;
  const baseline = check(fileName, imports);
  assertChecks("imports", baseline);
  const schemaOnly = check(fileName, schema);
  assertChecks("schema", schemaOnly);
  const withInput = check(fileName, `${schema}${INPUT_DECL(config)}`);
  assertChecks("input", withInput);
  const withOutput = check(fileName, `${schema}${OUTPUT_DECL(config)}`);
  assertChecks("output", withOutput);

  const both = `${schema}${INPUT_DECL(config)}${OUTPUT_DECL(config)}`;
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
      text: types.ProbeInput ?? "",
      match: toMatch(
        isTrue("ProbeInputIsAny"),
        isTrue("ProbeInputToData"),
        isTrue("ProbeDataToInput"),
      ),
      instantiations: withInput.instantiations - schemaOnly.instantiations,
    },
    output: {
      text: types.ProbeOutput ?? "",
      match: toMatch(
        isTrue("ProbeOutputIsAny"),
        isTrue("ProbeOutputToData"),
        isTrue("ProbeDataToOutput"),
      ),
      instantiations: withOutput.instantiations - schemaOnly.instantiations,
    },
    instantiations: withOutput.instantiations - baseline.instantiations,
  };
};

/**
 * Measures one library. `directory` is the library's folder under `schemas/libraries`.
 *
 * Every count is a delta: the bare imports are subtracted from the schema declaration, and the
 * schema declaration from each type extraction, so a number covers only the work its own line
 * added. The headline `instantiations` is what a consumer pays for a schema and the type it
 * produces - declaring the schema and reading its output type.
 */
export const probeTypes = (
  directory: string,
  config: TypeInferenceBenchmarkConfig,
): TypeProbeResult => {
  const fileName = path.join(directory, PROBE_FILE_NAME);
  const imports = `${PRELUDE}${config.imports}\n`;
  try {
    return {
      inference: config.noInference ? undefined : probeInference(fileName, imports, config),
      fromType: config.fromType && probeFromType(fileName, imports, config.fromType),
    };
  } finally {
    probe = undefined;
    fs.rmSync(fileName, { force: true });
  }
};

export const typescriptVersion = ts.version;
