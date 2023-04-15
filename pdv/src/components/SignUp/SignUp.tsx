import React, { useEffect } from "react";
import './styles.css'
import {
    Modal,
    Text,
    Input,
    Checkbox,
    Spacer,
  } from "@nextui-org/react";


export const SignUp = (props :any) => {

    return(
        <Modal.Body className="sign-up-container">
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite o nome da empresa"
              contentLeft={<i className="bi bi-people is-size-5"></i>}
              name="workplace"
              aria-label="workplace"
              value={props.workplace}
              onChange={props.handleSignUpChange}
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
              aria-label="username"
              value={props.username}
              onChange={props.handleSignUpChange}
            />
            <Input
              clearable
              bordered
              fullWidth
              color={props.invalidEmail ? 'error' : 'primary'}
              helperText={props.invalidEmail ? 'Senha precisa ter 8 digitos' : ''}
              helperColor="error"
              size="lg"
              placeholder="Digite seu email"
              contentLeft={<i className="bi bi-envelope is-size-5"></i>}
              name="email"
              aria-label="email"
              value={props.email}
              onChange={props.handleSignUpChange}
            />
            <Input.Password
              bordered
              fullWidth
              color={props.invalidPassword ? 'error' : 'primary'}
              helperText={props.invalidPassword ? 'Senha precisa ter 8 digitos' : ''}
              helperColor="error"
              size="lg"
              placeholder="Digite sua senha"
              contentLeft={<i className="bi bi-key is-size-5"></i>}
              name="password"
              aria-label="password"
              value={props.password}
              onChange={props.handleSignUpChange}
            />
            <Input.Password
              bordered
              fullWidth
              color={props.difPassword ? 'error' : 'primary'}
              helperText={props.difPassword ? 'As senhas precisam ser iguais' : ''}
              helperColor="error"
              size="lg"
              placeholder="Repita sua senha"
              contentLeft={<i className="bi bi-key is-size-5"></i>}
              name="repetedPassword"
              aria-label="repetedPassword"
              value={props.repetedPassword}
              onChange={props.handleSignUpChange}
            />
            <Checkbox
              name="hasConsented"
              onChange={() =>
                props.setSignUpValues({
                  ...props.signUpValues,
                  hasConsented: !props.signUpValues.hasConsented,
                })
              }
            >
              <Text size={14}>Concordo com os Termos de Uso</Text>
            </Checkbox>
            <Spacer y={0.5}></Spacer>
          </Modal.Body>
    )
}