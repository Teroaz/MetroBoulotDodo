import metroJSON from "../../assets/data/metro.json"
import {Metro} from "../../api/Metro";
import Line from "../../api/Line";
import Station from "../../api/Station";
import {HexColorString} from "../../assets/data/colors";
import Path from "../../api/Path";

export const useMetro = () => {

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

    return {
        Metro
    }
}