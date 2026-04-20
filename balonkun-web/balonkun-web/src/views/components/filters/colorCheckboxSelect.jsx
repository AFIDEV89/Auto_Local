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
  isDisabled = false,
  styles = {}
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

  // Merge global styles with color-specific indicators
  const mergedStyles = {
    ...styles,
    option: (base, state) => ({
      ...(styles.option ? styles.option(base, state) : base),
      ...color(state.data.color)
    }),
    multiValue: (base, state) => ({
      ...(styles.multiValue ? styles.multiValue(base, state) : base),
      ...color(state.data.color, 4),
    }),
    multiValueLabel: (base, state) => ({
        ...(styles.multiValueLabel ? styles.multiValueLabel(base, state) : base),
        paddingLeft: '24px' // Make room for the color dot
    })
  };

  return (<ReactSelect
    options={options}
    isMulti
    onSelect={handleOnSelectedFilters}
    placeholder={placeholder}
    value={selectedValue}
    isDisabled={isDisabled}
    style={mergedStyles}
  />)
}

export default ColorCheckboxSelect