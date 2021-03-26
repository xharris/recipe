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
      <Link to={user && !preview && url.user(username)} {...props} />
    ) : (
      <div {...props} />
    )

  const Square = () =>
    avatar == null ? (
      <Container
        className={cx(
          bss("square"),
          css({
            color: pickFontColor(theme.primary),
            borderColor: pickFontColor(theme.primary, theme.primary, 20),
            backgroundColor: theme.primary,
          })
        )}
      >
        {display_name.toUpperCase().slice(0, 2)}
      </Container>
    ) : (
      <Container className={cx(bss("image"))}>
        <img src={avatar} />
      </Container>
    )

  useEffect(() => {
    if (size === "full" && username) fetch(username)
  }, [size, username])

  return size === "full" ? (
    <Box className={bss({ size })} color={theme.primary}>
      {/*<Square />
      {user.display_name}
      {auth_user && auth_user.username !== username ? (
        <Button
          className={css({
            height: 40
          })}
          label={following ? "Unfollow" : "Follow"}
          onClick={() => updateFollowing(username)}
          outlined
        />
      ) : (
        <div className={css({ width: 50 })} />
      )}*/}
    </Box>
  ) : (
    <div className={bss({ size })} title={display_name}>
      <Square />
    </div>
  )
}

export default Avatar
