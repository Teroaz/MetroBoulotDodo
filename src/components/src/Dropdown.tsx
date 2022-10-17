import React, {useState} from 'react';
import Station from "../../api/Station";
import useMetro from "../../hooks/src/useMetro";
import styles from "./Dropdown.module.css";

export type DropDownProps = {
    handleSelect: (value: Station | null) => void
}

export const Dropdown = ({handleSelect}: DropDownProps) => {

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState("")

    const {stations} = useMetro()

    const handleSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!open) setOpen(true)
        const {value} = e.target
        setSelected(value)
        if (value.trim() === "") {
            setOpen(false)
        }

    }

    const handleFilter = (station: Station) => station.info.name.toLowerCase().includes(selected.toLowerCase()) || station.metroLine?.info.name.toLowerCase().includes(selected.toLowerCase())

    const handleAdd = (station: Station) => {
        handleSelect(station)
        setSelected(`${station.info.name} M${station?.metroLine?.info.name}`)
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen(o => !o)
        handleSelect(null)
    }

    const handleBlur = () => {
        setOpen(false)
    }

    return (
        <div>
            <input onClick={handleToggle} onChange={handleSelected} placeholder={"Saisir la ligne ou la station"}
                   value={selected} type="text"/>
            {open && <ul>
                {stations.filter(handleFilter).map((s) =>
                    <li key={`${s.info.name}-m-${s.info.id}`}
                        style={{
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                        onClick={() => handleAdd(s)}
                        onBlur={handleBlur}>
                        <div style={{display: "flex", gap: "10px"}}>
                            <div className={styles.metro_badge_item}
                                 style={{backgroundColor: s?.metroLine?.info?.color}}>
                                {s?.metroLine?.info.name}
                            </div>
                            - {s.info.name}
                        </div>
                    </li>)}

                {stations.filter(handleFilter).length === 0 &&
                    <li className={styles.disabled}>
                        Aucune station
                    </li>
                }
            </ul>}
        </div>
    );
}
