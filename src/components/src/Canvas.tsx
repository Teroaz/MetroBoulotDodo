import React, {useEffect, useRef} from 'react';
import Path from "../../api/Path";
import useMetro from "../../hooks/src/useMetro";
import Station from "../../api/Station";

export type CanvasProps = {
	path: Path[] | null
}

export function Canvas({path = null}: CanvasProps) {
	
	const ref = useRef<HTMLCanvasElement | null>(null)
	
	const {stations, dataLoaded, paths} = useMetro();
	
	const [nearestStationToMouse, setNearestStationToMouse] = React.useState<Station | null>(null)
	
	const metroLineSelected = nearestStationToMouse?.metroLine
	
	useEffect(() => {
		
		if (!dataLoaded) return;
		
		if (ref.current !== null) {
			const context = ref.current.getContext('2d');
			context!.clearRect(0, 0, ref.current.width, ref.current.height);
			
			stations.forEach((s) => {
				console.log(s.info.name)
				context?.beginPath();
				context!.fillStyle = s.metroLine!.info.color;
				
				if (s.info.id === nearestStationToMouse?.info.id || s.info.isTerminus) {
					context!.fillText(s.info.name, s.info.coordinates.x, s.info.coordinates.y - 20)
					context?.arc(s.info.coordinates.x, s.info.coordinates.y, 8, 0, 2 * Math.PI);
				} else {
					context?.arc(s.info.coordinates.x, s.info.coordinates.y, 3, 0, 2 * Math.PI);
				}
				context?.fill();
				context?.closePath();
			})
			
			paths.forEach(p => {
				const depart = p.info.first
				const arrival = p.info.second
				context!.beginPath();
				context!.moveTo(depart.info.coordinates.x, depart.info.coordinates.y);
				context!.lineTo(arrival.info.coordinates.x, arrival.info.coordinates.y);
				if (nearestStationToMouse?.metroLine?.info.name === p.info.first.metroLine?.info.name) {
					context!.lineWidth = 3
					context!.strokeStyle = depart.metroLine?.info.color || "black";
				} else {
					context!.lineWidth = 1
					context!.strokeStyle = "gray";
				}
				context!.stroke();
			})
			
			ref!.current!.onmousemove = (ev: MouseEvent) => {
				setNearestStationToMouse([...stations]
					.filter(s => Math.sqrt(Math.pow(s.info.coordinates.x - ev.offsetX, 2) + Math.pow(s.info.coordinates.y - ev.offsetY, 2)) < 15)
					.sort((a, b) => {
						const aDist = Math.sqrt(Math.pow(a.info.coordinates.x - ev.offsetX, 2) + Math.pow(a.info.coordinates.y - ev.offsetY, 2))
						const bDist = Math.sqrt(Math.pow(b.info.coordinates.x - ev.offsetX, 2) + Math.pow(b.info.coordinates.y - ev.offsetY, 2))
						return aDist - bDist
					})[0])
			}
		}
		
		
	}, [dataLoaded, nearestStationToMouse])
	
	
	return (
		<canvas width={987} height={952} ref={ref} id="metro"/>
	);
}
