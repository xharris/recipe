import React, { useEffect, useState } from "react"
import Header from "feature/header"
import Title from "component/title"
import ThemeProvider from "feature/theme"
import { block, cx, css } from "style"

const bss = block("page")

const Page = ({ className, children, title, theme, ...props }) => {
  return (
    <div
      className={cx(
        bss(),
        css({
          backgroundColor: theme && theme.primary
        }),
        className
      )}
      {...props}
    >
      <ThemeProvider theme={theme}>
        <Title>{title}</Title>
        <Header />
      </ThemeProvider>
      {children}
      {/*<div className={bss("footer")}>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://icons8.com/icons/set/mouse-animal"
        >
          Mouse Animal icon
        </a>{" "}
        icon by{" "}
        <a target="_blank" href="https://icons8.com">
          Icons8
        </a>
      </div>*/}
    </div>
  )
}

export default Page
