import Select from 'react-select';

const ReactSelect = ({
  value,
  options,
  onSelect,
  getOptionLabel,
  getOptionValue,
  placeholder,
  style,
  isMulti = false,
  isDisabled = false,
  menuPortalTarget,
  ...rest
}) => {
  return (
    <Select
      key={Math.random()}
      value={value}
      onChange={onSelect}
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      placeholder={placeholder}
      styles={style}
      isMulti={isMulti}
      isDisabled={isDisabled}
      menuPortalTarget={menuPortalTarget}
      {...rest}
    />
  );
};

export default ReactSelect;
