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
    control: (baseStyles) => ({
        ...baseStyles,
        fontSize: 13
    }),
    menuList: (listCss) => ({
        ...listCss,
        fontSize: 13
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