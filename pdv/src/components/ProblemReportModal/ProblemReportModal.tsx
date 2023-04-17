import React from 'react'
import { Modal } from '@nextui-org/react'

export const ProblemReportModal = (props :any) => {

    return(
        <Modal
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={props.closeReportHandler}
        className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
        width="650px"
        blur
    >
        <Modal.Header>
            
        </Modal.Header>
        <Modal.Body>
            
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
    </Modal>
    )
}