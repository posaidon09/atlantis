import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Card from "../components/Card";

export default function Search() {
	const [results, setResults] = useState([]);
	useEffect(() => {
		const path = window.location.pathname.split("/");
		path.shift();
		axios
			.get(`${import.meta.env.VITE_BACKEND}/meta/anilist/${path[1]}`)
			.then((res) => {
				setResults(res.data.results);
			});
	}, []);
	return (
		<div className="overflow-auto min-h-screen">
			<div className="flex flex-row flex-wrap gap-5 justify-center items-center mt-32">
				{results.map((item, index) => {
					return (
						<Card
							key={index}
							title={item.title.english ?? item.title.romaji}
							banner={item.image}
							url={`/anime/${item.id}`}
							delay={index * 100}
						/>
					);
				})}
			</div>
		</div>
	);
}
