import React from "react"
import { useThemeContext } from "feature/theme"
import { cx, block, css, pickFontColor } from "style"

const bss = block("separator")

const Separator = () => {
  const { theme } = useThemeContext()
  return (
    <span
      className={cx(
        bss("separator"),
        css({
          borderRight: `1px solid ${pickFontColor(
            theme.primary,
            theme.primary,
            10
          )}`
        })
      )}
    />
  )
}

export default Separator
