import React, {useEffect, useState} from 'react'
import {Canvas, Dropdown} from "./components";
import Station from "./api/Station";
import Path from "./api/Path";
import styles from './App.module.css';
import useMetro, {MetroProvider} from "./hooks/src/useMetro";

function App() {
	
	const [depart, setDepart] = useState<Station | null>(null)
	const [arrival, setArrival] = useState<Station | null>(null)
	const [path, setPath] = useState<Path[] | null>(null)
	
	const {stations, dijkstra} = useMetro()
	
	useEffect(() => {
		console.log({stations})
	}, [])
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (depart !== null && arrival !== null) {
			setPath(dijkstra(depart, arrival))
		} else {
			alert("Please select a departure and arrival station")
		}
	}
	
	const isValid = depart !== null && arrival !== null
	
	return (
		<MetroProvider>
			<div className={styles.app}>
				<div className={styles.panel}>
					<header>
						<h1>Metro-Boulot-Dodo</h1>
					</header>
					<form onSubmit={handleSubmit}>
						<h4>Départ</h4>
						<Dropdown handleSelect={setDepart} />
						<h4>Arrivée</h4>
						<Dropdown handleSelect={setArrival}/>
						<div className={styles.submit}>
							<button type="submit" disabled={!isValid}>Rechercher</button>
							<button type="submit" onClick={() => {
							}}>Arbre couvrant
							</button>
						</div>
					</form>
				</div>
				
				<Canvas path={path}/>
			</div>
		</MetroProvider>
	)
}

export default App
