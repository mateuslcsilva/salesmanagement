import React, { useReducer, useState, useEffect } from "react";
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
import { collection, doc, setDoc } from "firebase/firestore";
import { queryData } from "../../utils/requests/queryData";
import { useAuthContext } from "../../utils/contexts/AuthProvider";
import { useSalesContext } from "../../utils/contexts/SalesProvider";
import { useSalesHistoryContext } from "../../utils/contexts/SalesHistoryProvider";
import { useItemListContext } from "../../utils/contexts/ItemsProvider";

export const LoginScreen = () => {
  const initialSignUpState = {} as initialSignUp;

  let initialSignInState = {rememberMe :false} as initialSignIn;

  const setAuthContext = useAuthContext()
  const SalesContext = useSalesContext()
  const SalesHistoryContext = useSalesHistoryContext()
  const ItemListContext = useItemListContext()

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
    target: { name: string; value: string; id: string };
  } | boolean) => {
    if(typeof event == "boolean") {
      let newValues = { rememberMe : event}
      return setSignInValues({ ...signInValues, ...newValues });
    }
      const { name, value } = event.target;
      let newValues = { [name]: value }
      setSignInValues({ ...signInValues, ...newValues });
  };

  const [visible, setVisible] = useState(true);
  const [hasAccount, setHasAccount] = useState(true);

  const dataHandler = async (data = signInValues) => {
    if (hasAccount) { //signin shit
      const accountInfo = await queryData('accountInfo', 'name', data.userWorkplace)
      .then( res => {
        if (typeof (res) == "string") return alert(res)
        let user = res?.userInfo.users?.find((user: any) => user.email.toLowerCase() == data.userEmail.toLowerCase())
        if (!user) return alert("Conta não encontrada!")
        if (user.password != data.userPassword) return 
        if (res) {
          setAuthContext.setCurrentUser({ id: res.userInfo.id, userName: user.username, workplaceName: res.userInfo.workplaceName, userType: user.userType})
          SalesContext.setSales(res.sales)
          SalesHistoryContext.setSalesHistory(res.salesHistory)
          ItemListContext.setItemList(res.items)
        }
        if(data.rememberMe == true) {
          localStorage.setItem("loginData", JSON.stringify(signInValues))
        }
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

    if(!signUpValues.workplace || !signUpValues.username || !signUpValues.email || !signUpValues.password) return 

    const collectionRef = collection(db, "empresas")
    const docRef = await setDoc(doc(collectionRef, signUpValues.workplace), newInfo)
      .then(response => {
        setVisible(false)
      })
      .catch(err => {
        console.log(err.message)
      });
      setAuthContext.setCurrentUser({ id: signUpValues.workplace, userName: signUpValues.username, workplaceName: signUpValues.workplace, userType: "Master"})
  };

  const localStorageManagement = () => {
    let storagedTheme = localStorage.getItem('darkTheme')
    let storagedLoginData = localStorage.getItem('loginData')
    if(storagedTheme == "dark") setDarkTheme(true) 
    if(storagedLoginData) dataHandler(JSON.parse(storagedLoginData))
  }

  useEffect(() => {
    localStorageManagement()
  }, [])

  useEffect(() => console.log(signInValues))


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
          <Button auto onClick={() => dataHandler()}>
            {hasAccount ? "Entrar" : "Concluir Cadastro"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
