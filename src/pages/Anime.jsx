import Icon from "./../components/Icon";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSessionStorage } from "@uidotdev/usehooks";

export default function Anime() {
	const path = window.location.pathname.split("/");
	path.shift();
	const [info, setInfo] = useSessionStorage(`info-${path[1]}`, {});
	const [loaded, setLoaded] = useState(false);
	const [scroll, setScroll] = useSessionStorage(`scroll-${path[1]}`, {
		scrollable: false,
		index: 0,
		page: 0,
	});

	useEffect(() => {
		const controller = new AbortController();
		if (Object.keys(info).length === 0) {
			axios
				.get(
					`${import.meta.env.VITE_BACKEND}/meta/anilist/info/${path[1]}?provider=zoro`,
					{
						signal: controller.signal,
					},
				)
				.then((res) => {
					setInfo(res.data);
					setLoaded(true);

					if (
						res.data.totalEpisodes > 100 &&
						scroll.index === 0 &&
						!scroll.scrollable
					) {
						setScroll((prev) => ({
							...prev,
							scrollable: true,
							index: 0,
							page: 0,
						}));
					}
				})
				.catch((err) => {
					if (axios.isCancel(err)) {
						console.log("Request cancelled:", err.message);
					} else {
						console.error("Request failed:", err.message);
					}
				});
		} else {
			setLoaded(true);
			if (
				info.totalEpisodes > 100 &&
				scroll.index === 0 &&
				!scroll.scrollable
			) {
				setScroll((prev) => ({
					...prev,
					scrollable: true,
					index: 0,
					page: 0,
				}));
			}
		}
		return () => {
			controller.abort();
		};
	}, []);

	return (
		<div className="overflow-auto min-h-screen bg-gradient-to-br g-black from-gray-950 from-60% to-purple-950/50 to-100%">
			<img
				src={info.cover}
				className="absolute top-32 h-[50%] aspect-video blur-sm w-screen pointer-events-none z-10 opacity-50"
			/>
			<div className="flex flex-col gap-8 items-center justify-center mt-40">
				{!loaded || !info.episodes ? (
					<Icon
						name="TbLoader2"
						className="animate-spin text-white z-20 text-4xl"
					/>
				) : (
					<>
						<div className="flex flex-row gap-10 justify-start z-20 items-start">
							<img
								src={info.image.replace("/300x400/", "/3000x4000/")}
								className={`w-72 h-[600px] object-cover rounded-3xl border-[5px]`}
								style={{ borderColor: info.color }}
								alt={info.title.english ?? info.title.romaji}
							/>
							<div className="flex flex-col gap-2">
								<h1 className="text-3xl text-white font-bold">
									{info.title.english ?? info.title.romaji}
								</h1>
								<div className="flex flex-row gap-2">
									<Icon
										className="text-yellow-500 mt-[3px] size-5"
										name="TbStarFilled"
									/>
									<p className="text-white">{info?.rating / 10}</p>
								</div>
								<p className="text-white/80 text-xl mt-10">
									<strong className="text-white">Sub/Dub:</strong>{" "}
									{info.subOrDub}
								</p>
								<p className="text-white/80 text-xl">
									<strong className="text-white">Status:</strong> {info.status}
								</p>
								<p className="text-white/80 text-xl">
									<strong className="text-white">Release date:</strong>{" "}
									{info.startDate.day}/{info.startDate.month}/
									{info.startDate.year}
								</p>
								{info.type.toLowerCase() == "tv" && (
									<p className="text-white/80 text-xl">
										<strong className="text-white">Episodes:</strong>{" "}
										{info.totalEpisodes}
									</p>
								)}
								<p className="text-white/80 text-xl">
									<strong className="text-white">Studios:</strong>{" "}
									{info.studios.join(", ")}
								</p>
								<p className="text-white/80 text-xl w-52">
									<strong className="text-white">Genres:</strong>{" "}
									{info.genres.join(", ")}
								</p>
							</div>

							<div className="flex flex-col gap-10">
								<div className="flex flex-row gap-10 justify-center items-center">
									<div
										className={`p-3 text-text-50 bg-black/40 cursor-pointer transition-all duration-200 ring-primary-500 ${scroll.page == 0 ? "ring" : ""} rounded-xl`}
										onClick={() =>
											setScroll((prev) => ({
												...prev,
												page: 0,
											}))
										}
									>
										Episodes
									</div>

									<div
										className={`p-3 text-text-50 bg-black/40 cursor-pointer transition-all duration-200 ring-primary-500 ${scroll.page == 1 ? "ring" : ""} rounded-xl`}
										onClick={() =>
											setScroll((prev) => ({
												...prev,
												page: 1,
											}))
										}
									>
										Description
									</div>

									<div
										className={`p-3 text-text-50 bg-black/40 cursor-pointer transition-all duration-200 ring-primary-500 ${scroll.page == 2 ? "ring" : ""} rounded-xl`}
										onClick={() =>
											setScroll((prev) => ({
												...prev,
												page: 2,
											}))
										}
									>
										More info
									</div>
								</div>
								{scroll.page == 0 ? (
									!(info.type === "MOVIE" && info.totalEpisodes === 1) ? (
										<div className="w-[550px] h-[500px] overflow-y-auto accent-transparent rounded-xl flex flex-col p-4 gap-2 z-30 items-start justify-start bg-black/40">
											{info.episodes
												.slice(0, info.episodes.length)
												.map((episode) => (
													<a
														href={`/watch/${episode.id}`}
														key={episode.id}
														className={`h-10 w-full bg-transparent backdrop-blur-xl ring-2 transition-all duration-300 ${
															episode.isFiller
																? "hover:bg-yellow-500/50 ring-yellow-500"
																: "hover:bg-green-500/50 ring-green-500"
														} text-white rounded-xl flex items-center p-5`}
													>
														<p className="truncate pointer-events-none">
															{episode.number}: {episode.title}
														</p>
													</a>
												))}
											{info.totalEpisodes > 100 && (
												<div className="flex flex-row gap-10 z-20 items-center justify-center mt-4">
													<button
														onClick={() =>
															setScroll((prev) => ({
																...prev,
																index: prev.index - 1,
															}))
														}
														className="bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded"
														disabled={scroll.index == 0}
													>
														{"<"}
													</button>
													<button
														onClick={() =>
															setScroll((prev) => ({
																...prev,
																index: prev.index + 1,
															}))
														}
														className="bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded"
														disabled={
															scroll.index ===
															Math.floor(info.totalEpisodes / 100)
														}
													>
														{">"}
													</button>
												</div>
											)}
										</div>
									) : (
										<div className="w-[550px] h-[500px] overflow-y-auto accent-transparent rounded-xl flex flex-col p-4 gap-2 z-30 items-start justify-start bg-black/40 text-white text-lg flex items-center justify-center">
											<a
												className="p-3 bg-green-500 rounded-xl"
												href={`/watch/${info.episodes[0].id}`}
											>
												Watch the movie
											</a>
										</div>
									)
								) : scroll.page == 1 ? (
									<div className="w-[550px] h-[500px] overflow-y-auto accent-transparent rounded-xl flex flex-col p-4 gap-2 z-30 items-start justify-start bg-black/40 text-white text-lg">
										{info.description
											.replaceAll("<br>", "")
											.replaceAll("</br>", "")
											.replaceAll("<b>", "")
											.replaceAll("</b>", "")}
									</div>
								) : (
									<div className="w-[550px] h-[500px] overflow-y-auto accent-transparent rounded-xl flex flex-col gap-10 p-4 z-30 items-start justify-start bg-black/40 text-white text-lg">
										{info.characters.map((character, index) => (
											<div key={index} className="flex flex-col gap-5">
												<div className="flex flex-row gap-5 w-full">
													<img
														className="rounded-full size-20"
														src={character.image}
													/>
													<p className="mt-5">
														{character.name.userPreferred
															.split(" ")
															.reverse()
															.join(" ")}
													</p>
												</div>
												<div className="flex flex-row gap-5">
													<img
														className="rounded-full size-12 ml-10"
														src={character?.voiceActors[0]?.image}
													/>
													<p className="mt-1">
														{character?.voiceActors[0]?.name?.full ??
															"Unavailable"}
													</p>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
