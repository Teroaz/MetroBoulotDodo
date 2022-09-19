import React, {useEffect, useRef} from 'react'
import {useMetro} from "./hooks/src/metro";

function App() {

    const ref = useRef<HTMLCanvasElement | null>(null)

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

    const {Metro} = useMetro()

    console.log(Metro)


    return (
        <div className="App">
            <canvas width={1000} height={1000} ref={ref} id="metro" />
        </div>
    )
}

export default App
