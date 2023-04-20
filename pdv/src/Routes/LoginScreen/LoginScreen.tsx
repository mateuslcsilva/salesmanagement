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
import { db, DOC_PATH } from "../../utils/firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { queryData } from "../../utils/requests/queryData";
import { useAuthContext } from "../../utils/contexts/AuthProvider";
import { useSalesContext } from "../../utils/contexts/SalesProvider";
import { useSalesHistoryContext } from "../../utils/contexts/SalesHistoryProvider";
import { useItemListContext } from "../../utils/contexts/ItemsProvider";
import { AlertModal } from "../../components/AlertModal/AlertModal";
import { reportType } from "../../types/reportProblemTypes";

export const LoginScreen = () => {
  const initialSignUpState = { hasConsented: false} as initialSignUp;

  let initialSignInState = { rememberMe: false } as initialSignIn;

  const emailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  const setAuthContext = useAuthContext()
  const SalesContext = useSalesContext()
  const SalesHistoryContext = useSalesHistoryContext()
  const ItemListContext = useItemListContext()
  
  const alertHandle = () => setAlertVisible(true);
  const closeAlertHandle = () => setAlertVisible(false);
  const callAlert = (text :string) => {
    setAlertText(text)
    alertHandle()
  }
  
  const [alertVisible, setAlertVisible] = useState(false)
  const [darkTheme, setDarkTheme] = useState(false)
  const [visible, setVisible] = useState(true);
  const [hasAccount, setHasAccount] = useState(true);
  const [alertText, setAlertText] = useState("")

  const [signUpValues, setSignUpValues] = useReducer(
    (currentValues: initialSignUp, newValues: initialSignUp) => {
      return { ...currentValues, ...newValues };
    },
    initialSignUpState
  );

  const handleSignUpChange = (event: {
    target: { name: string; value: string };
  } | boolean) => {
    if(typeof event == "boolean") {
      let newValues = { hasConsented : event}
      return setSignUpValues({ ...signUpValues, ...newValues });
    }
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

  const dataHandler = async (data = signInValues) => {
    if (hasAccount) { //signin shit
      const accountInfo = await queryData('accountInfo', 'name', data.userWorkplace)
      .then( res => {
        if (typeof (res) == "string") return callAlert(res) // verifica se a empresa existe no banco

        let user = res?.userInfo.users?.find((user: any) => user.email.toLowerCase() == data.userEmail.toLowerCase())

        if (!user)return callAlert("Conta não encontrada!") //verifica se a conta existe nos usuários da empresa
        if (user.password != data.userPassword) return callAlert("Senha incorreta!") //verifica se a senha da conta está correta

        if (res) {
          setAuthContext.setCurrentUser({ id: res.userInfo.id, userName: user.username, workplaceName: res.userInfo.workplaceName, userType: user.userType})
          SalesContext.setSales(res.sales)
          SalesHistoryContext.setSalesHistory(res.salesHistory)
          ItemListContext.setItemList(res.items)
        }
        if(data.rememberMe == true) localStorage.setItem("loginData", JSON.stringify(signInValues))
        return setVisible(false);
      }) 
      return
    } // aqui encerra-se a parte que lida com o login

    //signup shit
    //error handle
    const errors :Array<string> = []
    if(!signUpValues.workplace || !signUpValues.username || !signUpValues.email || !signUpValues.password || !signUpValues.hasConsented) errors.push("Por favor, preencha todos os dados!") 
    if(signUpValues.password.length < 8) errors.push("A senha deve ter mais de 8 dígitos!")
    if(signUpValues.hasConsented == false) errors.push("Você deve concordar com os termos de uso!")
    if(signUpValues.password != signUpValues.repetedPassword) errors.push("As senhas devem ser iguais!")
    if(!emailValidation.test(signUpValues.email)) errors.push("Por favor, insira um email válido!")
    const accountInfo = await queryData('accountInfo', 'name', signUpValues.workplace)
    .then(res => { 
      if(typeof res != "string") errors.push("Desculpe, essa empresa já está cadastrada em nosso sistema!")
    })

    if(errors.length > 0) {
      let errorText = "Resolva os seguintes erros: \n\n"
      errors.forEach((error, index) => errorText += `${index + 1}) ${error} \n`)
      console.log(errorText)
      return callAlert(errorText)
    }

    if(!signUpValues.workplace || !signUpValues.username || !signUpValues.email || !signUpValues.password) return 

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
        salesHistory: [],
        reports: []
    }
 
    const collectionRef = collection(db, DOC_PATH)
    const docRef = await setDoc(doc(collectionRef, signUpValues.workplace), newInfo)
      .then(response => {
        setVisible(false)
      })
      .catch(err => {
        console.log(err.message)
      });
      setAuthContext.setCurrentUser({ id: signUpValues.workplace
        , userName: signUpValues.username,
         workplaceName: signUpValues.workplace,
          userType: "Master"
        })
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

  return (
    <div> 
      
      <AlertModal visible={alertVisible} closeHandler={closeAlertHandle} text={alertText} start/>
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
        {hasAccount && 
        <SignIn 
        signInValues={signInValues} 
        handleSignInChange={handleSignInChange} 
        dataHandler={dataHandler}
        />
        }
        {!hasAccount && 
        <SignUp 
        signUpValues={signUpValues} 
        setSignUpValues={setSignUpValues} 
        handleSignUpChange={handleSignUpChange}
        invalidEmail={(signUpValues.email && !emailValidation.test(signUpValues.email)) || false}
        invalidPassword={(signUpValues.password && signUpValues.password.length < 8) || false} 
        difPassword={(signUpValues.password && signUpValues.repetedPassword && signUpValues.password != signUpValues.repetedPassword ) || false}
        />}
        <Modal.Footer>
          <Button
            auto
            flat
            color="primary"
            className="switch-action-button"
            onClick={() => setHasAccount(!hasAccount)}
          >
            {hasAccount ? "Cadastrar" : "Já tenho conta"}
          </Button>
          <Button auto onClick={() => dataHandler()}>
            {hasAccount ? "Entrar" : "Concluir Cadastro"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
