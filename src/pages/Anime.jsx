import Icon from "./../components/Icon";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSessionStorage } from "@uidotdev/usehooks";
export default function Anime() {
	const [info, setInfo] = useState({});
	const [loaded, setLoaded] = useState(false);
	const [scroll, setScroll] = useSessionStorage({
		scrollable: false,
		index: 0,
	});

	useEffect(() => {
		const controller = new AbortController();
		const path = window.location.pathname.split("/");
		path.shift();

		axios
			.get(
				`https://atlantis-backend.vercel.app/anime/zoro/info?id=${path[1]}`,
				{
					signal: controller.signal,
				},
			)
			.then((res) => {
				setInfo(res.data);
				setLoaded(true);

				if (res.data.totalEpisodes > 100) {
					setScroll({
						scrollable: true,
						index: 0,
					});
				}
			})
			.catch((err) => {
				if (axios.isCancel(err)) {
					console.log("Request cancelled:", err.message);
				} else {
					console.error("Request failed:", err.message);
				}
			});

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<div className="overflow-auto min-h-screen">
			<div className="flex flex-col gap-8 items-center justify-center mt-10">
				{!loaded ? (
					<Icon name="TbLoader2" className="animate-spin text-white text-4xl" />
				) : (
					<>
						<div className="flex flex-row gap-10 justify-start items-start">
							<div className="flex flex-col">
								<div className="flex flex-row w-[550px] gap-2 flex-wrap items-start justify-start">
									{info.episodes
										.slice(scroll.index * 100, (scroll.index + 1) * 100)
										.map((episode) => (
											<a
												href={`/watch/${episode.id}`}
												key={episode.id}
												className={`size-10 ${episode.isFiller ? "bg-yellow-500" : "bg-green-500"} text-white rounded-xl text-center flex items-center justify-center`}
											>
												{episode.number}
											</a>
										))}
								</div>
								{info.totalEpisodes > 100 ? (
									<div className="flex flex-row gap-10 items-center justify-center mt-4">
										<button
											onClick={() => {
												setScroll((prev) => ({
													...prev,
													index: prev.index - 1,
												}));
												console.log(scroll);
											}}
											className="bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded"
											disabled={scroll.index == 0}
										>
											{"<"}
										</button>
										<button
											onClick={() => {
												setScroll((prev) => ({
													...prev,
													index: prev.index + 1,
												}));
												console.log(info.totalEpisodes / 100);
											}}
											className="bg-green-600 disabled:bg-gray-600 px-4 py-2 rounded"
											disabled={
												scroll.index == Math.floor(info.totalEpisodes / 100)
											}
										>
											{">"}
										</button>
									</div>
								) : (
									""
								)}
							</div>
							<img
								src={info.image.replace("/300x400/", "/3000x4000/")}
								className="w-96 h-full"
								alt={info.title}
							/>
							<div className="flex flex-col gap-2">
								<h1 className="text-3xl text-white font-bold">{info.title}</h1>
								<p className="text-white/80 text-xl mt-10">
									<strong className="text-white">Sub:</strong>{" "}
									{info.hasSub ? "available" : "unavailable"}
								</p>
								<p className="text-white/80 text-xl">
									<strong className="text-white">Dub:</strong>{" "}
									{info.hasDub ? "available" : "unavailable"}
								</p>
								<p className="text-white/80 text-xl">
									<strong className="text-white">Status:</strong> {info.status}
								</p>
								<p className="text-white/80 text-xl">
									<strong className="text-white">Release date:</strong>{" "}
									{info.season}
								</p>
								<p className="text-white/80 text-xl">
									<strong className="text-white">Episodes:</strong>{" "}
									{info.totalEpisodes}
								</p>
								<p className="text-white/80 text-xl w-52">
									<strong className="text-white">Genres:</strong>{" "}
									{info.genres.join(", ")}
								</p>
							</div>
						</div>
						<p className="w-[1400px] text-white/90 text-lg text-center">
							{info.description}
						</p>
					</>
				)}
			</div>
		</div>
	);
}
