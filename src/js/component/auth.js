import React, {
  useState,
  useEffect,
  useLayoutEffect,
  createContext,
  useContext,
} from "react"
import { useLocation, useHistory } from "react-router-dom"
import Cookies from "js-cookie"
import { v4 as uuidv4 } from "uuid"

import { isCancel } from "api"
import apiUser from "api/user"

const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  user: null,
})

export const useAuthContext = () => useContext(AuthContext)

const AuthProvider = ({ allowPasswordless, children }) => {
  const { login, logout, verify, add } = apiUser
  const location = useLocation()
  const history = useHistory()
  const [user, setUser] = useState()
  const [auth, setAuth] = useState()

  const signIn = (id, pwd, remember) =>
    login({ id, pwd, remember })
      .then(data => setUser({ ...data }))

  const signOut = () => 
    logout()
      .then(() => setUser())

  const signUp = (data) =>
    add(data)
      .then(() => signIn(data.id, data.pwd))

  const signUpNoPass = () => {
    const [id, pwd] = [uuidv4(), uuidv4()]
    signUp({ id, pwd }).then(() => signIn(id, pwd, true))
  }

  useEffect(() => {
    // check if user should still be logged in
    verify()
      .then(data => setUser({ ...data }))
      .catch(e => {
        if (allowPasswordless) signUpNoPass()
        else if (!isCancel(e)) signOut()
      })
  }, [location.pathname])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
