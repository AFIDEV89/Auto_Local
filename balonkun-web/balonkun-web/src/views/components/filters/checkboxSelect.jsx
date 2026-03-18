import React, { useEffect, useState } from "react"
import {
    ReactSelect,
} from "@views/components";

const CheckboxSelect = ({
    options,
    onSelectedFilters,
    placeholder,
    defaultSelectedValues = [],
    styles = {},
    isDisabled = false
}) => {

    const [selectedValue, setSelectedValue] = useState([]);

    useEffect(() => {
        if(JSON.stringify(selectedValue) !== JSON.stringify(defaultSelectedValues)) {
            setSelectedValue(defaultSelectedValues);
        }
    }, [defaultSelectedValues])

    useEffect(() => {
        onSelectedFilters(selectedValue);
    }, [selectedValue])

    const handleOnSelectedFilters = (option) => {
        setSelectedValue(option);
    }

    return (<ReactSelect
        options={options}
        isMulti
        onSelect={handleOnSelectedFilters}
        placeholder={placeholder}
        value={selectedValue}
        isDisabled={isDisabled}
        style={{ menu: provided => ({ ...provided, zIndex: 4 }), ...styles }}
    />)
}

export default CheckboxSelect