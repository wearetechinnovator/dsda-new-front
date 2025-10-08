import React, { useState } from 'react';
import { Modal, Button } from 'rsuite';

// Hook
const useConfirmDialog = () => {
    const [state, setState] = useState({
        isOpen: false,
        title: '',
        text: '',
        resolve: null,
    });

    const show = (title, text) => {
        return new Promise((resolve) => {
            setState({ isOpen: true, title, text, resolve });
        });
    };

    const handleClose = (value) => {
        if (state.resolve) state.resolve(value);
        setState({ ...state, isOpen: false, resolve: null });
    };

    const modal = (
        <Modal open={state.isOpen} onClose={() => handleClose('cancel')} >
            <Modal.Header>{state.title}</Modal.Header>
            <Modal.Body>
                <p></p>
                <p className='font-bold'>{state.text}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => handleClose('cancel')} appearance="subtle" color='red'>
                    Cancel
                </Button>
                <Button onClick={() => handleClose('ok')} appearance="default">
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return { show, modal };
};

export default useConfirmDialog;
