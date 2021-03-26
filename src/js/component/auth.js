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

import * as apiUser from "api/user"

const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  user: null,
})

export const useAuthContext = () => useContext(AuthContext)

const AuthProvider = ({ allowPasswordless, children }) => {
  const location = useLocation()
  const history = useHistory()
  const [user, setUser] = useState()
  const [auth, setAuth] = useState()

  const signIn = (id, pwd, remember) =>
    apiUser
      .login({ id, pwd, remember })
      .then((res) => setUser({ ...res.data.data }))

  const signOut = () => apiUser.logout().then((res) => setUser())

  const signUp = (data) =>
    apiUser.add(data).then(() => signIn(data.id, data.pwd))

  const signUpNoPass = () => {
    const [id, pwd] = [uuidv4(), uuidv4()]
    signUp({ id, pwd }).then(() => signIn(id, pwd, true))
  }

  useEffect(() => {
    // check if user should still be logged in
    apiUser
      .verify()
      .then((r) => setUser({ ...r.data.data }))
      .catch(() => {
        if (allowPasswordless) signUpNoPass()
        else signOut()
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
