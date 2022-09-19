import {Metro} from "./Metro";

export type StationInfo = {
	id: number;
	name: string;
	isTerminus: boolean;
	branchementType: number;
	coordinates : {x: number, y: number};
}

export default class Station {
	
	readonly info: StationInfo;
	
	constructor(info: StationInfo) {
		this.info = info;
	}
	
	getNeighbors = (): Station[] => {
		const paths = Metro.paths.filter(path => path.info.first.info.id === this.info.id || path.info.second.info.id === this.info.id);
		return paths.map(path => path.info.first.info.id === this.info.id ? path.info.second : path.info.first);
	}
	
	get metroLine() {
		return Metro.lines.find(line => line.info.stations.includes(this));
	}
}
