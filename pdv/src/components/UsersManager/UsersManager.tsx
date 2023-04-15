import { Modal, Col, Spacer, Text, Row } from '@nextui-org/react'
import Tooltip from '@mui/material/Tooltip'
import './styles.css'
import Button from '../../components/Button/Button'
import React, { useEffect, useReducer, useState } from 'react'
import { OrdinaryInput } from '../OrdinaryInput/OrdinaryInput'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { initialSignUp } from '../../types/Login/loginTypes'
import { InputUserType } from '../InputUserType/InputUserType'

export const UsersManager = (props: any) => {
  const initialuserInfo = {} as initialSignUp

  const AuthContext = useAuthContext()
  const [userList, setUserList] = useState<Array<initialSignUp>>([])
  const [showedUserList, setShowedUserList] = useState<Array<initialSignUp>>([])
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
        let data = res.data()?.users
        setUserList(data)
        if(AuthContext.currentUser.userType.toLowerCase() == "padrão") return setShowedUserList(data.filter((user :initialSignUp )=> user.username == AuthContext.currentUser.userName))
        if(AuthContext.currentUser.userType.toLowerCase() == "gerencia") return setShowedUserList(data.filter((user :initialSignUp )=> user.userType.toLowerCase() != "master"))
        if(AuthContext.currentUser.userType.toLowerCase() == "master") return setShowedUserList(data)
      })
  }

  const addUser = async () => {
    for (var key in userInfo) {
      //@ts-ignore
      if (userInfo[key].length < 1) return
    }
    const newUser = [userInfo]
    await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
      users: arrayUnion(userInfo)
    })
    getUsers()
    clear()
  }

  const editUser = (email :string) => {
      setUserInfo(userList[userList.findIndex(user => user.email == email)])
      deleteUser(email)
  }

  const deleteUser = async (email: string) => {
      await updateDoc(doc(db, "empresas", AuthContext.currentUser.id), {
          users: userList.filter(user => user.email != email)
      })
          getUsers()
  }

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

  useEffect(() => {
    getUsers()
  }, [AuthContext.currentUser.id])

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
                password="password"
                handleChange={handleUserInfoChange}
                value={userInfo.password}
                invalidPassword={userInfo.password && userInfo.password?.length < 8 ? true : false}
              />
              <Button
                onClick={addUser}
                className='is-success'
                text={<i className="bi bi-check-lg is-size-4"></i>}
                disabled={!userInfo.username || !userInfo.userType || !userInfo.email || !userInfo.password ? true : false}
              />
            </Row>
            <Spacer y={0.5} />
            <hr />
            <Spacer y={0.5} />
            <Col className="users-container">
              <Row justify='space-between'>
                <Text b css={{ "transform": "translateX(5px)" }} >Nome</Text>
                <Text b css={{ "transform": "translateX(-30px)" }}>Email</Text>
                <Text b css={{ "transform": "translateX(-60px)" }}>Tipo de Usuário</Text>
                <Text b css={{ "transform": "translateX(-130px)" }}>Senha</Text>
              </Row>
              {showedUserList.map((user, index: number) => {
                return (
                  <>
                    <div key={index} className="users-div">
                      <p style={{ "transform": "translateX(-28px)", "width": "120px"  }}><abbr title={user.username}>{user.username}</abbr></p>
                      <p style={{ "transform": "translateX(-70px)", "width": "200px"  }}><abbr title={user.email}>{user.email}</abbr></p>
                      <p style={{ "transform": "translateX(-50px)", "width": "80px"  }}><abbr title={user.userType}>{user.userType}</abbr></p>
                      <p
                        style={{ "transform": "translateX(-30px)", "minWidth": "120px", "maxWidth" : "140px" }}
                        className="is-flex is-justify-content-space-between"
                      >
                        {showPassword.includes(user.email) ? user.password : "************"}
                        <span className='ml-2' onClick={() => toggleShowPassword(user.email)}>
                          {showPassword.includes(user.email) ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                        </span>
                      </p>
                      <div>
                        <Tooltip color="primary" title="Alterar">
                          <button onClick={() => editUser(user.email)}>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        </Tooltip>
                        <button onClick={() => deleteUser(user.email)}>
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