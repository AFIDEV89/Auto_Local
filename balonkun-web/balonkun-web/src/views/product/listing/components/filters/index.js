import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as services from "@services";
import { v4 as uuid } from "uuid";
import { useHandleCalls } from "@views/components/custom-hooks";
import { Button } from "reactstrap";

import { barsIcon } from "@assets/images";

import { FILTER_TYPE_MAP, addIdToItems, disabledFilters, getFilterLabel, styles } from "./helpers";

const Filters = ({
  selectedFilters,
  onSelectedFilters,
  setSelectedFilters,
}) => {
  const [filters, setFilters] = useState([]);

  const vehicleTypes = useMemo(() => selectedFilters?.["Vehicle Types"] || [], [selectedFilters]);
  const selectedBrands = useMemo(() => selectedFilters?.["Vehicle Brands"] || [], [selectedFilters]);
  const selectedProductCategory = useMemo(() => selectedFilters?.["Product Categories"] || [], [selectedFilters])

  const handleFetchFilters = useCallback(() => {
    const result = services.getFilterList();

    result.then((value) => {
      if (value?.data?.data && !!Object.keys(value.data.data).length) {
        const obj = { ...value.data.data, id: uuid() };
        const dataWithIds = {
          ...obj,
          list: addIdToItems(obj.list, obj.id),
          isOpen: true,
        };
        setFilters([dataWithIds]);
      }
    });

  }, []);

  useHandleCalls(handleFetchFilters, [], "fetchingFilters");

  const handleFolderView = useCallback((menu) => {
    const { list = [] } = menu;

    return (
      <div className="filter-menu" key={menu.title}>
        {
          list.map((listItem, index) => {

            const options = listItem.list.filter(item => {
              if (listItem.title === "Product Categories" && item.title === "Audio & Security") {
                return false;
              }
              return true;
            }).map(item => {

              const isValidBrand =
                listItem.title === "Vehicle Brands" && !!vehicleTypes.length
                  ? vehicleTypes.indexOf(item.vehicle_type_id) > -1
                  : true;

              const isValidBrandModel =
                listItem.title === "Vehicle Models" && !!selectedBrands.length
                  ? selectedBrands.indexOf(item.brand_id) > -1
                  : true;

              const isValidBrandModelByVehicleType =
                listItem.title === "Vehicle Models" && !!vehicleTypes.length
                  ? vehicleTypes.indexOf(item.vehicle_type_id) > -1
                  : true;

              const isValid = !!selectedBrands.length
                ? !isValidBrand || !isValidBrandModel
                : !isValidBrand ||
                !isValidBrandModel ||
                !isValidBrandModelByVehicleType;

              if (isValid) {
                return false;
              }

              return {
                label: getFilterLabel(item.title, ""),
                value: item.dbId,
                ...(item?.hex_code && {
                  color: item.hex_code
                })
              }
            }).filter(Boolean)

            const COMPONENT = FILTER_TYPE_MAP[listItem.title] ? FILTER_TYPE_MAP[listItem.title] : FILTER_TYPE_MAP.default

            const defaultSelectedValues = options.filter(item => (selectedFilters[listItem.title]?.indexOf(item.value) > -1))

            return (
              <div key={index}>
                <h6 className="all-cat">
                  {listItem.title || ""}
                </h6>

                <COMPONENT
                  options={options}
                  placeholder={listItem.title}
                  onSelectedFilters={(option) => {
                    let selectedValues = option.map(x => x.value);
                    if (listItem.title === "Vehicle Types" && selectedValues.length > 1) {
                      selectedValues = [selectedValues[selectedValues.length - 1]];
                    }
                    onSelectedFilters(listItem.title, selectedValues)
                  }}
                  defaultSelectedValues={defaultSelectedValues}
                  styles={styles}
                  isDisabled={disabledFilters(listItem.title, selectedProductCategory)}
                />
              </div>
            )
          })
        }
      </div>
    );
  },
    [
      onSelectedFilters,
      selectedFilters,
      selectedBrands,
      vehicleTypes,
      selectedProductCategory
    ]
  );

  useEffect(() => {
    if ((selectedProductCategory.includes(2) || selectedProductCategory.includes(3)) && !selectedProductCategory.includes(1)) {
      ["Major Colors", "Minor Colors", "Product Designs", "Product Materials"].forEach(filterName => {
        if (selectedFilters[filterName]) {
          onSelectedFilters(filterName, [])
        }
      });
    }
  }, [selectedFilters, selectedProductCategory, onSelectedFilters])

  useEffect(() => {
    if (!!(filters?.[0]?.list?.length)) {
      let isChanged = false;
      const temp = Object.assign({}, selectedFilters);

      // vehicle brand filtering
      if (temp["Vehicle Brands"]?.length) {
        const vehicleBrandIndex = filters[0].list.findIndex(
          (item) => item.title === "Vehicle Brands"
        );
        if (vehicleBrandIndex > -1) {
          const brands = filters[0].list[vehicleBrandIndex].list;

          temp["Vehicle Brands"] = temp["Vehicle Brands"].filter((brandId) => {
            const brand = brands.find((brand) => brand.dbId === brandId);
            return vehicleTypes.indexOf(brand.vehicle_type_id) > -1;
          });
          isChanged = true;
        }
      }

      // vehicle brand model filtering
      if (temp["Vehicle Models"]?.length && !temp["Vehicle Brands"]?.length) {
        const vehicleBrandModelIndex = filters[0].list.findIndex(
          (item) => item.title === "Vehicle Models"
        );
        if (vehicleBrandModelIndex > -1) {
          const models = filters[0].list[vehicleBrandModelIndex].list;

          temp["Vehicle Models"] = temp["Vehicle Models"].filter((modelId) => {
            const brand = models.find((model) => model.dbId === modelId);
            return vehicleTypes.indexOf(brand.vehicle_type_id) > -1;
          });
          isChanged = true;
        }
      }
      if (isChanged) {
        setSelectedFilters(temp);
      }
    }
  }, [JSON.stringify(vehicleTypes)]);

  useEffect(() => {
    if (!!(filters?.[0]?.list?.length)) {
      const temp = Object.assign({}, selectedFilters);
      if (temp["Vehicle Models"]?.length) {
        const vehicleModelIndex = filters[0].list.findIndex(
          (item) => item.title === "Vehicle Models"
        );
        if (vehicleModelIndex > -1) {
          const vehicleModels = filters[0].list[vehicleModelIndex].list;

          temp["Vehicle Models"] = temp["Vehicle Models"].filter((brandId) => {
            const model = vehicleModels.find((model) => model.dbId === brandId);
            return selectedBrands.indexOf(model.brand_id) > -1;
          });
          setSelectedFilters(temp);
        }
      }
    }
  }, [JSON.stringify(selectedBrands)]);

  return (
    <div className="filter-products">
      <div className="filter-product-btn-wrapper">
        <Button className="filter-product-btn">
          <img src={barsIcon} alt="Filters" />
          Filter Products
        </Button>
      </div>

      {!!filters?.length && filters.map((menu) => handleFolderView(menu))}
    </div>
  );
};

export default Filters;
