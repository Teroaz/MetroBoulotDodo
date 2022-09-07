export type StationInfo = {
	id: number;
	name: string;
	isTerminus: boolean;
	branchementType: number;
}

export default class Station {
	
	readonly info: StationInfo;
	
	constructor(info: StationInfo) {
		this.info = info;
	}
	
}
