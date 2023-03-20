import React, { useContext, useState } from 'react'

let initialUserObj = {
    id: '',
    userName: '',
    workplaceName: '',
    userType: ''
}

type typeUserObj = typeof initialUserObj

interface AuthContextData {
    currentUser: typeUserObj,
    setCurrentUser: React.Dispatch<React.SetStateAction<typeUserObj>>
}

interface childrenType {
    children : React.ReactNode
}

const AuthContext = React.createContext({} as AuthContextData)

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: childrenType) => {

    const [currentUser, setCurrentUser] = useState(initialUserObj)

    return (
        <>
            <AuthContext.Provider value={{currentUser, setCurrentUser}}>
                    {children}
            </AuthContext.Provider>
        </>
    )
}