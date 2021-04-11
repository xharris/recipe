import React, { useEffect } from "react"
import Box from "component/box"
import Button from "component/button"
import { Link } from "react-router-dom"
import { useAuthContext } from "component/auth"
import * as url from "util/url"

import { block, cx, css, pickFontColor } from "style"

const bss = block("avatar")

const Avatar = ({ size = "small", user, theme: _theme, preview, nolink }) => {
  const { user: auth_user } = useAuthContext()
  const {
    display_name,
    username,
    avatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    theme = _theme,
  } = user

  const Container = ({ ...props }) =>
    !nolink ? (
      <Link to={user && !preview && url.profile(username)} {...props} />
    ) : (
      <div {...props} />
    )

  useEffect(() => {
    if (size === "full" && username) fetch(username)
  }, [size, username])

  return (
    <Container
      className={bss({ size, type: avatar ? "image" : "text" })}
      title={display_name}
    >
      {avatar == null ? (
        <div className={bss("text")}>
          {display_name.toUpperCase().slice(0, 2)}
        </div>
      ) : (
        <img className={bss("image")} src={avatar} />
      )}
    </Container>
  )
}

export default Avatar
