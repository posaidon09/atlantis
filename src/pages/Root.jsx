import { useEffect, useState } from "react";
import Card from "../components/Card";
import axios from "axios";
import Icon from "./../components/Icon";

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
			const res = await axios.get(
				`${backend}/meta/anilist/${endpoint}?provider=zoro`,
			);
			const updated = res.data.results.map((item) => ({
				...item,
				image: item.image.replace("/300x400/", "/800x900/"),
			}));
			setItems((prev) => ({ ...prev, [key]: updated }));
		};

		fetchCategory("top", "top_airing");
		fetchCategory("popular", "popular");
		fetchCategory("recent", "recent");
		fetchCategory("movies", "movies");
		console.log(items);
		setTimeout(() => setAnim({ opacity: "100%" }), 1000);
	}, []);

	const sections = [
		{ title: "Popular", data: items.popular, id: "popular" },
		{ title: "Top airing", data: items.top_airing, id: "top" },
		{ title: "Movies", data: items.movies, id: "movies" },
		{ title: "Recent", data: items.recent, id: "recent" },
	];

	return (
		<div className="overflow-auto min-h-screen pb-52 px-6">
			{sections.map(({ title, data, id }) => (
				<div key={title} className="mb-20 mt-32">
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
							className="bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded transition-all duration-300"
							style={anim}
							disabled={scroll[id] === 0}
						>
							{"<"}
						</button>

						{data.slice(scroll[id], scroll[id] + 6).map((item, index) => (
							<div key={index} className="group relative w-52">
								<Card
									key={index}
									title={item?.title?.english ?? item?.title?.romaji}
									banner={item?.image ?? ""}
									url={`/anime/${item?.id}`}
									delay={index * 100}
									style={anim}
									className={"group"}
								/>
								<div
									className={`absolute top-20 ${index == 5 ? "right-10" : "left-10"} pointer-events-none bg-gradient-to-br from-gray-900 z-50 to-purple-950/50 backdrop-blur-xl ring ring-purple-500 p-6 w-96 min-h-[400px] max-h-[700px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
								>
									<p className="text-white text-xl font-bold font-mono">
										{item?.title?.english ?? item?.title?.romaji}
									</p>
									<div className="text-white flex flex-row gap-10">
										<div className="flex flex-col gap-3">
											<div className="flex flex-row gap-2">
												<Icon
													className="text-yellow-500 mt-[3px] size-5"
													name="TbStarFilled"
												/>
												<p>{item?.rating / 10}</p>
											</div>
											<p className="font-bold">{item?.type}</p>
											{item?.type?.toLowerCase() !== "movie" && (
												<p className="w-max flex flew-row gap-1">
													<p className="font-bold">Episodes: </p>
													{item?.totalEpisodes}
												</p>
											)}
											<p className="w-max flex flew-row gap-1">
												<p className="font-bold">Status: </p>
												{item?.status}
											</p>
										</div>
										<p className="font-bold">{item?.genres.join(", ")}</p>
									</div>
									<p className="text-white mt-4">
										{item?.description
											?.replaceAll("<br>", "")
											.replaceAll("</br>", "")
											.replaceAll("<b>", "")
											.replaceAll("</b>", "")
											.replaceAll("<i>", "")
											.replaceAll("</i>", "")
											.split(" ")
											?.slice(0, 40)
											?.join(" ")}
										...
									</p>
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
							className="bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded transition-all duration-300"
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
