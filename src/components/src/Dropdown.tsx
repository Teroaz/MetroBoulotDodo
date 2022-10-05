import React, {useState} from 'react';
import Station from "../../api/Station";
import useMetro from "../../hooks/src/useMetro";

export type DropDownProps = {
	handleSelect: (value: Station | null) => void
}

export const Dropdown = ({handleSelect}: DropDownProps) => {
	
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState("")
	
	const {stations} = useMetro()
	
	const handleSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!open) setOpen(true)
		const val = e.target.value
		setSelected(val)
		if (val.trim() === "") {
			setOpen(false)
		}
		
	}
	
	const handleFilter = (station: Station) => station.info.name.toLowerCase().includes(selected.toLowerCase())
	
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
				backgroundColor: "#7bca4d",
				border: "0.1rem solid #9b4dca",
				position: "absolute",
				padding: "1rem",
				maxHeight: "25rem",
				overflowY: "scroll",
				zIndex: 99999
			}}>
				{stations.filter(handleFilter).map((s) =>
					<li key={`${s.info.name}-m-${s.info.id}`}
					    style={{
						    cursor: "pointer",
						    color: "white"
					    }}
					    onClick={() => handleAdd(s)}>
						{s?.metroLine?.info.name} - {s.info.name}
					</li>)}
				{stations.filter(handleFilter).length === 0 &&
					<li style={{
						color: "white",
						cursor: "disabled"
					}}>
						Aucune station
					</li>
				}
			</ul>}
		</div>
	);
}
