import React from "react"
import * as Icons from "@material-ui/icons"
import { cx, block } from "style"

const bss = block("icon")

export const Icon = ({ icon, className, label, ...props }) => {
  const FinalIcon = Icons[icon]
  return (
    <div className={cx(bss(), className)}>
      {label != null && <div className={bss("label")}>{label}</div>}
      <FinalIcon {...props} />
    </div>
  )
}

export default Icon
