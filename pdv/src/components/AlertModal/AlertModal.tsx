import React from "react";
import { Modal, Button, Text } from "@nextui-org/react";

interface propsType {
    closeHandler: () => void,
    visible: boolean,
    text: string
}

export const AlertModal = (props :propsType) =>  {

  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={props.visible}
        preventClose
        onClose={props.closeHandler}
        className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            Aviso!
          </Text>
        </Modal.Header>
        <Modal.Body>
            <p style={{"width": "100%", "textAlign" : "center"}}>{props.text}</p>
        </Modal.Body>
        <Modal.Footer css={{"width": "100%", "display" : "flex", "justifyContent": "center"}}>
          <Button auto  onPress={props.closeHandler}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
