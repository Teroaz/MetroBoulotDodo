import {readFileSync} from "fs";
import {join} from "path";
import Station from "./Station";
import {Metro} from "./Metro";
import Path from "./Path";
import lines = Metro.lines;
import stations = Metro.stations;
import paths = Metro.paths;

const BASE_PATH = `./${join("src", "data")}`;

const metro = readFileSync(join(BASE_PATH, "metro.txt"), 'utf8');

const stationRegex = RegExp("(\\d{4})\\s+(.+)\\s+;(\\d+|\\w+)\\s+;(False|True)\\s+(\\d)");

const pathRegex = RegExp("(\\d+)\\s+(\\d+)\\s+(\\d+)");

for (const row of metro.split("\n")) {
	if (row.startsWith("V") && stationRegex.test(row)) {
		
		let [_, num, name, lineNum, isTerminus, branchementType] = stationRegex.exec(row) as string[];
		
		const station = new Station({
			id: Number(num),
			name,
			isTerminus: isTerminus === "True",
			branchementType: Number(branchementType)
		});
		
		stations.push(station);
		if (!lines[lineNum]) lines[lineNum] = [];
		lines[lineNum].push(station);
	}
	
	if (row.startsWith("E") && pathRegex.test(row)) {
		const [_, firstID, secondID, time] = pathRegex.exec(row) as string[]
		const firstStation = stations.find(station => station.info.id === Number(firstID))
		const secondStation = stations.find(station => station.info.id === Number(secondID))
		
		if (!firstStation || !secondStation) {
			console.error(`Path could not be parsed for ${firstStation?.info?.name ?? firstID} && ${secondStation?.info?.name ?? secondID} !`)
		}
		
		const path = new Path({
			first: firstStation!,
			second: secondStation!,
			time: Number(time)
		});
		
		paths.push(path);
	}
}

console.table(lines)
console.table(stations)
console.table(paths)

console.log({matrix: Metro.getMatrixAdjacency()})

const pathToTake = Metro.dijkstra(stations[0], stations[1]);
console.log({start: stations[0].info.name, end: stations[1].info.name, path: pathToTake.map(path => path?.info?.first?.info?.name ?? "null")})
