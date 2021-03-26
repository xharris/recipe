import React, { useState, useEffect, useRef } from "react"
import Button from "component/button"

import { cx, block } from "style"

const bss = block("overflowdialog")

const OverflowDialog = ({
  open: _open,
  onClose,
  closeButton,
  centered,
  children,
  className,
  transparent
}) => {
  const [open, setOpen] = useState(!!_open)
  useEffect(() => {
    setOpen(!!_open)
  }, [_open])
  const ref_children = useRef()

  return (
    <div className={cx(bss({ open, centered, transparent }), className)}>
      {open && [
        closeButton && (
          <Button
            key="close"
            className={bss("close")}
            icon="Close"
            onClick={() => onClose(false)}
            color="#ffffff"
            outlined
          />
        ),
        <div
          key="children"
          className={bss("children")}
          onClick={e => {
            if (e.target === ref_children.current && !closeButton) {
              if (onClose) {
                console.log("out!")
                onClose(false)
              } else setOpen(false)
            }
          }}
          ref={ref_children}
        >
          {children}
        </div>
      ]}
    </div>
  )
}

export default OverflowDialog
