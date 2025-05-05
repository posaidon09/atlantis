export default function Card({ banner, title, url, className, style, delay }) {
	return (
		<a
			href={url}
			className={`break-inside-avoid inline-block w-52 transition-opacity duration-700 ease-in-out ${className}`}
			style={{
				...style,
				transitionDelay: `${delay}ms`,
			}}
		>
			<div className="bg-zinc-900 rounded pb-3 shadow-md overflow-hidden transition-all duration-300 hover:scale-105">
				<img src={banner} alt={title} className="w-full object-cover" />
				<p className="text-white text-sm font-medium p-2 mt-2 text-center">
					{title}
				</p>
			</div>
		</a>
	);
}
