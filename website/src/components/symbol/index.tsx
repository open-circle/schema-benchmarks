export interface MdSymbolProps {
	children: string;
	flipRtl?: boolean;

	// provided for convenience, but prefer using CSS vars where possible
	fill?: boolean;
	weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
	grade?: number;
	opticalSize?: number;
	size?: number;
}

export function MdSymbol({
	children,
	fill,
	weight,
	grade,
	opticalSize,
	size,
	flipRtl,
}: MdSymbolProps) {
	return (
		<span
			className="md-symbol material-symbols-sharp"
			data-flip-rtl={flipRtl ? true : undefined}
			style={
				{
					"--icon-fill": typeof fill === "boolean" ? (fill ? 1 : 0) : undefined,
					"--icon-weight": weight,
					"--icon-grade": grade,
					"--icon-optical-size": opticalSize,
					"--icon-size": size,
				} as React.CSSProperties
			}
		>
			{children}
		</span>
	);
}
