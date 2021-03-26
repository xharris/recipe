import React, { useState, forwardRef } from "react"
import { Link, useRouteMatch } from "react-router-dom"
import Popover from "@material-ui/core/Popover"
import { useThemeContext } from "feature/theme"
import Tooltip from "@material-ui/core/Tooltip"
import Text from "component/text"
import Icon from "component/icon"

import { block, cx, css, pickFontColor, lightenDarken } from "style"

const bss = block("button")
const Button = forwardRef(
  (
    {
      icon,
      iconPlacement,
      to,
      onClick,
      className,
      rounded,
      popover,
      label,
      outlined: _outlined,
      type = "button",
      link,
      underline,
      thickness = 1,
      title,
      size,
      disabled,
      // lightness =
      bg = "secondary", // the background of the element the button will appear in (not the button's background color)
      color = "primary",
      amt = 20,
      ...props
    },
    ref
  ) => {
    const { getColor } = useThemeContext()
    const [anchor, setAnchor] = useState()
    const match = useRouteMatch(to)
    const outlined = _outlined || match
    const Content = () => (
      <>
        {icon && iconPlacement !== "right" && <Icon icon={icon} />}
        {label != null && (
          <Text className={bss("label")} themed>
            {label}
          </Text>
        )}
        {icon && iconPlacement === "right" && <Icon icon={icon} />}
      </>
    )

    const style = css({
      borderWidth: type !== "link" ? thickness : 0,
      borderColor: outlined ? getColor(color, bg, amt) : "transparent",
      textDecoration:
        (type === "link" || underline) &&
        !disabled &&
        `underline ${getColor(bg, color, amt)}`,
      "& > *": {
        color:
          type === "link" ? getColor(bg, color, amt) : getColor(color, bg, amt),
      },
      "&:hover": {
        backgroundColor: type !== "link" && getColor(color, bg, amt),
      },
      "&:hover > *": type !== "link" && {
        borderColor: getColor(color, bg, amt),
        color: getColor(color, bg, -amt),
        textDecoration:
          underline && !disabled && `underline ${getColor(color, color, -amt)}`,
      },
    })

    return to ? (
      <Tooltip
        key="tooltip"
        title={title || ""}
        disableFocusListener={!title}
        disableHoverListener={!title}
        disableTouchListener={!title}
        placement="top"
      >
        <Link
          className={cx(bss({ type, size }), style, className)}
          ref={ref}
          to={to}
          disabled={disabled}
          {...props}
        >
          <Content />
        </Link>
      </Tooltip>
    ) : (
      [
        <Tooltip
          key="tooltip"
          title={title || ""}
          disableFocusListener={!title}
          disableHoverListener={!title}
          disableTouchListener={!title}
          placement="top"
        >
          <button
            ref={ref}
            key="button"
            className={cx(bss({ type, rounded, outlined }), style, className)}
            onClick={(e) => {
              onClick && onClick(e)
              popover && setAnchor(e.currentTarget)
            }}
            type={type || "button"}
            disabled={disabled}
            {...props}
          >
            <Content />
          </button>
        </Tooltip>,
        <Popover
          key="popover"
          className={cx(bss("popover"), className)}
          open={anchor != null}
          anchorEl={anchor}
          onClose={() => setAnchor(null)}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
        >
          {popover && popover({ onClose: () => setAnchor(null) })}
        </Popover>,
      ]
    )
  }
)

export default Button
