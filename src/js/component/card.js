import React from "react"
import { Link } from "react-router-dom"
import { css, cx, block, pickFontColor } from "style"

const bss = block("card")

const Card = ({ color, bgColor, className, thickness, to, ...props }) => {
  const style = cx(
    bss(),
    color &&
      css({
        border: `1px solid ${pickFontColor(bgColor, color, 30)}`,
        boxShadow: Array.from(
          { length: thickness || 2 },
          (v, i) => `${i}px ${i}px 0px 0px ${pickFontColor(bgColor, color, 10)}`
        ).join(","),
        background: bgColor,
        cursor: to && "pointer"
      }),
    className
  )

  return to ? (
    <Link to={to} className={style} {...props} />
  ) : (
    <div className={style} {...props} />
  )
}

export default Card
