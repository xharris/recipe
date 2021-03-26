import React, { useState, useEffect } from "react"
import Expandable from "component/expandable"
import Dialog from "component/modal"
import Button from "component/button"
import Form from "component/form"
import { useAuthContext } from "component/auth"

import { block } from "style"
const bss = block("loginmodal")

const error_messages = {
  USER_NOT_FOUND: "Email not found",
  BAD_LOGIN: "Username or password incorrect",
  PASS_NO_MATCH: "Passwords do not match",
  DUPLICATE: "Username already exists",
  UNKNOWN: "Could not sign in",
}

const LoginModal = ({ signUp: _signUp, open, onClose }) => {
  const { signIn, signUp } = useAuthContext()
  const [error, setError] = useState()
  const [signingUp, setSigningUp] = useState(_signUp)
  const [pass2, setPass2] = useState()

  useEffect(() => {
    setSigningUp(_signUp)
  }, [_signUp])

  return (
    <Dialog className={bss()} onClose={onClose} open={open}>
      <Form
        className={bss("form")}
        onSave={(v) => {
          if (signingUp) {
            if (v.pwd !== pass2) setError("PASS_NO_MATCH")
            else
              signUp(v)
                .then(() => onClose())
                .catch((e) =>
                  setError(e.response ? e.response.data.message : "UNKNOWN")
                )
          } else {
            setError()
            signIn(v.id, v.pwd, v.remember)
              .then(() => onClose())
              .catch((e) =>
                setError(e.response ? e.response.data.message : "UNKNOWN")
              )
          }
        }}
      >
        {({ Input, Checkbox, SubmitButton, Group }) => [
          <Group key="inputs" title={signingUp ? "Sign up" : "Log in"}>
            <Input label="email" name="id" type="email" required />
            <Input label="password" name="pwd" type="password" required />
            {signingUp && (
              <>
                <Input
                  label="confirm password"
                  type="password"
                  onChange={setPass2}
                />
                <Input label="username" name="username" />
              </>
            )}
            {!signingUp && <Checkbox label="remember me" name="remember" />}
            <SubmitButton
              label={signingUp ? "Sign up" : "Login"}
              color="secondary"
              bg="secondary"
              outlined
            />
          </Group>,
          error && (
            <div className={bss("error")} key="error">
              {error_messages[error]}
            </div>
          ),
          <Button
            key="switch_form"
            className={bss("switchform")}
            label={`${signingUp ? "Log in" : "Sign up"} instead`}
            onClick={() => setSigningUp(!signingUp) && setError()}
            color="secondary"
            bg="secondary"
            link
          />,
        ]}
      </Form>
    </Dialog>
  )
}

export default LoginModal
