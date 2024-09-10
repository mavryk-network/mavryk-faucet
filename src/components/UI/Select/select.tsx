import React from "react";
import './select.css';
import Select, { CSSObjectWithLabel } from 'react-select';


type Props = {
    disabled?: boolean;
    label: string;
    placeholder?: string;
    noOptionsMessage?: string;
    value: { value: string; label: string } | null;
    onChange: (option: { value: string; label: string }) => void;
    options: { value: string; label: string }[];
    isSearchable?: boolean
}

export function CustomSelect(props: Props) {
    const { name, options, noOptionsMessage, value, onChange, label, disabled, placeholder, isSearchable } = props;

    const customStyles = {
        control: (provided: CSSObjectWithLabel) => ({
            ...provided,
            width: '100%',
            height: '43px',
            border: '1px solid var(--color-gray-border)',
            borderRadius: '8px',
            fontSize: '16px',
            background: 'var(--color-black-main)',
            fontWeight: 400,
            color: 'var(--color-white-text)',
            outline: 'none',
        }),
        indicatorSeparator: (provided: CSSObjectWithLabel) => ({
            ...provided,
            display: 'none'
        }),
        singleValue: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'var(--color-white-text)',
            fontSize: '16px',
            background: 'var(--color-black-main)',
            fontWeight: 400,
            padding: '0',
        }),
        valueContainer: (provided: CSSObjectWithLabel) => ({
            ...provided,
            padding: '2px 16px',
        }),
        placeholder: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'var(--color-gray-light)',
            fontWeight: 400,
            fontSize: '16px',
            margin: 0
        }),
        menu:  (provided: CSSObjectWithLabel) => ({
            ...provided,
            border: '1px solid var(--color-gray-border)',
            borderRadius: '8px',
            overflow: 'hidden',
            fontSize: '16px',
            background: 'var(--color-black-main)',
            fontWeight: 400,
            padding: 0,
            color: 'var(--color-white-text)',
        }),
        menuList: (provided: CSSObjectWithLabel) => ({
            ...provided,
            padding: 0,
        }),
        option: (provided: CSSObjectWithLabel) => ({
            ...provided,
            borderBottom: '1px solid var(--color-gray-border)',
            padding: '16px 12px',
            background: 'var(--color-black-main)',
            cursor: 'pointer',
        }),
    };

    return <div className="custom-select-wrapper">
        {label && <span className="custom-select-label">{label}</span>}
        <Select
            name={name}
            id={name}
            value={value}
            isSearchable={isSearchable}
            options={options}
            noOptionsMessage={() => (noOptionsMessage ? noOptionsMessage : "Nothing found")}
            isDisabled={disabled}
            styles={customStyles}
            onChange={selected => onChange(selected ?? null)}
            placeholder={placeholder}
           >
    </Select></div>
}