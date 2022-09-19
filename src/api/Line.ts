import Station from "./Station";
import {HexColorString} from "../assets/data/colors";

export type LineInfo = {
	name: string,
	color: HexColorString,
	stations: Station[];
}

export default class Line {
	
	readonly info: LineInfo;
	
	constructor(info: LineInfo) {
		this.info = info;
	}
	
}
