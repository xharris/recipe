import * as emotion from "emotion"
import { TinyColor } from "@ctrl/tinycolor"

export const css = emotion.css
export const cx = emotion.cx

export const block = mainName => (...args) => {
  const states = {}
  args.forEach(
    e =>
      typeof e === "object" &&
      Object.entries(e).forEach(
        ([k, v]) => k !== "undefined" && (states[k] = v)
      )
  )
  const classes = args.filter(e => ["string", "boolean"].includes(typeof e))

  const ret_class = [
    classes.map(c => `${mainName}--${c}`),
    Object.entries(states)
      .map(
        ([k, v]) =>
          v &&
          `${mainName}--${k}${
            v !== true && typeof v !== "function" ? `-${v}` : ""
          }`
      )
      .filter(cls => cls) // remove nulls
      .join(" ")
  ]

  return emotion.cx(classes.length === 0 && mainName, ...ret_class)
}

export const pickFontColor = (bg, fg_color, amt) => {
  amt = amt || 30
  if (!bg) return "#ffffff"
  var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bg)
  const rgb = {
    r: parseInt(match[1], 16) ** 2,
    g: parseInt(match[2], 16) ** 2,
    b: parseInt(match[3], 16) ** 2
  }
  const brightness = Math.sqrt(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b)
  if (fg_color)
    return lightenDarken(fg_color, (brightness > 130 ? -1 : 1) * amt)
  return brightness > 130 ? "#212121" : "#F5F5F5"
}

// ex: ligthen 20, darken -20
// prettier-ignore
export const lightenDarken = (c, amt) => amt >= 0 ? new TinyColor(c).brighten(amt).toString() : new TinyColor(c).darken(Math.abs(amt)).toString()

export const hex2rgb = (hex, a) => {
  let r = 0,
    g = 0,
    b = 0
  // handling 3 digit hex
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1]
    g = "0x" + hex[2] + hex[2]
    b = "0x" + hex[3] + hex[3]
    // handling 6 digit hex
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2]
    g = "0x" + hex[3] + hex[4]
    b = "0x" + hex[5] + hex[6]
  }

  return [+r, +g, +b, a || 1]
}
