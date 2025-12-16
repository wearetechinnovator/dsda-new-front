import React, { useState } from 'react';
import { Modal, Button } from 'rsuite';
import { Icons } from '../helper/icons';

// Hook
const useConfirmDialog = () => {
    // const [state, setState] = useState({
    //     isOpen: false,
    //     title: '',
    //     text: '',
    //     resolve: null,
    // });
    const [state, setState] = useState({
        isOpen: true,
        title: 'Confirm Action',
        text: 'Do you want to proceed?',
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
        <Modal open={state.isOpen} onClose={() => handleClose('cancel')} size={'xs'}>
            {/* <Modal.Header className='border-b'>
                {state.title}
            </Modal.Header> */}
            <div className='flex items-center justify-between pb-1'>
                <p className='text-xs'>{state.title}</p>
                <div
                    onClick={() => handleClose('cancel')}
                    className='w-[23px] h-[23px] bg-red-400 hover:bg-red-500 grid place-items-center rounded-full cursor-pointer'>
                    <Icons.CLOSE />
                </div>
            </div>
            <Modal.Body>
                <p className='font-semibold'>{state.text}</p>
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
