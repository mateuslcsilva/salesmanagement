import React, { useState } from "react";
import { Modal, Button, Text, Input, Row, Checkbox } from "@nextui-org/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { useAuthContext } from "../../utils/contexts/AuthProvider";
import { Alert } from "@mui/material";

interface propsType {
    handler: () => void,
    closeHandler: () => void,
    visible: boolean,
    setPermission: React.Dispatch<React.SetStateAction<boolean>>,
    setAlert: React.Dispatch<React.SetStateAction<JSX.Element>>
}

export const ConfirmationModal = (props :propsType) =>  {
    const [password, setPassword] = useState("")
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

    const confirmPermission = async () => {
        let users = await getUsers()
        //@ts-ignore
        users.forEach(user => {
            if(user.password == password && user.userType == "Master" || "Gerencia") {
                props.setPermission(true)
            } else{
                props.setAlert(<Alert severity="error">Senha incorreta ou usuário sem permissão!</Alert>)
            }
        })
        props.closeHandler()
        setPassword("")
    }


  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={props.closeHandler}
        className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Ação requer confirmação com senha:
          </Text>
        </Modal.Header>
        <Modal.Body>
        <Input.Password
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite sua senha"
              contentLeft={<i className="bi bi-key is-size-5"></i>}
              name="userPassword"
              aria-label="userPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={props.closeHandler} className="switch-action-button">
            Cancelar
          </Button>
          <Button auto onPress={confirmPermission}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
