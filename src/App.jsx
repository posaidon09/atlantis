import "./App.css";
import Root from "./pages/Root.jsx";
import Anime from "./pages/Anime.jsx";
import Video from "./pages/Video.jsx";
import Search from "./pages/Search.jsx";

function App() {
	function getPage() {
		const path = window.location.pathname.split("/");
		path.shift();
		const sites = {
			home: <Root />,
			anime: <Anime />,
			watch: <Video />,
			search: <Search />,
		};
		if (path[0] == "") window.location.pathname = "/home";
		try {
			return sites[path[0]];
		} catch {
			window.location.pathname = "/home";
			return sites[0];
		}
	}

	function handleSubmit(e) {
		e.preventDefault();
		const query = e.target.anime.value;
		window.location.pathname = `/search/${query}`;
	}

	return (
		<div className="bg-gradient-to-br bg-black from-gray-950 from-30% to-purple-950/50 to-100% ">
			<div className="flex flex-row items-center justify-center w-screen pb-10 gap-10 fixed z-30 bg-transparent backdrop-blur-xl rounded-b-xl">
				<a href="/home" className="inline-block">
					<h1
						className="text-white font-mono font-bold text-4xl mt-5 ml-5 hover:scale-110 hover:font-extrabold transition-all duration-300"
						style={{
							textShadow: `
			                -2px -2px 0 #3b82f6,
			                2px -2px 0 #3b82f6,
			                -2px  2px 0 #3b82f6,
			                2px  2px 0 #3b82f6
		                `,
						}}
					>
						ATLANTIS
					</h1>
				</a>

				<form
					className="w-[80%] h-10 mt-3 flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-8"
					onSubmit={(event) => handleSubmit(event)}
				>
					<button type="submit" className="bg-transparent text-white text-xl">
						🔎
					</button>
					<input
						className=" bg-transparent placeholder:text-xl text-white w-full h-10 outline-none"
						placeholder="Search for an anime"
						id="anime"
					/>
				</form>
			</div>
			{getPage()}
		</div>
	);
}

export default App;
