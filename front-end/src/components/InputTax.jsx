import { useState, useEffect } from "react";

const InputTax = ({ value, onChange }) => {
  const [defaultValue, setDefaultValue] = useState("");

  useEffect(() => {
    setDefaultValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setDefaultValue(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <input
      type="number"
      className="w-full text-center text-[1.15rem] outline-none"
      value={defaultValue}
      onChange={handleChange}
    />
  );
};

export default InputTax;
