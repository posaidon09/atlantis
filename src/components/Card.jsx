export default function Card({ banner, title, url, className, style, delay }) {
	return (
		<div
			className={`group relative w-52 transition-all hover:scale-105 duration-700 ease-in-out ${className}`}
			style={{ ...style, transitionDelay: `${delay}ms` }}
		>
			<a href={url}>
				<div className="bg-zinc-900 rounded pb-3 shadow-md relative">
					<img src={banner} alt={title} className="w-60 h-80 -z-10" />
					<p className="text-white text-sm truncate font-medium p-2 mt-2 text-center">
						{title}
					</p>
				</div>
			</a>
		</div>
	);
}
