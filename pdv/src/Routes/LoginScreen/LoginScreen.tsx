import React, { useReducer, useState, useEffect } from "react";
import {
  Modal,
  Button,
  Text,
  Input,
  Row,
  Col,
  Checkbox,
  Spacer,
} from "@nextui-org/react";
import { initialSignUp, initialSignIn, initialWorkplaceSignUp } from '../../types/Login/loginTypes'

import { db } from "../../utils/firebase/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function App() {

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
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
  };

  const dataHandler = async () => {
    if (hasAccount) {
      closeHandler();
      return false;
    }

    let dbStructure = {} as initialWorkplaceSignUp
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

    console.log(dbStructure, newInfo);
    const docRef = await addDoc(collection(db, "empresas"), newInfo)
    .then(response => console.log(response, 'Dados adicionados com sucesso'))
    .catch(err => alert(err.message));
  };

  useEffect(() => {
    console.log(signUpValues);
  }, [signUpValues, signInValues])

  useEffect( () => {
    const getDoc  = query(collection(db, "empresas"), where("name", "==", "teste12"))

    console.log(getDoc, query(collection(db, "empresas"), where("name", "==", "teste12")).firestore)
  })

  return (
    <div>
      <Modal
        preventClose
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
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
        {hasAccount && (
          <Modal.Body>
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite o nome da empresa"
              contentLeft={<i className="bi bi-people is-size-5"></i>}
              name="userWorkplace"
              value={userWorkplace}
              onChange={handleSignInChange}
            />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite seu email"
              contentLeft={<i className="bi bi-envelope is-size-5"></i>}
              name="userEmail"
              value={userEmail}
              onChange={handleSignInChange}
            />
            <Input.Password
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite sua senha"
              contentLeft={<i className="bi bi-key is-size-5"></i>}
              name="userPassword"
              value={userPassword}
              onChange={handleSignInChange}
            />
            <Row justify="space-between">
              <Checkbox>
                <Text size={14}>Lembre minha senha</Text>
              </Checkbox>
              <Text size={14}>Esqueceu a senha?</Text>
            </Row>
          </Modal.Body>
        )}

        {!hasAccount && (
          <Modal.Body>
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite o nome da empresa"
              contentLeft={<i className="bi bi-people is-size-5"></i>}
              name="workplace"
              value={workplace}
              onChange={handleSignUpChange}
            />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite seu nome"
              contentLeft={<i className="bi bi-person is-size-5"></i>}
              name="username"
              value={username}
              onChange={handleSignUpChange}
            />
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite seu email"
              contentLeft={<i className="bi bi-envelope is-size-5"></i>}
              name="email"
              value={email}
              onChange={handleSignUpChange}
            />
            <Input.Password
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite sua senha"
              contentLeft={<i className="bi bi-key is-size-5"></i>}
              name="password"
              value={password}
              onChange={handleSignUpChange}
            />
            <Input.Password
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Repita sua senha"
              contentLeft={<i className="bi bi-key is-size-5"></i>}
              name="repetedPassword"
              value={repetedPassword}
              onChange={handleSignUpChange}
            />
            <Checkbox
              name="hasConsented"
              onChange={() =>
                setSignUpValues({
                  ...signUpValues,
                  hasConsented: !hasConsented,
                })
              }
            >
              <Text size={14}>Concordo com os Termos de Uso</Text>
            </Checkbox>
            <Spacer y={0.5}></Spacer>
          </Modal.Body>
        )}
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
    </div>
  );
}
