import React, {useEffect, useRef} from 'react';
import Path from "../../api/Path";
import useMetro from "../../hooks/src/useMetro";
import Station from "../../api/Station";

export type CanvasProps = {
	path: Path[] | null,
	mode: "dijkstra" | "kruskal" | "exploration"
}

export function Canvas({path, mode}: CanvasProps) {
	
	const ref = useRef<HTMLCanvasElement | null>(null)
	
	const {stations, dataLoaded, paths} = useMetro();
	
	const [nearestStationToMouse, setNearestStationToMouse] = React.useState<Station | null>(null)
	
	const metroLineSelected = nearestStationToMouse?.metroLine
	
	useEffect(() => {
		
		if (!dataLoaded) return;
		
		if (ref.current !== null) {
			const context = ref.current.getContext('2d');
			context!.clearRect(0, 0, ref.current.width, ref.current.height);
			
			const centerPosition = {x: ref.current.width / 2, y: ref.current.height / 2}
			
			stations.forEach((s) => {
				context?.beginPath();
				context!.fillStyle = s.metroLine?.info.color || "black";
				
				if (s.info.isTerminus) {
					const x_coeff = s.info.coordinates.x - centerPosition.x > 0 ? 1 : -1
					const y_coeff = s.info.coordinates.y - centerPosition.y > 0 ? 1 : -1
					
					context!.fillText(s.info.name, s.info.coordinates.x + 10 * x_coeff - 50, s.info.coordinates.y + 20 * y_coeff )
					
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
				if (path?.some(tp => tp === p) || (mode === "exploration" && metroLineSelected !== null && (metroLineSelected === depart.metroLine || metroLineSelected === arrival.metroLine))) {
					context!.lineWidth = 5
					context!.strokeStyle = depart.metroLine?.info.color || "black";
				} else {
					context!.lineWidth = 0.5
					context!.strokeStyle = "lightgray";
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
		
		
	}, [dataLoaded, nearestStationToMouse, path, mode])
	
	
	return (
		<canvas width={987} height={952} ref={ref} id="metro"/>
	);
}
