import { Modal, Col, Spacer, Text, Row } from '@nextui-org/react'
import Tooltip from '@mui/material/Tooltip'
import './styles.css'
import Button from '../../components/Button/Button'
import React, { useEffect, useReducer, useState } from 'react'
import { OrdinaryInput } from '../OrdinaryInput/OrdinaryInput'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { DOC_PATH, db } from '../../utils/firebase/firebase'
import { useAuthContext } from '../../utils/contexts/AuthProvider'
import { initialSignUp } from '../../types/Login/loginTypes'
import { InputUserType } from '../InputUserType/InputUserType'
import { AlertModal } from '../AlertModal/AlertModal'

export const UsersManager = (props: any) => {
  const initialuserInfo = {} as initialSignUp

  const AuthContext = useAuthContext()
  const [userList, setUserList] = useState<Array<initialSignUp>>([])
  const [showedUserList, setShowedUserList] = useState<Array<initialSignUp>>([])
  const [showPassword, setShowPassword] = useState<Array<string>>([])
  const [alertVisible, setAlertVisible] = useState(false)
  const [userInfo, setUserInfo] = useReducer(
    (currentValues: initialSignUp, newValues: initialSignUp) => {
      return { ...currentValues, ...newValues }
    },
    initialuserInfo
  )

  

  const alertHandle = () => setAlertVisible(true);
  const closeAlertHandle = () => setAlertVisible(false);

  const emailValidation = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  const handleUserInfoChange = (event: {
    target: { name: string; value: string }
  }) => {
    const { name, value } = event.target
    const newValues = { [name]: value }
    setUserInfo({ ...userInfo, ...newValues });
  };

  const getUsers = async () => {
    if (AuthContext.currentUser?.id == '' || !AuthContext.currentUser?.id) return false
    let docRef = doc(db, DOC_PATH, `${AuthContext.currentUser.id}`)
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
    if(userInfo.userId.length > 0) deleteUser(userInfo.userId, true)
    let userId = {userId : Date.now().toString()}
    const userData = {...userInfo, ...userId}
    for (var key in userData) {
      //@ts-ignore
      if (userData[key].length < 1) return
    }
    await updateDoc(doc(db, DOC_PATH, AuthContext.currentUser.id), {
      users: arrayUnion(userData)
    })
    getUsers()
    clear()
  }

  const editUser = (email :string) => {
      setUserInfo(userList[userList.findIndex(user => user.email == email)])
      deleteUser(email)
  }

  const deleteUser = async (id: string, forced = false) => {
    console.log("here")
    if(userList.find(user => user.userId == id)?.userType == "Master" && userList.filter(user => user.userType == "Master").length == 1 && !forced) return alertHandle()
      await updateDoc(doc(db, DOC_PATH, AuthContext.currentUser.id), {
          users: userList.filter(user => user.userId != id)
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
      password: "",
      userId: ""
    })
  }

  useEffect(() => {
    getUsers()
  }, [AuthContext.currentUser?.id])

  return (
    <div>
      <AlertModal text={"Uma empresa deve ter ao menos uma conta Master."} visible={alertVisible} closeHandler={closeAlertHandle}/> 
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
                <Text b css={{ "transform": "translateX(30px)" }} >Nome</Text>
                <Text b css={{ "transform": "translateX(40px)" }}>Email</Text>
                <Text b css={{ "transform": "translateX(-10px)" }}>Tipo de Usuário</Text>
                <Text b css={{ "transform": "translateX(-100px)" }}>Senha</Text>
              </Row>
              {showedUserList.map((user, index: number) => {
                return (
                  <div  key={Math.floor(Math.random() * 1_000_000_000).toString()} >
                    <div className="users-div" >
                      <p style={{"width": "120px"  }}><abbr title={user.username}>{user.username}</abbr></p>
                      <p style={{"width": "200px"  }}><abbr title={user.email}>{user.email}</abbr></p>
                      <p style={{"width": "80px"  }}><abbr title={user.userType}>{user.userType}</abbr></p>
                      <p
                        style={{"width": "120px", "fontSize" : `${user.password.length > 12  && showPassword.includes(user.email)? "8pt" : "1em"}`}}
                        className="is-flex is-justify-content-space-between"
                      >
                        {showPassword.includes(user.email) ? user.password : "************"}
                        <span className='ml-2' onClick={() => toggleShowPassword(user.email)}>
                          {showPassword.includes(user.email) ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye"></i>}
                        </span>
                      </p>
                      <div> 
                        <Tooltip color="primary" title="Alterar">
                          <button onClick={() => setUserInfo(userList[userList.findIndex(user2 => user2.userId == user.userId)])}>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                        </Tooltip>
                        <button onClick={() => deleteUser(user.userId)}>
                          <Tooltip title="Deletar">
                            <i className="bi bi-trash3"></i>
                          </Tooltip>
                        </button>
                      </div>
                    </div>
                  </div >
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