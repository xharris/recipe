import React from "react"
import Container from "@material-ui/core/Container"
import { useAuthContext } from "component/auth"
import { block, cx, css } from "style"

const bss = block("body")

const Body = ({ children, div, size, fixed, className }) =>
  div ? (
    <div className={cx(bss(), className)}>{children}</div>
  ) : (
    <Container
      maxWidth={!fixed && (size || "md")}
      className={cx(bss(), className)}
    >
      {children}
    </Container>
  )

export default Body
