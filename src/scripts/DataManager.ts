import * as fs from "fs";
import {readFileSync} from "fs";
import Station from "../api/Station";
import Path from "../api/Path";
import {Metro} from "../api/Metro";
import Line from "../api/Line";
import {LinesColors} from "../assets/data/colors";

export const DATA_BASE_PATH = "./src/assets/data/";

const stationRegex = RegExp("(\\d{4})\\s+(.+)\\s+;(\\d+|\\w+)\\s+;(False|True)\\s+(\\d)");

const pathRegex = RegExp("(\\d+)\\s+(\\d+)\\s+(\\d+)");

let dataRetrieved = false;

export const readMetroTxt = (filename: string = "metro.txt") => {
    const metroTxtData = readFileSync(`${DATA_BASE_PATH}/${filename}`, 'utf8');
    const {stations, lines, paths} = Metro;
    for (const row of metroTxtData.split("\n")) {
        if (row.startsWith("V") && stationRegex.test(row)) {
            let [_, num, name, lineNum, isTerminus, branchementType] = stationRegex.exec(row) as string[];
            const station = new Station({
                id: Number(num),
                name,
                isTerminus: isTerminus === "True",
                branchementType: Number(branchementType)
            });
            stations.push(station);
            let line = lines.find(line => line.info.name === lineNum);
            if (!line) {
                line = new Line({
                    name: lineNum,
                    color: LinesColors[lineNum],
                    stations: []
                })
                lines.push(line);
            }
            line.info.stations.push(station);
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
}

export const readPosPointsTxt = (filename: string = "pospoints.txt") => {
    const posPointsTxtData = readFileSync(`${DATA_BASE_PATH}/${filename}`, 'utf8');
    const {stations} = Metro;
    
    for (const row of posPointsTxtData.split("\n")) {
		if (row == "") continue;
        let [x, y, name] = row.split(";");
		if (!name) {
			console.error(`Could not parse ${row} !`);
		}
        name = name.replaceAll("@", " ").replaceAll("\r", "");
        const station = stations.some(station => station.info.name === name);
        if (!station) {
            console.error(`Station ${name} not found !`);
            continue;
        }
        stations.filter(station => station.info.name === name).forEach(station => {
            station.info.coordinates = {x: Number(x), y: Number(y)};
        })
    }
}

export const writeDataToJson = (filename: string) => {

    const {stations, lines, paths} = Metro;

    fs.writeFileSync(`${DATA_BASE_PATH}/${filename}`, JSON.stringify({
        stations: stations.map(station => ({...station.info})),
        lines: lines.map(line => ({...line.info, stations: line.info.stations.map(station => station.info.id)})),
        paths: paths.map(p => ({first: p.info.first.info.id, second: p.info.second.info.id, time: p.info.time}))
    }, null, 4));

}

readMetroTxt()
readPosPointsTxt()
writeDataToJson("metro.json")

/**export const readMetroJson = () => {
		if (dataRetrieved) return;
		dataRetrieved = true;
		
		
		for (const station of metroJSON.stations) {
			Metro.stations.push(new Station(station));
			console.info(`[${station.id}] Station ${station.name} added !`);
		}
		
		for (const line of metroJSON.lines) {
			const stations = line.stations.map(id => Metro.stations.find(station => station.info.id === id)!);
			Metro.lines.push(new Line({name: line.name, stations, color: line.color as HexColorString}));
			console.info(`Line ${line.name} with ${stations.length} stations added !!`);
		}
		
		for (const path of metroJSON.paths) {
			Metro.paths.push(new Path({
				first: Metro.stations.find(station => station.info.id === path.first)!,
				second: Metro.stations.find(station => station.info.id === path.second)!,
				time: path.time
			}));
			console.info(`Path between ${path.first} and ${path.second} with ${path.time} min. added !`);
		}
	}*/
