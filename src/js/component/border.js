import React from "react"
import { block, cx } from "style"

const bss = block("border")

const Border = ({ label, children, className }) => (
  <div className={cx(bss(), className)}>
    <div className={bss("label")}>{label}</div>
    {children}
  </div>
)

export default Border
