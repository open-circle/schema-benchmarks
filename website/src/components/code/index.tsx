import { highlight, languages } from "prismjs";

function useHighlight(code: string, language: string) {
	const grammar = languages[language];
	if (!grammar) throw new Error(`Language not found: ${language}`);
	return highlight(code, grammar, language);
}

export function InlineCode({
	children,
	language = "typescript",
}: {
	children: string;
	language?: string;
}) {
	const highlighted = useHighlight(children, language);
	return (
		<code
			className={`language-${language}`}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
			dangerouslySetInnerHTML={{ __html: highlighted }}
		/>
	);
}

export function CodeBlock({
	children,
	language = "typescript",
}: {
	children: string;
	language?: string;
}) {
	const highlighted = useHighlight(children, language);
	return (
		<pre className={`language-${language}`}>
			<code
				className={`language-${language}`}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the code we're highlighting
				dangerouslySetInnerHTML={{ __html: highlighted }}
			/>
		</pre>
	);
}
