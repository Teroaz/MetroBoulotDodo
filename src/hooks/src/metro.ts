import metroJSON from "../../assets/data/metro.json"
import {Metro} from "../../api/Metro";
import Line from "../../api/Line";
import Station from "../../api/Station";
import {HexColorString} from "../../assets/data/colors";
import Path from "../../api/Path";
import {useEffect, useState} from "react";

export const useMetro = () => {

    const [station, setStation] = useState<Station[]>([])
    const [line, setLine] = useState<Line[]>([])
    const [path, setPath] = useState<Path[]>([])

    useEffect(() => {
        for (const station of metroJSON.stations) {
            Metro.stations.push(new Station(station));
        }

        for (const line of metroJSON.lines) {
            const stations = line.stations.map(id => Metro.stations.find(station => station.info.id === id)!);
            Metro.lines.push(new Line({name: line.name, stations, color: line.color as HexColorString}));
        }

        for (const path of metroJSON.paths) {
            Metro.paths.push(new Path({
                first: Metro.stations.find(station => station.info.id === path.first)!,
                second: Metro.stations.find(station => station.info.id === path.second)!,
                time: path.time
            }));
        }

        setStation(Metro.stations)
        setLine(Metro.lines)
        setPath(Metro.paths)
    }, [])


    return {
        station,
        line,
        path
    }
}