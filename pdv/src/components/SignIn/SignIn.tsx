import React from 'react'
import {
    Modal,
    Text,
    Input,
    Row,
    Checkbox,
  } from "@nextui-org/react";

export const SignIn = (props :any) => {
  return (
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
              aria-label="userWorkplace"
              value={props.userWorkplace}
              onChange={props.handleSignInChange}
               css={{"color": "#FFF"}}
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
              aria-label="userEmail"
              value={props.userEmail}
              onChange={props.handleSignInChange}
            />
            <Input.Password
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Digite sua senha"
              contentLeft={<i className="bi bi-key is-size-5"></i>}
              name="userPassword"
              aria-label="userPassword"
              value={props.userPassword}
              onChange={props.handleSignInChange}
              css={{"color": "#FFF"}}
            />
            <Row justify="space-between">
              <Checkbox
                id={"rememberMe"}
                value={props.rememberMe}
                onChange={(e) => props.handleSignInChange(e)}
                >
                <Text size={14}>Manter conectado</Text>
              </Checkbox>
              <Text size={14}>Esqueceu a senha?</Text>
            </Row>
          </Modal.Body>
  )
}
