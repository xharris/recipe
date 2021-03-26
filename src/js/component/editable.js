import React, { useEffect, useState, useRef } from "react"
import ContentEditable from "react-contenteditable"
import { cx, block } from "style"

const bss = block("editable")

const Editable = ({
  defaultValue = "",
  onChange,
  className,
  multiline,
  disabled,
  ...inputProps
}) => {
  const [content, setContent] = useState(defaultValue)

  useEffect(() => {
    if (onChange) {
      onChange(content)
    }
  }, [content, onChange])

  return (
    <ContentEditable
      className={cx(
        bss(),
        bss("editable", { line: multiline ? "multi" : "single", disabled }),
        className
      )}
      html={content}
      disabled={disabled}
      onChange={(e) => {
        // const div = document.createElement("div")
        // div.innerHTML = e.target.value
        // const text = div.textContent || div.innerText || ""
        setContent(e.target.value)
      }}
      {...inputProps}
    />
  )
}

export default Editable
