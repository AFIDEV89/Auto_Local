import React, { useEffect, useState } from "react"
import Chip from "@mui/material/Chip"

const ChipSelect = ({
    options,
    onSelectedFilters,
    defaultSelectedValues = [],
    isDisabled = false
}) => {

    const [selectedChips, setSelectedChips] = useState([]);

    useEffect(() => {
        if(JSON.stringify(selectedChips) !== JSON.stringify(defaultSelectedValues)) {
            setSelectedChips(defaultSelectedValues);
        }
    }, [defaultSelectedValues])

    useEffect(() => {
        onSelectedFilters(selectedChips);
    }, [selectedChips])

    const getSelectedChipIndex = (option) => {
        return selectedChips.findIndex(chip => chip.value === option.value)
    }

    const isChipSelected = (option) => getSelectedChipIndex(option) > -1 ? true : false

    const handleOnSelectedFilters = (option) => {
        const isAlreadySelected = isChipSelected(option);

        if (!isAlreadySelected) {
            setSelectedChips(selectedChips => {
                const final = [...selectedChips]

                final.push(option)

                return final;
            });
        }
        else {
            const final = selectedChips.filter(chip => chip.value !== option.value);
            setSelectedChips(final);
        }
    }

    return (<div className="chip-select-wrapper">
        {
            options.map(option => {
                return <Chip
                    key={option.label}
                    label={option.label}
                    disabled={isDisabled}
                    variant={isChipSelected(option) ? "filled" : "outlined"}
                    style={{
                        backgroundColor: isChipSelected(option) ? "#ffb400" : "#ffffff"
                    }}
                    color={isChipSelected(option) ? "secondary" : "default"}
                    onClick={(e) => handleOnSelectedFilters(option)}
                />
            })
        }
    </div>)
}

export default ChipSelect