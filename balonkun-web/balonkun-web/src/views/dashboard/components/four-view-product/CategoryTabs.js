const CategoryTabs = ({
  list = [],
  onHandleCategoryType,
  categoryType = "",
  showLowerCase = false
}) => {
  return (
    <div className="product-slider-tabs">
      <ul>
        {list.map((link) => (
          <li
            className={`category-items ${categoryType
              ? categoryType === link.name
                ? "active-category-item"
                : "inactive-cat-item"
              : link.id === 1
                ? "active-category-item"
                : "inactive-cat-item"
              } ${showLowerCase ? "item-lower" : ""}`}
            key={link.id}
            onClick={() => onHandleCategoryType(link.name)}
          >
            <span
              className={`tab-link ${categoryType
                ? categoryType === link.name && "category-selected-tab"
                : link.id === 1 && "category-selected-tab"
                }`}
            >
              {link?.display || link?.name}
            </span>
          </li>
        ))
        }
      </ul>
    </div>
  );
};

export default CategoryTabs;
