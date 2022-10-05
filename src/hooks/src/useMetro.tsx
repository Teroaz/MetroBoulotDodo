import metroJSON from "../../assets/data/metro.json"
import {Metro} from "../../api/Metro";
import Line from "../../api/Line";
import Station from "../../api/Station";
import {HexColorString} from "../../assets/data/colors";
import Path from "../../api/Path";
import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";

export type MetroContextType = {
	stations: Station[],
	lines: Line[],
	paths: Path[],
	dataLoaded: boolean,
	dijkstra: (start: Station, end: Station) => Path[],
	getMatrixAdjacency: () => number[][],
	kruskal: () => Path[],
}

const MetroContext = createContext({} as MetroContextType);

export const MetroProvider = ({children}: { children: ReactNode }) => {
	
	const [dataLoaded, setDataLoaded] = useState(false);
	const [stations, setStations] = useState<Station[]>([]);
	const [lines, setLines] = useState<Line[]>([]);
	const [paths, setPaths] = useState<Path[]>([]);
	
	useEffect(() => {
		if (dataLoaded) return;
		
		console.log("Loading metro data...")
		for (const station of metroJSON.stations) {
			Metro.stations.push(new Station(station));
		}
		
		for (const line of metroJSON.lines) {
			const stations = line.stations.map(id => Metro.stations.find(station => station.info.id === id)!);
			Metro.lines.push(new Line({name: line.name, stations, color: line.color as HexColorString}));
		}
		
		for (const path of metroJSON.paths) {
			Metro.paths.push(new Path({
				first: Metro.stations.find(station => station.info.id === path.first)!,
				second: Metro.stations.find(station => station.info.id === path.second)!,
				time: path.time
			}));
		}
		
		console.log("Metro data loaded.")
		
		setStations(Metro.stations)
		setLines(Metro.lines)
		setPaths(Metro.paths)
		setDataLoaded(true);
	}, [])
	
	const memoedValue = useMemo((): MetroContextType => ({
		stations,
		lines,
		paths,
		dataLoaded,
		dijkstra: Metro.dijkstra,
		getMatrixAdjacency: Metro.getMatrixAdjacency,
		kruskal: Metro.kruskal
	}), [stations, lines, paths, dataLoaded]);
	
	return (
		<MetroContext.Provider value={memoedValue}>
			{children}
		</MetroContext.Provider>
	)
}

const useMetro = () => useContext(MetroContext);

export default useMetro;
