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
import { queryData } from "../../utils/requests/queryData";

export const LoginScreen = () => {

  const initialSignUpState = {} as initialSignUp;

  const initialSignInState = {} as initialSignIn;

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

  /*   const {
      workplace,
      username,
      email,
      password,
      repetedPassword,
      hasConsented,
    } = signUpValues; */

  const [signInValues, setSignInValues] = useReducer(
    (currentValues: initialSignIn, newValues: initialSignIn) => ({
      ...currentValues,
      ...newValues,
    }),
    initialSignInState
  );

  /*   const { userWorkplace, userEmail, userPassword } = signInValues; */

  const handleSignInChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;
    let newValues = { [name]: value };
    setSignInValues({ ...signInValues, ...newValues });
  };

  const [visible, setVisible] = useState(true);
  const [hasAccount, setHasAccount] = useState(true);

  const getAccount = async () => {
    const accountInfo = await getDocs(query(collection(db, "empresas"), where("workplace.name", "==", signInValues.userWorkplace)))
        .then(response => {
          if(response.size > 1) return 'Existe mais de uma empresa com esse nome, entre em contato com o suporte!!' //todo: testar
          let idObject = {id: response.docs[0].id}
          return {...idObject, ...response.docs[0].data().workplace}
        })
        return accountInfo
  }



  const dataHandler = async () => {
    if (hasAccount) {
      const accountInfo = await queryData('accountInfo', 'name', signInValues.userWorkplace)
      console.log(accountInfo)
      //tratamento de erros
      if(typeof(accountInfo) == "string"){
        toast.error(accountInfo)
        return
      }
      let user = accountInfo?.users?.find(user => user.email == signInValues.userEmail)
      console.log(user)
      if(!user){
        return toast.error("Conta não encontrata!")
      }
      if(user.password != signInValues.userPassword){
        return toast.error("Senha incorreta!")
      }

      //fazer um context pra mandar informação de account pro app
      return setVisible(false);
    }
    console.log('here')
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

  /*   useEffect(() => {
      console.log(signUpValues)
    }, [signUpValues]) */

  const getData2 = async () => {
    const doc = await getDocs(query(collection(db, "empresas"), where("workplace.name", "==", 'fdsafdas')))
      .then(response => {
        console.log(response.docs.map(item => item.id))
        console.log(response.docs.map(item => item.data()))
      })
  }

  const getData = async () => {
    let data = await getDocs(collection(db, "empresas"))
      .then(response => console.log(response.docs.map(item => item.data())))
      .catch(err => toast.error(err.message))
  }

  useEffect(() => {
/*     getData()
    getData2() */
  }, [])

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
        {!hasAccount && <SignUp signUpValues={signUpValues} setSignUpValues={setSignUpValues} handleSignUpChange={handleSignUpChange} />}
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
