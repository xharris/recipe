import React, { useEffect } from "react"
import { css, cx } from "emotion"

import { block } from "style"

const bss = block("tags")

const Tags = ({ tags, size }) => (
  <div className={bss({ size: size || "regular" })}>
    {tags.map(t => (
      <div
        className={cx(
          bss("tag"),
          css`
            background-color: ${t.color};
          `
        )}
        key={t.value}
      >
        {t.value}
      </div>
    ))}
  </div>
)

export default Tags
