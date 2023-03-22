import React, { useReducer, useState, useEffect, useContext } from "react";
import './styles.css'
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
import { collection, addDoc, getDocs, query, where, doc, getDoc, setDoc } from "firebase/firestore";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";
import { queryData } from "../../utils/requests/queryData";
import { useAuthContext } from "../../utils/contexts/AuthProvider";

export const LoginScreen = () => {
  const initialSignUpState = {} as initialSignUp;

  const initialSignInState = {} as initialSignIn;

  const [darkTheme, setDarkTheme] = useState(false)
  const [signUpValues, setSignUpValues] = useReducer(
    (currentValues: initialSignUp, newValues: initialSignUp) => {
      return { ...currentValues, ...newValues };
    },
    initialSignUpState
  );

  const handleSignUpChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;
    const newValues = { [name]: value };
    setSignUpValues({ ...signUpValues, ...newValues });
  };

  const [signInValues, setSignInValues] = useReducer(
    (currentValues: initialSignIn, newValues: initialSignIn) => ({
      ...currentValues,
      ...newValues,
    }),
    initialSignInState
  );


  const handleSignInChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;
    let newValues = { [name]: value };
    setSignInValues({ ...signInValues, ...newValues });
  };

  const [visible, setVisible] = useState(true);
  const [hasAccount, setHasAccount] = useState(true);

  const setAuthContext = useAuthContext()

  const dataHandler = async () => {
    if (hasAccount) { //signin shit
      const accountInfo = await queryData('accountInfo', 'name', signInValues.userWorkplace)
      .then( res => {
        if (typeof (res) == "string") return alert(res)
        let user = res?.users?.find((user: any) => user.email.toLowerCase() == signInValues.userEmail.toLowerCase())
        if (!user) return alert("Conta não encontrada!")
        if (user.password != signInValues.userPassword) return toast.error("Senha Incorreta!")
        if (res) setAuthContext.setCurrentUser({ id: res.id, userName: user.username, workplaceName: res.workplaceName, userType: user.userType})
        return setVisible(false);
      }) 
      return
    }

    //signup shit
    let newInfo = {
        name: signUpValues.workplace?.toLowerCase(),
        users: [{
          username: signUpValues.username.toLowerCase(),
          email: signUpValues.email.toLowerCase(),
          password: signUpValues.password,
          userType: "Master"
        }],
        items: [],
        sales: [],
        salesHistory: []
    }

    const collectionRef = collection(db, "empresas")
    const docRef = await setDoc(doc(collectionRef, signUpValues.workplace), newInfo)
      .then(response => {
        setVisible(false)
        /* toast.success('Conta criada com sucesso!'); */
      })
      .catch(err => {
        /* toast.error(err.message) */
      });
  };

  const localStorageManagement = () => {
    let storagedTheme = localStorage.getItem('darkTheme')
    if(storagedTheme == "dark") setDarkTheme(true) 
  }

  useEffect(() => {
    localStorageManagement()
  }, [])


  return (
    <div>
      <Modal
        preventClose
        aria-labelledby="modal-title"
        open={visible}
        onClose={() => setVisible(false)}
        className={darkTheme ? "dark-theme-modal" : ""}
        blur
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
        {!hasAccount && <SignUp signUpValues={signUpValues} setSignUpValues={setSignUpValues} handleSignUpChange={handleSignUpChange} />}
        <Modal.Footer>
          <Button
            auto
            flat
            color="primary"
            className="switch-action-button"
            onClick={() => setHasAccount(!hasAccount)}
          >
            {hasAccount ? "Cadastrar" : "Entrar"}
          </Button>
          <Button auto onClick={dataHandler}>
            {hasAccount ? "Entrar" : "Concluir Cadastro"}
          </Button>
        </Modal.Footer>
      </Modal>
{      <ToastContainer position="top-right"/>}
    </div>
  );
}
