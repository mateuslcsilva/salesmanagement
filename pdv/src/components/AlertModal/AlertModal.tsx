import React, { ReactNode } from "react";
import { Modal, Button, Text } from "@nextui-org/react";

interface propsType {
    closeHandler: () => void,
    visible: boolean;
    text: string;
    title?: string;
    subtitle?: string | ReactNode;
    start?: boolean;
    large?: boolean;
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
        width={props.large ? "1000px" : "400px"}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            {props.title || "Aviso!"}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {props.subtitle}
            <p style={{"width": "100%", "textAlign" : props.start ? "start" : "center", "whiteSpace" : "pre-line"}}>{props.text}</p>
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
