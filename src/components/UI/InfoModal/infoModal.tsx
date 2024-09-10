import {Button} from "../Button/button";
import Modal from 'react-bootstrap/Modal';
import CloseIcon from "../../../icons/glyphs/CloseIcon";
import './infoModal.css';
import ErrorIcon from "../../../icons/glyphs/ErrorIcon";
import SuccessIcon from "../../../icons/glyphs/SuccessIcon";

type Props = {
    isOpen: boolean,
    onClose: () => void
    type?: 'error' | 'success'
    message: string;
    btnText: string;
    onClick: () => (Promise<void> | void)
}

export function InfoModal(prop: Props) {
    const { isOpen, onClose, type = 'success', message, btnText, onClick } = prop;

    const isErrorType = type === 'error';

    return (
        <>
            <Modal centered show={isOpen} onHide={onClose}>
                <div className="info-modal-wrapper">
                    <div className="info-modal-close-btn" onClick={onClose}><CloseIcon /></div>
                <div className="info-modal-text-wrapper">
                        {isErrorType ? <ErrorIcon /> : <SuccessIcon />}
                        <div className="info-modal-text-block">
                            <h4 className="info-modal-title">{isErrorType ? 'Error' : 'Success'}</h4>
                            <span className="info-modal-message">{message}</span>
                        </div>
                </div>
                    <div className="info-modal-btn-wrapper">
                        <Button onClick={onClick} >{btnText}</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}