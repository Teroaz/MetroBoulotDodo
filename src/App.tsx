import React, {useEffect, useRef, useState} from 'react'
import {useMetro} from "./hooks";
import Station from "./api/Station";

function App() {

    const ref = useRef<HTMLCanvasElement | null>(null)

    const [depart, setDepart] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("submit")
    }

    const handleDepart = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepart(e.target.value)
    }

    useEffect(() => {

        if (ref.current !== null) {
            const context = ref.current.getContext('2d');
            const img = new Image();
            img.src = '/metrof_r.png';
            img.onload = function () {
                context?.drawImage(img, 0, 0);
            }
        }

    }, [ref])

    const {station} = useMetro()

    console.log(station)


    return (
        <div className="App">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Station de départ</label>
                    <input onChange={handleDepart} value={depart} type="text"/>
                    {depart.length > 0 && <ul>
                        {station.filter((s) => s.info.name.toLowerCase().includes(depart.toLowerCase())).map(s =>
                            <li>{s.info.name} - {s?.metroLine?.info.name}</li>)
                        }
                    </ul>}
                </div>
                <div>
                    <label>Station d'arriver</label>
                    <input type="text"/>
                </div>
                <button>calculer</button>
            </form>
            <canvas width={987} height={952} ref={ref} id="metro"/>
        </div>
    )
}

export default App
