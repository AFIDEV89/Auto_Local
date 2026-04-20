import { v4 as uuid } from "uuid";
import CheckboxSelect from "@views/components/filters/checkboxSelect";
import ChipSelect from "@views/components/filters/chipSelect";
import ColorCheckboxSelect from "@views/components/filters/colorCheckboxSelect";

export const FILTER_TYPE_MAP = {
    "Major Colors": ColorCheckboxSelect,
    "Minor Colors": ColorCheckboxSelect,
    "Vehicle Types": ChipSelect,
    "Product Categories": ChipSelect,
    "Product Subcategories" : ChipSelect,
    "default": CheckboxSelect
}

export const styles = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        backgroundColor: "#FFFFFF",
        borderColor: state.isFocused ? "#ffb200" : "#E5E7EB",
        borderRadius: '8px',
        padding: '2px',
        boxShadow: state.isFocused ? "0 0 0 1px #ffb200" : "none",
        "&:hover": {
            borderColor: "#ffb200"
        },
        fontSize: 13,
        color: "#1A1A1A"
    }),
    singleValue: (base) => ({
        ...base,
        color: "#1A1A1A"
    }),
    placeholder: (base) => ({
        ...base,
        color: "#9CA3AF"
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        zIndex: 50,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? "rgba(255, 178, 0, 0.1)" : "transparent",
        color: state.isSelected ? "#ffb200" : "#1A1A1A",
        "&:hover": {
            backgroundColor: "rgba(255, 178, 0, 0.1)",
            color: "#ffb200"
        },
        cursor: "pointer",
        fontSize: 13
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: "#ffb200",
        borderRadius: "4px"
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: "#000",
        fontWeight: "600"
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: "#000",
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            color: "#000"
        }
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: "#9CA3AF",
        "&:hover": {
            color: "#ffb200"
        }
    }),
    indicatorSeparator: () => ({
        display: "none"
    })
}

export const getFilterLabel = (labelText, colorCode) => {
    if (!colorCode) {
        return labelText
    }

    return `<p><span style={{backgroundColor: ${colorCode}}}></span>${labelText}</p>`
}

export const addIdToItems = (items, parentId) => {
    return items.map((item) => {
        const newItem = { ...item, id: uuid(), parentId };

        if (newItem.list) {
            newItem.list = addIdToItems(newItem.list, newItem?.id);
        }

        return newItem;
    });
};

export const disabledFilters = (filterName = "", selectedProductCategory = []) => {
    if ((selectedProductCategory.includes(2) || selectedProductCategory.includes(3)) && !selectedProductCategory.includes(1)) {
        if (["Major Colors", "Minor Colors", "Product Designs", "Product Materials"].includes(filterName)) {
            return true;
        }

        return false;
    }

    return false;
};