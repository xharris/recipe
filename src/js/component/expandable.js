import React, { useRef, useState, useEffect } from "react"

import { css, cx, block } from "style"

const bss = block("expandable")

const Expandable = ({ expanded, className, children, ...props }) => {
  const [useAuto, setUseAuto] = useState()
  const [height, setHeight] = useState("auto")
  const [ready, setReady] = useState(false)
  const el_expandable = useRef()

  useEffect(() => {
    const transitionEnd = () => {
      if (ready && el_expandable.current) {
        setUseAuto(expanded)
      }
    }

    if ((!ready || expanded) && el_expandable.current) {
      setHeight(el_expandable.current.offsetHeight)
      setReady(true)
    }

    if (ready)
      el_expandable.current.addEventListener("transitionend", transitionEnd)
    return () => {
      el_expandable.current.removeEventListener("transitionend", transitionEnd)
    }
  }, [el_expandable, ready, expanded])

  useEffect(() => {
    //console.log(useAuto, expanded)
  }, [useAuto, expanded])

  return (
    <div
      className={cx(
        bss({ expanded }),
        className,
        ready
          ? css({
              maxHeight: useAuto && expanded ? "100%" : expanded ? height : 0,
              margin: !expanded && 0,
              padding: !expanded && 0
              // transition: "ease-in-out all 0.2s"
            })
          : css({
              opacity: 0,
              position: "fixed"
            })
      )}
      ref={el_expandable}
      {...props}
    >
      {children}
    </div>
  )
}

export default Expandable
