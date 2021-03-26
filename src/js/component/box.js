import React from "react"
import { useThemeContext } from "feature/theme"
import { block, cx, css } from "style"

const bss = block("box")

const Box = ({
  className,
  color = "primary",
  bg = "secondary",
  amt = 4,
  themed,
  ...props
}) => {
  const { getColor } = useThemeContext()
  return (
    <div
      className={cx(
        bss(),
        css({
          borderRadius: 4,
          backgroundColor: themed
            ? getColor(color, bg, amt)
            : getColor("#F5F5F5", "#F5F5F5", amt)
        }),
        className
      )}
      {...props}
    />
  )
}

export default Box
