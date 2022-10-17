import React, {useEffect, useState} from 'react'
import {Canvas, Dropdown} from "./components";
import Station from "./api/Station";
import Path from "./api/Path";
import styles from './App.module.css';
import useMetro, {MetroProvider} from "./hooks/src/useMetro";
import {Metro} from "./api/Metro";

function App() {
	
	const [depart, setDepart] = useState<Station | null>(null)
	const [arrival, setArrival] = useState<Station | null>(null)
	const [path, setPath] = useState<Path[] | null>(null)
	const [mode, setMode] = useState<"dijkstra" | "kruskal" | "exploration">("exploration")
	
	const {stations, dijkstra, kruskal} = useMetro()
	
	useEffect(() => {
		console.log(dijkstra)
	}, [])

	const handleDijkstra = (e : any) => {
		e.preventDefault();
		if (depart !== null && arrival !== null) {
			setPath(Metro.dijkstra(depart, arrival))
			setMode("dijkstra")
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
	
	const isValid = depart !== null && arrival !== null
	
	return (
		<MetroProvider>
			<div className={styles.app}>
				<div className={styles.panel}>
					<header>
						<h1>Metro-Boulot-Dodo</h1>
					</header>
					<form>
						<h4>Départ</h4>
						<Dropdown handleSelect={setDepart} />
						<h4>Arrivée</h4>
						<Dropdown handleSelect={setArrival}/>
						<div className={styles.submit}>
							<button type="submit" onClick={(e) => handleDijkstra(e)} disabled={!isValid}>Rechercher</button>
							<button type="submit" onClick={(e) => handleKruskal(e)}>Arbre couvrant
							</button>
						</div>
					</form>
				</div>
				
				<Canvas path={path} mode={mode}/>
			</div>
		</MetroProvider>
	)
}

export default App
