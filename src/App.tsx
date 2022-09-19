import React, {useEffect, useState} from 'react'
import {DataManager} from "./scripts/DataManager";
import {Metro} from "./scripts/Metro";

function App() {
	
	const [stations, setStations] = useState(Metro.stations);
	const [keyword, setKeywoard] = useState("");
	
	useEffect(() => {
		DataManager.readMetroJson();
	}, []);
	
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setKeywoard(event.target.value)
	}
	
	const filteredStations = stations.filter(station => station.info.name.toLowerCase().includes(keyword.toLowerCase()))
	
	return (
		<div className="App">
			<input type="text" onChange={(e) => handleChange(e)}/>
			<br></br>
			{filteredStations.map((station, index) => <>
				{station.info.name} | {station.metroLine?.info.name}
				<br></br>
			</>)}
			{/*{Metro.stations[10].info.name} - {Metro.stations[20].info.name}*/}
			<br></br>
			"Dijkstra"
			<br></br>
			{stations.length > 0 && Metro.dijkstra(Metro.stations[10], Metro.stations[20]).map(p => p.toString()).join(("\n"))}
		
		</div>
	)
}

export default App
