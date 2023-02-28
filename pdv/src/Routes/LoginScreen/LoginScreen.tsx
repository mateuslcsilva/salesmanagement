import React, { useReducer, useState, useEffect } from "react";
import {
  Modal,
  Button,
  Text,
  Col,
  Spacer,
} from "@nextui-org/react";
import { initialSignUp, initialSignIn } from '../../types/Login/loginTypes'
import { SignIn } from "../../components/SignIn/SignIn";
import { SignUp } from "../../components/SignUp/SignUp";
import { db } from "../../utils/firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const LoginScreen = () => {

  const initialSignUpState = {} as initialSignUp;

  const initialSignInState = {} as initialSignIn;

  const [signUpValues, setSignUpValues] = useReducer(
    (currentValues: initialSignUp, newValues: initialSignUp) => {
      return { ...currentValues, ...newValues };
    },
    initialSignUpState
  );
  const collectionRef = collection(db, "empresas")

  const {
    workplace,
    username,
    email,
    password,
    repetedPassword,
    hasConsented,
  } = signUpValues;

  const handleSignUpChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;
    const newValues = { [name]: value };
    setSignUpValues({ ...signUpValues, ...newValues });
  };

  const [signInValues, setSignInValues] = React.useReducer(
    (currentValues: initialSignIn, newValues: initialSignIn) => ({
      ...currentValues,
      ...newValues,
    }),
    initialSignInState
  );

  const { userWorkplace, userEmail, userPassword } = signInValues;

  const handleSignInChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;
    let newValues = { [name]: value };
    setSignInValues({ ...signInValues, ...newValues });
  };

  const [visible, setVisible] = useState(true);
  const [hasAccount, setHasAccount] = useState(true);

  const dataHandler = async () => {
    if (hasAccount) {
      setVisible(false)
      return false;
    }

    let newInfo = {
      workplace: {
        name: signUpValues.workplace,
        users: [{
          username: signUpValues.username,
          email: signUpValues.email,
          password: signUpValues.password,
        }],
        items: [],
        sales: []
      },
    }
    const docRef = await addDoc(collection(db, "empresas"), newInfo)
      .then(response => {
        setVisible(false)
        toast.success('Conta criada com sucesso!');
      })
      .catch(err => {
        toast.error(err.message)
      });
  };

  useEffect(() => {
    console.log(signInValues)
  }, [signInValues])

  /*   useEffect(() => {
      const getDoc = query(collection(db, "empresas"), where("name", "==", "teste12"))
  
      console.log(getDoc, query(collection(db, "empresas"), where("name", "==", "teste12")).firestore)
    }) */

  return (
    <div>
      <Modal
        preventClose
        aria-labelledby="modal-title"
        open={visible}
        onClose={() => setVisible(false)}
      >
        <Modal.Header>
          <Col>
            <Text id="modal-title" size={18} transform="full-width">
              Bem vindo ao
              <Text b size={18} className="ml-1">
                Simpls
              </Text>
              !
            </Text>
            <Spacer y={0.5} />
            {!hasAccount && (
              <Text size={16}>
                Faça o seu cadastro e comece a usar agora mesmo!
              </Text>
            )}
          </Col>
        </Modal.Header>
        {hasAccount && <SignIn signInValues={signInValues} handleSignInChange={handleSignInChange} />}
        {!hasAccount && <SignUp signUpValues={signUpValues} handleSignUpChange={handleSignUpChange} />}
        <Modal.Footer>
          <Button
            auto
            flat
            color="primary"
            onClick={() => setHasAccount(!hasAccount)}
          >
            {hasAccount ? "Cadastrar" : "Entrar"}
          </Button>
          <Button auto onClick={dataHandler}>
            {hasAccount ? "Entrar" : "Concluir Cadastro"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"></ToastContainer>
    </div>
  );
}
