import React, {useEffect, useState} from 'react'
import {Canvas, Dropdown} from "./components";
import Station from "./api/Station";
import Path from "./api/Path";
import styles from './App.module.css';
import {MetroProvider} from "./hooks";
import {Metro} from "./api/Metro";
import {TimeUtils} from "./utils/TimeUtils";
import Line from "./api/Line";
import secondsToFormattedTime = TimeUtils.secondsToFormattedTime;

function App() {
	
	const [depart, setDepart] = useState<Station | null>(null)
	const [arrival, setArrival] = useState<Station | null>(null)
	const [path, setPath] = useState<Path[] | null>(null)
	const [mode, setMode] = useState<"dijkstra" | "kruskal" | "exploration">("exploration")
	
	const time = path?.reduce((acc, p) => acc + p.info.time, 0) || 0
	
	const [structuredPath, setStructuredPath] = useState<Array<{ line: Line, stations: Station[] }>>();
	
	const giveStructuredPath = () => {
		if (path === null) return
		
		let currentStation = path[0].info.first === depart ? path[0].info.first : path[0].info.second
		let currentLine = currentStation.metroLine
		
		const structuredPath: Array<{ line: Line, stations: Station[] }> = []
		
		path.forEach(p => {
			const nextStation = p.info.first === currentStation ? p.info.second : p.info.first
			const nextLine = nextStation.metroLine
			if (!nextLine || !currentLine) return
			
			if (nextLine === currentLine) {
				if (structuredPath.length === 0) {
					structuredPath.push({line: currentLine, stations: [currentStation, nextStation]})
				} else {
					structuredPath[structuredPath.length - 1].stations.push(nextStation)
				}
			} else {
				structuredPath.push({line: nextLine, stations: [nextStation]})
			}
			
			currentStation = nextStation
			currentLine = nextLine
		})
		
		setStructuredPath(structuredPath)
	}
	
	useEffect(() => {
		giveStructuredPath()
	}, [path])
	
	
	const handleDijkstra = (e: any) => {
		e.preventDefault();
		if (isValid) {
			setMode("dijkstra")
			setPath(Metro.dijkstra(depart, arrival))
			console.log("Dijkstra done")
		} else {
			alert("Please select a departure and arrival station")
		}
	}
	
	const handleKruskal = (e: any) => {
		e.preventDefault();
		if (mode === "kruskal") return;
		setPath(Metro.kruskal())
		setMode("kruskal");
	}
	
	const isValid = depart !== null && arrival !== null && depart !== arrival
	
	return (
		<MetroProvider>
			<div className={styles.app}>
				<div className={styles.panel}>
					<header>
						<h1>Métro Boulot Dodo</h1>
					</header>
					<form>
						<h4>Départ</h4>
						<Dropdown handleSelect={setDepart}/>
						<h4>Arrivée</h4>
						<Dropdown handleSelect={setArrival}/>
						<div className={styles.submit}>
							<button type="submit" onClick={(e) => handleDijkstra(e)} disabled={!isValid}>Rechercher</button>
							<button type="submit" onClick={(e) => handleKruskal(e)} disabled={mode === "kruskal"}>Arbre couvrant
							</button>
						</div>
					</form>
					{time > 0 && <h3>Temps de trajet : {secondsToFormattedTime(time)}</h3>}
					
					{mode === "dijkstra" && <div style={{overflowY: "scroll", height: "500px"}}>
						{structuredPath?.map((p, i) => (
							<div key={i}>
								<div style={{backgroundColor: p.line.info.color, fontSize: "30px", color: "white", fontWeight: "bold"}}>{p.line.info.name}</div>
								{p.stations.map((s, i) => (
									<div key={i} style={{marginLeft: "30px"}}>{s.info.name}</div>
								))}
							</div>
						))}
					</div>
					}
				</div>
				
				<Canvas path={path} mode={mode}/>
			</div>
		</MetroProvider>
	)
}

export default App
