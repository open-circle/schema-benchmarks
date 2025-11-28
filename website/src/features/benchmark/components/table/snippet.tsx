import { ToggleButton } from "@/components/button/toggle";
import { CodeBlock } from "@/components/code";
import { MdSymbol } from "@/components/symbol";

export interface SnippetProps {
  code: string;
}

export function Snippet({ code }: SnippetProps) {
  return (
    <ToggleButton
      tooltip={{
        subhead: "Code snippet",
        supporting: (
          <div className="snippet">
            <CodeBlock>{code}</CodeBlock>
            <p>(Commented code is not benchmarked)</p>
          </div>
        ),
      }}
    >
      <MdSymbol>code</MdSymbol>
    </ToggleButton>
  );
}
