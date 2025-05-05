import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import { useEffect, useState } from "react";
import axios from "axios";
import platform from "platform";

export default function Video() {
	const [videoUrl, setVideoUrl] = useState("");
	const [subtitleUrl, setSubtitleUrl] = useState("");
	const [isTv, setIsTv] = useState(false);

	function isSmartTV() {
		const { product, os, manufacturer } = platform;
		return (
			/product|smarttv|googletv|appletv|viera|aquos/i.test(product || "") ||
			/os|webos|tizen|hbbtv/i.test(os?.family || "") ||
			/manufacturer|samsung|lg|sony/i.test(manufacturer || "")
		);
	}

	useEffect(() => {
		const detectedTv = isSmartTV();
		setIsTv(detectedTv);
		console.log("Smart TV detected:", detectedTv);

		const path = window.location.pathname.split("/");
		path.shift();

		axios
			.get(`${import.meta.env.VITE_BACKEND}/watch/${path[1]}`)
			.then((res) => {
				const data = res.data;

				if (data?.sources?.length > 0) {
					setVideoUrl(data.sources[0].url);
				}

				if (data?.subtitles?.length > 0) {
					const engSubtitle = data.subtitles.find((s) =>
						s.lang.toLowerCase().includes("english"),
					);
					setSubtitleUrl(engSubtitle ? engSubtitle.url : data.subtitles[0].url);
				}
			})
			.catch((err) => {
				console.error("Error loading video data:", err.message);
			});
	}, []);

	const streamUrl =
		videoUrl && `${import.meta.env.VITE_PROXY}/` + encodeURIComponent(videoUrl);
	const proxiedSubtitleUrl =
		subtitleUrl &&
		`${import.meta.env.VITE_PROXY}/` + encodeURIComponent(subtitleUrl);

	return (
		<div className="min-h-screen overflow-auto flex items-center justify-center">
			{isTv && <p className="text-white text-sm">This is a TV</p>}
			{streamUrl && (
				<MediaPlayer
					title="Some anime idk"
					src={{ src: streamUrl, type: "hls" }}
					controls
					crossOrigin="anonymous"
					style={{ width: "60%", height: "auto" }}
					className="bg-black"
				>
					<MediaProvider />
					{proxiedSubtitleUrl && (
						<Track
							src={proxiedSubtitleUrl}
							kind="subtitles"
							label="English"
							srclang="en"
							default
						/>
					)}
				</MediaPlayer>
			)}
		</div>
	);
}
