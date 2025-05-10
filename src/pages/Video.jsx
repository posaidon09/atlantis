import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Icon from "../components/Icon";
import { useSessionStorage } from "@uidotdev/usehooks";

export default function Video() {
	const path = window.location.pathname.split("/");
	path.shift();
	const anime = path[1].split("$")[0];
	const [videoUrl, setVideoUrl] = useState("");
	const [subtitleUrl, setSubtitleUrl] = useState("");
	const [scroll, setScroll] = useSessionStorage(`watch-${anime}`, {
		index: 0,
		scrollable: true,
	});
	const [info, setInfo] = useSessionStorage(`watchinfo-${anime}`, {});
	const [id, setId] = useState(null);

	useEffect(() => {
		if (Object.keys(info).length === 0) {
			axios
				.get(`${import.meta.env.VITE_BACKEND}/anime/zoro/info?id=${anime}`)
				.then((res) => {
					const data = res.data;
					setInfo(data);
					const ids = data.episodes.map((episode) => episode.id);
					setId(ids.indexOf(path[1]) + 1);
				});
		} else {
			const ids = info.episodes.map((episode) => episode.id);
			setId(ids.indexOf(path[1]) + 1);
		}
		axios
			.get(`${import.meta.env.VITE_BACKEND}/anime/zoro/watch/${path[1]}`)
			.then((res) => {
				const data = res.data;

				if (data?.sources?.length > 0) {
					setVideoUrl(data.sources[0].url);
				}
				setTimeout(() => {
					if (data?.subtitles?.length > 0) {
						const engSubtitle = data.subtitles.find((s) =>
							s.lang.toLowerCase().includes("english"),
						);
						setSubtitleUrl(engSubtitle.url);
					}
				}, 1000);
			})
			.catch((err) => {
				console.error("Error loading video data:", err.message);
			});
	}, []);

	const streamUrl =
		videoUrl && `${import.meta.env.VITE_PROXY}/` + encodeURIComponent(videoUrl);
	console.log(streamUrl);
	return (
		<div className="min-h-screen overflow-auto">
			<div className="flex justify-center items-center mt-36 gap-10">
				<div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1 rounded-2xl w-[60%] h-auto ">
					<div className="bg-black rounded-xl aspect-video">
						{streamUrl.length > 0 && Object.keys(info).length !== 0 && (
							<MediaPlayer
								title={info.episodes[id].title}
								src={streamUrl}
								controls
								load="eager"
								crossOrigin="anonymous"
								className="rounded-xl"
							>
								<MediaProvider />
								{subtitleUrl && (
									<Track
										src={subtitleUrl}
										kind="subtitles"
										label="English"
										srclang="en"
										default
									/>
								)}
							</MediaPlayer>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-2 bg-black/40 ring-[4px] ring-gray-500 rounded-xl p-4">
					<div className="w-[550px] flex flew-row flex-wrap justify-center gap-2 mt-10">
						{info?.episodes?.length > 0 ? (
							info.episodes
								.slice(scroll.index * 100, (scroll.index + 1) * 100)
								.map((episode) => (
									<a
										href={`/watch/${episode.id}`}
										key={episode.id}
										className={`size-10 ${episode.number == id ? "bg-blue-500" : episode.isFiller ? "bg-yellow-500" : "bg-green-500"} text-white rounded-xl text-center flex items-center justify-center`}
									>
										{episode.number}
									</a>
								))
						) : (
							<div className="flex flex-col gap-10 justify-center items-center">
								<Icon
									name="TbLoader2"
									className="animate-spin text-white text-4xl"
								/>
								<p className="text-white text-xl">Loading episode list...</p>
							</div>
						)}
					</div>
					{info?.episodes?.length > 1 && (
						<div className="flex flex-row gap-10 items-center justify-center mt-4">
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
							>
								{">"}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
