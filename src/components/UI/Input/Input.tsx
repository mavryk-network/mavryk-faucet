import React, {ChangeEvent, MouseEvent } from "react";
import './input.css';

type Props = {
    label?: string;
    subLabel?: string;
    value: string | number;
    placeholder?: string;
    onChange:  ((event: ChangeEvent) => void) | undefined;
    error?: string;
    disabled?: boolean;
    type?: string;
    min?: number | string;
    max?: number | string;
    id?: string;
    onClick?: ((event: MouseEvent) => void) | undefined;
}

export function Input(props: Props) {
    const { label, type, id, value, error, onChange, placeholder, disabled, subLabel, min, max, onClick } = props;

    return <div className="custom-input-wrapper">
        {(label || subLabel) ?
            <div className="custom-input-label-container">
            {label && <span className="custom-input-label">{label}</span>}
            {subLabel && <span className="custom-input-sub-label">{subLabel}</span>}
        </div> : null}

        <input id={id} onClick={onClick} min={min} max={max} type={type} className={"custom-input"} disabled={disabled} value={value} onChange={onChange} placeholder={placeholder}/>
        {error && <span className="custom-input-error">{error}</span>}
    </div>
}