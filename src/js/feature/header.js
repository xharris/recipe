import React, { useState, useEffect } from "react"
import { useAuthContext } from "component/auth"
import Button from "component/button"
import MenuButton from "component/menubutton"
import Container from "@material-ui/core/Container"
import ThemeProvider from "feature/theme"
import LoginModal from "component/loginmodal"
import { block } from "style"
import * as url from "util/url"

const bss = block("header")

const Header = () => {
  const { user } = useAuthContext()
  const [showSettings, setShowSettings] = useState()
  const [showLogin, setShowLogin] = useState()
  const color = "secondary"
  const opp_color = color === "secondary" ? "primary" : "secondary"

  return (
    <header className={bss()}>
      <Container className={bss("inner")} maxWidth="md">
        <div className={bss("left")}>
          <Button
            className={bss("button")}
            label="Home"
            type="button"
            to={url.home()}
            color={color}
            bg={opp_color}
            outlined
          />
        </div>
        <div className={bss("right")}>
          {user ? (
            [
              <Button
                key="add"
                icon="Add"
                to={url.add_recipe()}
                title="Add a recipe"
              />,
              <MenuButton
                key="menu"
                label={user ? user.display_name : "?"}
                items={[
                  {
                    label: "Profile",
                    to: url.profile(user.username),
                  },
                  {
                    label: "Settings",
                    onClick: () => setShowSettings(true),
                  },
                ]}
                closeOnSelect
                color={color}
                bg={opp_color}
                disabled={!user}
              />,
            ]
          ) : (
            <Button
              label="Sign up / Log in"
              type="button"
              onClick={() => setShowLogin(true)}
              outlined
            />
          )}
        </div>
      </Container>

      <ThemeProvider>
        <LoginModal open={!!showLogin} onClose={() => setShowLogin(false)} />
        {/* <SettingsModal open={showSettings} onClose={setShowSettings} /> */}
      </ThemeProvider>
    </header>
  )
}

export default Header
