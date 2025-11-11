export function Header({ name = "Page name" }: { name?: string }) {
	return (
		<header className="page-header">
			<h1 className="headline5">{name}</h1>
		</header>
	);
}
