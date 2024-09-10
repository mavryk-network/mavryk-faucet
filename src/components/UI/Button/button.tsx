import classnames from 'classnames';
import React, {useState} from "react";
import {Spinner} from "react-bootstrap";
import './button.css';

type Props = {
    children: React.ReactNode;
    onClick?: () => Promise<unknown> | void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'outlined';
    disabled?: boolean;
};

export function Button(props: Props) {
    const { onClick, disabled = false, variant = 'primary', children, type = 'button' } = props;

    const [isLoading, setLoading] = useState(false);

    const onClickHandler = async () => {
        if (typeof onClick === 'function') {
            const callResult = onClick();
            if (callResult && typeof callResult.then === 'function') {
                setLoading(true);
                await callResult;
                setLoading(false);
            }
        }
    };

    const isDisabled = disabled || isLoading;

    return <button
        type={type}
        disabled={isDisabled}
        onClick={onClickHandler}
        className={classnames('custom-btn', {['custom-btn-outlined']: variant === 'outlined'})}>
        {isLoading ? (
            <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
        ) : (children)}
    </button>
}