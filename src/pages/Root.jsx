import { useEffect } from "react";
import Card from "../components/Card";
import axios from "axios";
import { useState } from "react";

export default function Root() {
	const [items, setItems] = useState([]);
	const [anim, setAnim] = useState({
		opacity: "0%",
	});
	useEffect(() => {
		axios
			.get(`https://atlantis-backend.vercel.app/anime/zoro/top-airing`)
			.then((res) => {
				const updated = res.data.results
					.filter((item) => !item.nsfw)
					.map((item) => ({
						...item,
						image: item.image.replace("/300x400/", "/800x900/"),
					}));
				setItems(updated);
			});
		setTimeout(() => {
			setAnim({
				opacity: "100%",
			});
		}, 1000);
	}, []);

	return (
		<div className="overflow-auto min-h-screen pb-52">
			<div className="mt-10 flex flex-row items-center justify-center flex-wrap gap-6">
				{items.map((item, index) => {
					return (
						<Card
							key={index}
							title={item.title}
							banner={item.image}
							url={`/anime/${item.id}`}
							delay={index * 100}
							style={anim}
						/>
					);
				})}
			</div>
		</div>
	);
}
