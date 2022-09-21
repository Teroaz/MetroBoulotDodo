import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useMetro} from "./hooks";
import {Dropdown} from "./components";
import Canvas from "./components/src/Canvas";
import Station from "./api/Station";

function App() {

    const [depart, setDepart] = useState<Station | null>(null)
    const [arrival, setArrival] = useState<Station | null>(null)


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("submit")
    }

    const isValid = depart !== null && arrival !== null

    const {station} = useMetro()


    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <Dropdown handleSelect={setDepart} stations={station} />
                <Dropdown handleSelect={setArrival} stations={station} />
                {isValid && <button type="submit">Rechercher</button>}
            </form>
            <Canvas />
        </div>
    )
}

export default App
