import { MenuItem, TextField } from "@mui/material"

const Parameter = ({
    id,
    filterData,
    handleChange,
    value,
    required = false
}) => {
    if (!filterData) {
        return <></>
    }

    return (

        <TextField
            id={filterData.title}
            select
            value={value}
            name={filterData.title}
            label={filterData.title}
            fullWidth
            required={required}
            onChange={(event) => handleChange(event.target.value, id)}
        >
            <MenuItem value={null}>No Select</MenuItem>
            {
                filterData.list.map(item => {
                    return <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                })
            }
        </TextField>
    )
}

export default Parameter