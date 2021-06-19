import React, { useState, useEffect, createContext, useContext } from "react"
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles"
import apiUser from "api/user"
import { css, pickFontColor } from "style"

const default_theme = {
  primary: "#F5F5F5",
  secondary: "#F5F5F5",
  font: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif`,
  header_char: "\\",
}

export const ThemeContext = createContext({
  theme: default_theme,
  color: () => {},
  setTheme: () => {},
  getColor: () => {},
})

export const useThemeContext = () => useContext(ThemeContext)

const ThemeProvider = ({ theme: _theme, username, notheme, children }) => {
  const [user_theme, fetchTheme] = apiUser.useRoute("get_theme")

  const [theme, setTheme] = useState(_theme || default_theme)
  const [muiTheme, setMuiTheme] = useState(
    createMuiTheme({
      typography: {
        fontFamily: "Proggy, Roboto", // doesnt work of course
      },
      palette: {
        primary: {
          main: default_theme.primary,
        },
        secondary: {
          main: default_theme.secondary,
        },
      },
    })
  )
  useEffect(() => {
    setMuiTheme(
      createMuiTheme({
        palette: {
          primary: {
            main: theme.primary,
          },
          secondary: {
            main: theme.secondary,
          },
        },
      })
    )
  }, [theme])

  useEffect(() => {
    if (username) fetchTheme(username)
  }, [username])

  useEffect(() => {
    const sel_theme = notheme ? default_theme : _theme || user_theme
    if (sel_theme) setTheme(sel_theme)
  }, [_theme, user_theme, notheme])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeContext.Provider
        value={{
          theme,
          getColor: (fg, bg, num) =>
            pickFontColor(
              theme[fg] || fg || theme.primary,
              theme[bg] || bg || theme.secondary,
              num
            ),
          setTheme: (t) => setTheme(t || theme),
        }}
      >
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export const QuickTheme = ({ theme:_theme, children }) => {
  const [theme, setTheme] = useState(createMuiTheme())
  useEffect(() => {
    if (_theme)
      setTheme(createMuiTheme(_theme))
  }, [_theme])

  return theme ? 
  (<MuiThemeProvider theme={theme}>
    {children}
  </MuiThemeProvider>)
  :
  (<>
    {children}
  </>)
}

export default ThemeProvider
