import { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";

export default function Root() {
	const [items, setItems] = useState({
		top_airing: [],
		popular: [],
		recent: [],
		movies: [],
	});
	const [anim, setAnim] = useState({ opacity: "0%" });
	const [scroll, setScroll] = useState({
		top: 0,
		popular: 0,
		recent: 0,
		movies: 0,
	});

	useEffect(() => {
		const backend = import.meta.env.VITE_BACKEND;
		const fetchCategory = async (endpoint, key) => {
			const res = await axios.get(`${backend}/${endpoint}`);
			const updated = res.data.results
				.filter((item) => !item.nsfw)
				.map((item) => ({
					...item,
					image: item.image.replace("/300x400/", "/800x900/"),
				}));
			setItems((prev) => ({ ...prev, [key]: updated }));
		};

		fetchCategory("top-airing", "top_airing");
		fetchCategory("most-popular", "popular");
		fetchCategory("recent-added", "recent");
		fetchCategory("movies", "movies");

		setTimeout(() => setAnim({ opacity: "100%" }), 1000);
	}, []);

	const sections = [
		{ title: "Top airing", data: items.top_airing, id: "top" },
		{ title: "Popular", data: items.popular, id: "popular" },
		{ title: "Recent", data: items.recent, id: "recent" },
		{ title: "Movies", data: items.movies, id: "movies" },
	];

	return (
		<div className="overflow-auto min-h-screen pb-52 px-6">
			{sections.map(({ title, data, id }) => (
				<div key={title} className="mb-20 mt-10">
					<h1
						className="text-3xl font-bold text-center text-white mb-8 transition-all duration-300"
						style={anim}
					>
						{title}
					</h1>
					<div className="px-20 flex flex-row gap-6 justify-center">
						<button
							onClick={() =>
								setScroll((prev) => ({
									...prev,
									[id]: prev[id] - 1,
								}))
							}
							className="bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded transition-all duration-300 delay-700"
							style={anim}
							disabled={scroll[id] === 0}
						>
							{"<"}
						</button>

						{data.slice(scroll[id], scroll[id] + 6).map((item, index) => (
							<div key={index} className="group relative w-52">
								<Card
									key={item.id}
									title={item.title}
									banner={item.image}
									url={`/anime/${item.id}`}
									delay={index * 100}
									style={anim}
									className={"group"}
								/>
								<div
									className={`absolute top-20 ${index == 5 ? "right" : "left"}-10 pointer-events-none bg-gradient-to-br from-gray-900 z-50 to-purple-950/50 backdrop-blur-xl ring ring-purple-500 p-6 w-96 h-80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
								>
									<div className="text-white text-xl text-center font-bold font-mono">
										{item.title}
									</div>
								</div>
							</div>
						))}

						<button
							onClick={() =>
								setScroll((prev) => ({
									...prev,
									[id]: prev[id] + 1,
								}))
							}
							className="bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded transition-all duration-300 delay-700"
							style={anim}
							disabled={scroll[id] + 6 >= data.length}
						>
							{">"}
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
