import Station from "./Station";

export type PathInfo = {
	first: Station;
	second: Station;
	time: number;
}

export default class Path {
	
	readonly info: PathInfo;
	
	constructor(info: PathInfo) {
		this.info = info;
	}
	
}
