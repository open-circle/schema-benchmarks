import type { ReactNode } from "react";
import { type Bounds, getColor, getIcon } from "@/data/scale";
import { MdSymbol } from "../symbol";

export interface ScalerProps {
	value: number;
	bounds: Bounds;
	reverse?: boolean;
	children: ReactNode;
}

export function Scaler({ value, bounds, reverse, children }: ScalerProps) {
	return (
		<span className="scaler">
			{children}
			<MdSymbol
				style={{
					color: `var(--${getColor(value, bounds, reverse)})`,
				}}
			>
				{getIcon(value, bounds, reverse)}
			</MdSymbol>
		</span>
	);
}
