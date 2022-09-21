import React, {useEffect, useRef} from 'react';
import Path from "../../api/Path";

export type CanvasProps = {
    path: Path[] | null
}

export function Canvas({path = null}: CanvasProps) {

    const ref = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {

        if (ref.current !== null) {
            const context = ref.current.getContext('2d');
            const img = new Image();
            img.src = '/metrof_r.png';
            img.onload = function () {
                context?.drawImage(img, 0, 0);
                if (path !== null && context !== null) {
                    path.forEach(p => {
                        const depart = p.info.first
                        const arrival = p.info.second
                        context.beginPath();
                        context.moveTo(depart.info.coordinates.x,depart.info.coordinates.y);
                        context.lineTo(arrival.info.coordinates.x,arrival.info.coordinates.y);
                        context.strokeStyle = depart.metroLine?.info.color || "black";
                        context.lineWidth = 8
                        context.stroke();
                    })
                }
            }
        }

    }, [ref, path])


    return (
        <canvas width={987} height={952} ref={ref} id="metro"/>
    );
}
