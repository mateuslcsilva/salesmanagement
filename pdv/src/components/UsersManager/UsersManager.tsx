import { Modal, Col, Spacer, Text, Row } from '@nextui-org/react'
import Tooltip from '@mui/material/Tooltip'
import './styles.css'
import Button from '../../components/Button/Button'
import React, { useEffect, useReducer, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { OrdinaryInput } from '../OrdinaryInput/OrdinaryInput'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { Alert } from '@mui/material'
import { initialSignUp } from '../../types/Login/loginTypes'
import { InputUserType } from '../InputUserType/InputUserType'

export const UsersManager = (props: any) => {
  const initialuserInfo = {} as initialSignUp

  const AuthContext = useAuthContext()
  const [userList, setUserList] = useState<Array<initialSignUp>>([])
  const [alert, setAlert] = useState(<p></p>)
  const [showPassword, setShowPassword] = useState<Array<string>>([])
  const [userInfo, setUserInfo] = useReducer(
    (currentValues: initialSignUp, newValues: initialSignUp) => {
      return { ...currentValues, ...newValues }
    },
    initialuserInfo
  )

  const emailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  const handleUserInfoChange = (event: {
    target: { name: string; value: string }
  }) => {
    const { name, value } = event.target
    const newValues = { [name]: value }
    setUserInfo({ ...userInfo, ...newValues });
  };

  const getUsers = async () => {
    if (AuthContext.currentUser.id == '') return false
    let docRef = doc(db, "empresas", `${AuthContext.currentUser.id}`)
    let data = await getDoc(docRef)
      .then(res => {
        setUserList(res.data()?.users)
      })
  }

  /* const addItem = async () => {
      if (userList.find(item => item.itemRef == userInfo.itemRef)) return setAlert(<Alert severity="error" >Referência já cadastrada!</Alert>)
      //@ts-ignore
      const convert = { itemRef: Number(userInfo.itemRef), itemValue: typeof userInfo.itemValue == "number" ? userInfo.itemValue : Number(userInfo.itemValue.replaceAll(',', '.')), numItem : userList.map(item => item.numItem).sort((a, b) => a - b).at(-1) + 1}
      const newItem = [{...userInfo, ...convert}]
      if (newItem[0].itemValue >= Infinity || isNaN(newItem[0].itemValue)) {
          setAlert(<Alert severity="error">Por favor, insira os dados novamente!</Alert>)
          return clear()
      }
      await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
          items: [...userList, ...newItem]
      }).then(res => console.log(res))
          .catch(err => console.log(err.message))
          getUsers()
          clear()
  }
*/
  /* const editItem = (ref :number) => {
      setUserInfo(userList[userList.findIndex(item => item.numItem == ref)])
      deleteItem(ref)
  } */

  /* const deleteItem = async (ref: number) => {
      await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
          items: userList.filter(item => item.numItem != ref)
      }).then(res => console.log(res))
          .catch(err => console.log(err.message))
          getUsers()
  } */

  const toggleShowPassword = (password: string) => {
    //@ts-ignore
    if (showPassword.includes(password)) return setShowPassword(showPassword.filter(showedPassword => showedPassword != password))
    let newShowPassword = [password]
    setShowPassword([...showPassword, ...newShowPassword])
  }

  const clear = () => {
    setUserInfo({
      userType: "",
      email: "",
      username: "",
      password: ""
    })
  }

  /* useEffect(() => {
      const clearAlert = setTimeout(() => {
          setAlert(<p></p>)
      }, 5000)

      return () => clearTimeout(clearAlert)
  }) */

  useEffect(() => {
    getUsers()
  }, [AuthContext.currentUser.id])

  useEffect(() => {
    console.log(userList)
    console.log("userInfo: ", userInfo)
  })

  return (
    <div>
      <Modal
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={() => props.closeUsersHandler()}
        className={document.querySelector('.main')?.classList.contains('darkThemed') ? "dark-theme-modal" : ""}
        width="800px"
        blur
        preventClose={userInfo.username || userInfo.userType || userInfo.password || userInfo.email ? true : false}
      >
        <Modal.Header>
          <Col>
            <Text id="modal-title" size={22} transform="full-width">
              Gerenciador de Usuários
            </Text>
            <Spacer y={0.5} />

          </Col>
        </Modal.Header>
        <Modal.Body>
          <Col >
            <Row >
              <OrdinaryInput
                label="Nome"
                name="username"
                handleChange={handleUserInfoChange}
                value={userInfo.username}
                string="text"
              />
              <OrdinaryInput
                label="Email"
                name="email"
                handleChange={handleUserInfoChange}
                value={userInfo.email}
                string="text"
                large
                align-right
                invalid={userInfo.email && !emailValidation.test(userInfo.email) ? true : false}
              />
              <InputUserType
                userInfo={userInfo}
                handleUserInfoChange={handleUserInfoChange}
               />
              <OrdinaryInput
                label="Senha"
                name="password"
                password = "password"
                handleChange={handleUserInfoChange}
                value={userInfo.password}
                invalidPassword={userInfo.password && userInfo.password?.length < 8 ? true : false}
              />
              <Button
                /* onClick={addItem} */
                className='is-success'
                text={<i className="bi bi-check-lg is-size-4"></i>}
              disabled={!userInfo.username || !userInfo.userType || !userInfo.email || !userInfo.password ? true : false}
              />
            </Row>
            <Spacer y={0.5} />
            {alert}
            <hr />
            <Spacer y={0.5} />
            <Col className="users-container">
              <Row justify='space-between'>
                <Text b >Nome</Text>
                <Text b css={{ "transform": "translateX(-60px)" }}>Email</Text>
                <Text b css={{ "transform": "translateX(-80px)" }}>Tipo de Usuário</Text>
                <Text b css={{ "transform": "translateX(-130px)" }}>Senha</Text>
              </Row>
              {userList.map((user, index: number) => {
                return (
                  <>
                    <div key={index} className="users-div">
                      <p>{user.username}</p>
                      <p style={{ "transform": "translateX(-50px)" }}>{user.email}</p>
                      <p style={{ "transform": "translateX(0px)" }}>{user.userType}</p>
                      <p
                        style={{ "transform": "translateX(10px)", "width" : "40px" }}
                        className="is-flex is-justify-content-space-between"
                      >
                        {showPassword.includes(user.password) ? user.password : "********"}
                        <span className='ml-2' onClick={() => toggleShowPassword(user.password)}>
                          {showPassword.includes(user.password) ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                        </span>
                      </p>
                      <div>
                        <Tooltip color="primary" title="Alterar">
                          <button /* onClick={() => editItem(item.numItem)} */>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        </Tooltip>
                        <button /* onClick={() => deleteItem(item.numItem)} */>
                          <Tooltip title="Deletar">
                            <i className="bi bi-trash3"></i>
                          </Tooltip>
                        </button>
                      </div>
                    </div>
                  </>
                )
              })}
            </Col>
          </Col>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  )
}