import React, { useEffect, useState, useRef } from "react"
import { Player, BigPlayButton } from "video-react"
import { block, cx } from "style"
import * as apiFile from "api/file"

const bss = block("video")

const Video = ({ source, type, className, preview }) => {
  return (
    <video
      controls={!preview}
      className={cx(bss({ preview: !!preview }), className)}
    >
      {source && <source src={source} />}
    </video>
  )
}

export default Video
