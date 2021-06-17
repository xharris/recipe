import React, { createElement } from "react"
import { useThemeContext } from "component/theme"
import { block, cx, css, pickFontColor } from "style"

const bss = block("text")

const Text = ({
  className,
  themed,
  color = "primary",
  bg = "secondary",
  amt = 20,
  component = "div",
  children,
  ...props
}) => {
  const { theme, getColor } = useThemeContext()
  const Container = (props) => createElement(component, props)
  return (
    <Container
      className={cx(
        bss(),
        css({
          color: themed && getColor(color, bg, amt),
        }),
        className
      )}
      {...props}
    >
      {children}
    </Container>
  )
}

export default Text
