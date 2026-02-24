import React, { useEffect, useState } from "react"
import {
  ReactSelect,
} from "@views/components";

const color = (color = "transparent", marginRight = 8) => ({
  display: "flex",
  alignItems: "center",
  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight,
    height: 10,
    width: 10
  }
})

const colourStyles = {
  control: (baseStyles) => ({
    ...baseStyles,
    fontSize: 13
  }),
  menuList: (listCss) => ({
    ...listCss,
    fontSize: 14
  }),
  option: (styles, { data }) => {
    return {
      ...styles,
      ...color(data.color)
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      paddingLeft: 10,
      ...color(data.color, 4),
    };
  },
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    padding: 5,
  })
};

const ColorCheckboxSelect = ({
  options,
  onSelectedFilters,
  placeholder,
  defaultSelectedValues = [],
  isDisabled = false
}) => {

  const [selectedValue, setSelectedValue] = useState([]);

  useEffect(() => {
    if (JSON.stringify(selectedValue) !== JSON.stringify(defaultSelectedValues)) {
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
    style={{ menu: provided => ({ ...provided, zIndex: 4 }), ...colourStyles }}
  />)
}

export default ColorCheckboxSelect