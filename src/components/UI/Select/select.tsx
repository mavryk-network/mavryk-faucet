import React, { ReactNode, useRef, useState } from "react";
import "./select.css";
import Select, {
  CSSObjectWithLabel,
  FormatOptionLabelMeta,
} from "react-select";

type Props = {
  disabled?: boolean;
  name?: string;
  label: string;
  placeholder?: string;
  noOptionsMessage?: string;
  value: { value: string; label: string } | null;
  onChange: (option: { value: string; label: string } | null) => void;
  options: { value: string; label: string }[];
  isSearchable?: boolean;
  formatOptionLabel?: (
    data: { value: string; label: string },
    formatOptionLabelMeta: FormatOptionLabelMeta<{
      value: string;
      label: string;
    }>,
  ) => ReactNode;
};

export function CustomSelect(props: Props) {
  const {
    name,
    options,
    noOptionsMessage,
    value,
    onChange,
    label,
    disabled,
    placeholder,
    isSearchable = false,
    formatOptionLabel,
  } = props;

  const selectRef = useRef<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const customStyles = {
    container: (provided: CSSObjectWithLabel) => ({
      ...provided,
      outline: "none",
      boxShadow: "none",
      border: "none",
    }),
    control: (provided: CSSObjectWithLabel, state: any) => ({
      display: "flex",
      width: "100%",
      minHeight: "52px",
      border: "1px solid var(--color-gray-border)",
      borderColor: state.isFocused
        ? "var(--color-gray-border-light)"
        : "var(--color-gray-border-secondary)",
      borderRadius: "8px",
      fontSize: "16px",
      background: "var(--color-black-secondary)",
      fontWeight: 400,
      color: "var(--color-white-text)",
      outline: "none",
      cursor: "pointer",
    }),
    indicatorSeparator: (provided: CSSObjectWithLabel) => ({
      ...provided,
      display: "none",
    }),
    singleValue: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: "var(--color-white-text)",
      fontSize: "16px",
      background: "var(--color-black-secondary)",
      fontWeight: 400,
      marginLeft: 0,
      padding: "8px 0",
    }),
    valueContainer: (provided: CSSObjectWithLabel) => ({
      ...provided,
      padding: "0 16px",
    }),
    placeholder: (provided: CSSObjectWithLabel) => ({
      ...provided,
      color: "var(--color-gray-light)",
      fontWeight: 400,
      fontSize: "16px",
      margin: 0,
    }),
    menu: (provided: CSSObjectWithLabel) => ({
      ...provided,
      border: "1px solid var(--color-gray-border-light)",
      borderRadius: "8px",
      overflow: "hidden",
      fontSize: "16px",
      background: "var(--color-black-secondary)",
      fontWeight: 400,
      padding: 0,
      marginTop: "4px",
      color: "var(--color-white-text)",
    }),
    menuList: (provided: CSSObjectWithLabel) => ({
      ...provided,
      padding: 0,
    }),
    option: (provided: CSSObjectWithLabel, state: any) => ({
      borderBottom:
        state?.data?.value === state.options[state.options.length - 1]?.value
          ? "none"
          : "1px solid var(--color-gray-border)",
      padding: "12px 14px",
      background: "var(--color-black-secondary)",
      cursor: "pointer",
    }),
    dropdownIndicator: (provided: CSSObjectWithLabel, state: any) => ({
      ...provided,
      color: "#F4F4F4",
      transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
    }),
  };

  const handleChange = (selected: { value: string; label: string } | null) => {
    if (selectRef.current) {
      selectRef.current.blur();
    }
    onChange(selected);
  };

  return (
    <div className="custom-select-wrapper">
      {label && <span className="custom-select-label">{label}</span>}
      <Select
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        ref={selectRef}
        name={name}
        id={name}
        value={value}
        isSearchable={isSearchable}
        options={options}
        formatOptionLabel={formatOptionLabel}
        noOptionsMessage={() =>
          noOptionsMessage ? noOptionsMessage : "Nothing found"
        }
        isDisabled={disabled}
        styles={customStyles}
        onChange={handleChange}
        placeholder={placeholder}
      ></Select>
    </div>
  );
}
