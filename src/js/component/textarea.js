import React, { useState, useRef, useEffect, useCallback } from "react"
import { cx, css, block } from "style"
import { insertAtCursor } from "util"
import { useThemeContext } from "feature/theme"
import md5 from "util/md5"
import * as apiFile from "api/file"

const bss = block("textarea")

const TextArea = ({
  className,
  acceptFiles,
  onChange,
  defaultValue,
  color,
  bg,
  ...props
}) => {
  const [focused, setFocused] = useState()
  const [droppingFile, setDroppingFile] = useState()
  const [value, setValue] = useState(defaultValue)
  const el_textarea = useRef()
  const { getColor } = useThemeContext()
  const [size, setSize] = useState([0, 0])

  const replaceFileUrl = useCallback(
    (id, new_url) => {
      if (el_textarea.current) {
        const old_txt = `![${id}](uploading...)`
        const new_txt = `![${id}](${new_url})`
        el_textarea.current.value = el_textarea.current.value.replaceAll(
          old_txt,
          new_txt
        )
        setValue(el_textarea.current.value)
      }
    },
    [el_textarea]
  )

  useEffect(() => {
    if (onChange)
      onChange({
        target: {
          value
        }
      })
  }, [value])

  const onDrop = useCallback(
    e => {
      if (
        e.dataTransfer.files.length > 0 &&
        acceptFiles &&
        el_textarea.current
      ) {
        const files = Array.from(e.dataTransfer.files)
        files.forEach(f => {
          f.text().then(t =>
            insertAtCursor(
              el_textarea.current,
              `![${f.type}-${f.name}](uploading...)\n`
            )
          )
          apiFile
            .upload(f)
            .then(res => replaceFileUrl(`${f.type}-${f.name}`, res.data.url))
            .catch(e =>
              replaceFileUrl(`${f.type}-${f.name}`, "failed to upload")
            )
        })
        setDroppingFile(false)
        e.preventDefault()
      }
    },
    [el_textarea, acceptFiles]
  )

  const onDragOver = e => {
    if (e.dataTransfer.files.lenth > 0 && onDrop) {
      setDroppingFile(true)
      e.preventDefault()
      return false
    }
  }

  useEffect(() => {
    if (droppingFile && el_textarea.current) {
      const rect = el_textarea.current.getBoundingClientRect()
      setSize([rect.width, rect.height])
    }
  }, [droppingFile, el_textarea])

  return (
    <div
      className={cx(bss({ dropping: droppingFile }), className, css({}))}
      onDrop={onDrop}
    >
      {droppingFile && (
        <div
          className={cx(
            bss("drop"),
            css({
              width: size[0],
              height: size[1]
            })
          )}
        >
          Drop file to upload
        </div>
      )}
      <textarea
        ref={el_textarea}
        className={cx(
          bss("textarea"),
          css({
            backgroundColor: getColor(color, bg, -15),
            boxShadow: focused && `0px 0px 3px 1px ${getColor(color, bg)}`,
            ":hover": {
              border: `1px solid ${getColor(color, bg)}`
            },
            "::placeholder": {
              color: getColor(color, color)
            }
          })
        )}
        {...props}
        value={value || ""}
        onChange={e => setValue(e.target.value)}
        onDragOver={acceptFiles && onDragOver}
        onDragEnter={acceptFiles && onDragOver}
        onDragLeave={e => setDroppingFile(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}

export default TextArea
