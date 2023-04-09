import React, { useState } from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { useAuthContext } from "../../utils/contexts/AuthProvider";
import { Alert } from "@mui/material";

interface propsType {
    closeHandler: () => void,
    visible: boolean,
    text: string
}

export const AlertModal = (props :propsType) =>  {
    const AuthContext = useAuthContext()

    const getUsers = async () => {
        if (AuthContext.currentUser.id == '') return false
        let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
        let data = await getDoc(docRef)
            .then(res => {
                return res.data()?.users
            })
            return data
    }



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
