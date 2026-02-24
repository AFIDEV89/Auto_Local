import { Input } from 'reactstrap';

const InputSelect = ({ options, onSelect, defaultValue, isDisabled }) => {
  return (
    <Input
      bsSize="lg"
      className="mb-3"
      type="select"
      onChange={(e) => onSelect(e)}
    >
      {defaultValue && <option>{defaultValue}</option>}
      {options &&
        options.map((op, index) => {
          return (
            <option disabled={isDisabled} key={index} value={op}>
              {op}
            </option>
          );
        })}
    </Input>
  );
};

export default InputSelect;
