import React, { useState } from "react"
import { DragDrop } from "component/dragdrop"

import { block, cx, css } from "style"

const bss = block("dndlist")

export const DropLine = ({ width, height, accept, onDrop }) => (
  <DragDrop
    className={cx(
      bss("line"),
      css({
        width,
        height
      })
    )}
    accept={accept}
    onDrop={onDrop}
  />
)

export const DndList = ({ type, onListChange, children }) => {
  const [dropDestId, setDropDestId] = useState()
  const [dropLocation, setDropLocation] = useState()
  const [dropWidth, setDropWidth] = useState(0)

  const resetState = () => {
    setDropLocation()
    setDropDestId()
    setDropWidth(0)
  }

  const onDrop = (child, data) => {
    const items = children
      .map(child => child.props.id)
      .filter(id => id !== data.id)
    const dest_idx =
      items.indexOf(child.props.id) + (dropLocation === "before" ? 0 : 1)

    onListChange([
      ...items.slice(0, dest_idx),
      data.id,
      ...items.slice(dest_idx)
    ])
    resetState()
    return true
  }

  return children.map(child => [
    dropLocation === "before" && dropDestId === child.props.id && (
      <DropLine
        key="before"
        accept={type}
        width={dropWidth}
        height={dropLocation === "before" ? 30 : 0}
        onDrop={data => onDrop(child, data)}
      />
    ),
    <DragDrop
      {...child.props}
      key={child.props.id}
      info={{ id: child.props.id, type }}
      accept={type}
      dropOutline={false}
      draggable
      onDrop={data => onDrop(child, data)}
      onDragEnter={({ id }, e) => {
        const y = e.clientY
        const rect = e.currentTarget && e.currentTarget.getBoundingClientRect()
        if (rect) {
          setDropLocation(y <= rect.top + rect.height / 2 ? "before" : "after")
          setDropDestId(id)
          setDropWidth(rect.width)
        }
      }}
      onDragEnd={resetState}
    />,
    dropLocation === "after" && dropDestId === child.props.id && (
      <DropLine
        key="after"
        accept={type}
        width={dropWidth}
        height={dropLocation === "after" ? 30 : 0}
        onDrop={data => onDrop(child, data)}
      />
    )
  ])
}
