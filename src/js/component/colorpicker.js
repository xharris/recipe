import React, { useState, useEffect, useRef } from "react"
import { GithubPicker, CompactPicker } from "react-color"
import Text from "component/text"
import Tooltip from "@material-ui/core/Tooltip"

import { block, css, cx, pickFontColor } from "style"
const bss = block("colorpicker")

const ColorPicker = ({
  defaultValue,
  name,
  onChange,
  title,
  className,
  label
}) => {
  const [color, setColor] = useState(defaultValue)
  const [show, setShow] = useState()
  const [position, setPosition] = useState()
  const ref_wrapper = useRef()
  const ref_picker = useRef()

  const clickOut = e =>
    ref_wrapper.current && ref_wrapper.current.contains(e.target)
      ? null
      : setShow(false)

  useEffect(() => {
    document.addEventListener("mousedown", clickOut)
    return () => document.removeEventListener("mousedown", clickOut)
  }, [])

  useEffect(() => {
    if (ref_wrapper.current && ref_picker.current) {
      var x = ref_wrapper.current.getBoundingClientRect().left
      var y = ref_wrapper.current.getBoundingClientRect().bottom
      var picker_w = ref_picker.current.getBoundingClientRect().width
      var picker_h = ref_picker.current.getBoundingClientRect().height
      var win_w = window.innerWidth
      var win_h = window.innerHeight
      var scroll_y = window.pageYOffset

      if (x + picker_w > win_w) x += win_w - (x + picker_w)
      if (y + picker_h > win_h) y += win_h - (y + picker_h)
      setPosition([x, y])
    }
  }, [show, ref_wrapper, ref_picker])

  return (
    <div className={cx(bss(), className)} ref={ref_wrapper}>
      {label && <Text className={bss("label")}>{label}</Text>}
      <Tooltip
        key="tooltip"
        title={title || "Choose a color"}
        disableFocusListener={!title}
        disableHoverListener={!title}
        disableTouchListener={!title}
        placement="top"
      >
        <button
          className={cx(
            bss("trigger"),
            css`
              background-color: ${color} !important;
              border: 1px solid ${pickFontColor(color)};
              box-shadow: 0px 0px 1px ${pickFontColor(color)};
            `
          )}
          onClick={() => setShow(!show)}
        />
      </Tooltip>
      {show && (
        <div
          ref={ref_picker}
          className={cx(
            bss("picker"),
            css({
              position: "fixed !important",
              top: position ? position[1] : -10000000,
              left: position ? position[0] : -10000000
            })
          )}
        >
          <CompactPicker
            name={name}
            color={color}
            colors={[
              // red
              "#ffcdd2",
              "#ef9a9a",
              "#e57373",
              // purple
              "#E1BEE7",
              "#CE93D8",
              "#BA68C8",
              // blue
              "#BBDEFB",
              "#90CAF9",
              "#64B5F6",
              // green
              "#C8E6C9",
              "#A5D6A7",
              "#81C784",
              // yellow
              "#FFF9C4",
              "#FFF59D",
              "#FFF176",
              // orange
              "#FFE0B2",
              "#FFCC80",
              "#FFB74D",
              // brown
              "#D7CCC8",
              "#BCAAA4",
              "#A1887F",
              // gray
              "#E0E0E0",
              "#BDBDBD",
              "#9E9E9E"
            ]}
            onChangeComplete={e => {
              setColor(e.hex)
              onChange({ target: { name, value: e.hex } })
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ColorPicker
