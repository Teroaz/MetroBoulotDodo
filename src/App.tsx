import React, {useEffect, useState} from 'react'
import {Canvas, Dropdown} from "./components";
import Station from "./api/Station";
import Path from "./api/Path";
import styles from './App.module.css';
import {MetroProvider} from "./hooks";
import {Metro} from "./api/Metro";
import {TimeUtils} from "./utils/TimeUtils";
import secondsToFormattedTime = TimeUtils.secondsToFormattedTime;

function App() {
	
	const [depart, setDepart] = useState<Station | null>(null)
	const [arrival, setArrival] = useState<Station | null>(null)
	const [path, setPath] = useState<Path[] | null>(null)
	const [mode, setMode] = useState<"dijkstra" | "kruskal" | "exploration">("exploration")

	const time = mode == "dijkstra" && path?.reduce((acc, p) => acc + p.info.time, 0) || 0
	
	const [structuredPath, setStructuredPath] = useState<Record<string, Station[]>>({});
	
	const giveStructuredPath = () => {
		if (path === null) return
		
		let currentStation = path[0].info.first === depart ? path[0].info.first : path[0].info.second
		
		const groupedPath = path.reduce((acc, p) => {
			const metroLine = p.info.first.metroLine?.info.name || "undefined"
			if (acc[metroLine] === undefined) {
				acc[metroLine] = []
			}
		
			if (acc[metroLine].at(-1) !== currentStation) {
				acc[metroLine].push(currentStation)
				currentStation = p.info.first === currentStation ? p.info.second : p.info.first
			}
			
			return acc
		}, {} as {[key: string]: Station[]})
		
		setStructuredPath(groupedPath)
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
							<button type="submit" onClick={(e) => handleKruskal(e)}>Arbre couvrant
							</button>
						</div>
					</form>
					{time > 0 && <p>Temps de trajet : {secondsToFormattedTime(time)}</p>}
					{JSON.stringify(structuredPath)}
				</div>
				
				<Canvas path={path} mode={mode}/>
			</div>
		</MetroProvider>
	)
}

export default App
