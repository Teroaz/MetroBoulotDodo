import React, {useState} from 'react';
import Station from "../../api/Station";

export type DropDownProps = {
    handleSelect: (value: Station | null) => void
    stations: Station[],
}

export const Dropdown = ({handleSelect,stations}: DropDownProps) => {

    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState("")

    const handleSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!open) setOpen(true)
        const val = e.target.value
        setSelected(val)
        if(val.trim() === "") {
            setOpen(false)
        }

    }

    const handleFilter = (station: Station) => {
        return station.info.name.toLowerCase().includes(selected.toLowerCase())
    }

    const handleAdd = (station: Station) => {
        handleSelect(station)
        setSelected(`${station.info.name} M${station?.metroLine?.info.name}`)
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen(o => !o)
        handleSelect(null)
    }

    return (
        <div>
            <input onClick={handleToggle} onChange={handleSelected} value={selected} type="text"/>
            {open && <ul style={{
                backgroundColor: "#9b4dca",
                border: "0.1rem solid #9b4dca",
                position: "absolute",
                padding: "1rem"
            }}>
                {stations.filter(handleFilter).map((s) => {
                    return <li style={{
                        cursor: "pointer",
                        color: "white"
                    }}
                                          onClick={() => handleAdd(s)}>
                        {s.info.name} - M {s?.metroLine?.info.name}
                    </li>
                })}
                {stations.filter(handleFilter).length === 0 &&
                    <li style={{
                        color: "white",
                        cursor: "disabled"
                    }}>
                        aucune stations
                    </li>
                }
            </ul>}
        </div>
    );
}
