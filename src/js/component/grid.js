import React, { useEffect, useRef } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import StackGrid from "react-stack-grid"
import { cx, css, block } from "style"

const bss = block("grid")

const columnsCountBreakPoints = { 350: 1, 750: 2, 900: 3 }

const Grid = ({ className, children, ...props }) => {
  const ref_grid = useRef()

  useEffect(() => {
    let interval
    if (!interval)
      setInterval(() => {
        if (ref_grid.current) ref_grid.current.updateLayout()
      }, 1000)
    return () => {
      if (interval) {
        clearInterval()
        interval = null
      }
    }
  }, [])

  return (
    <StackGrid
      className={cx(bss(), className)}
      columnWidth={300}
      gridRef={grid => (ref_grid.current = grid)}
    >
      {children}
    </StackGrid>
  )
  /*return (
    <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
      <Masonry className={cx(bss(), className)} {...props}>
        {children}
      </Masonry>
    </ResponsiveMasonry>
  )*/
}

export default Grid
