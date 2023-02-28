import React, { ReactEventHandler, ReactPropTypes } from 'react'
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
              value={props.userWorkplace}
              onChange={props.handleSignInChange}
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
              value={props.userPassword}
              onChange={props.handleSignInChange}
            />
            <Row justify="space-between">
              <Checkbox>
                <Text size={14}>Lembre minha senha</Text>
              </Checkbox>
              <Text size={14}>Esqueceu a senha?</Text>
            </Row>
          </Modal.Body>
  )
}