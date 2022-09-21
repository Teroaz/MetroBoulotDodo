import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useMetro} from "./hooks";
import {Dropdown, Canvas} from "./components";
import Station from "./api/Station";
import Path from "./api/Path";

function App() {

    const [depart, setDepart] = useState<Station | null>(null)
    const [arrival, setArrival] = useState<Station | null>(null)
    const [path, setPath] = useState<Path[] | null>(null)

    const {station, dijkstra} = useMetro()

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
        <div className="App">
            <form onSubmit={handleSubmit}>
                <h2>Départ</h2>
                <Dropdown handleSelect={setDepart} stations={station}/>
                <h2>fin</h2>
                <Dropdown handleSelect={setArrival} stations={station}/>
                {isValid && <button type="submit">Rechercher</button>}
            </form>
            <Canvas path={path}/>
        </div>
    )
}

export default App
