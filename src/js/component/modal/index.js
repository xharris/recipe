import React from "react"
import { Dialog as MatDialog } from "@material-ui/core"
import Button from "component/button"

import { block, cx } from "style"
const bss = block("dialog")

const Dialog = ({ className, open, onClose, children }) => {
  return (
    <MatDialog
      open={!!open}
      className={cx(bss(), className)}
      onClose={() => {
        if (onClose) onClose(false)
      }}
    >
      {children}
    </MatDialog>
  )
}

export default Dialog
