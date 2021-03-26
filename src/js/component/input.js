import React, { useState, useRef, forwardRef, useCallback } from "react"
import Tooltip from "@material-ui/core/Tooltip"
import Button from "component/button"
import { useCombinedRef } from "util"
import { useThemeContext } from "feature/theme"
import { cx, css, block, lightenDarken } from "style"

const bss = block("input")

const Input = forwardRef(
  (
    {
      className,
      color,
      bg,
      tooltip,
      outlined,
      children,
      showinput,
      disabled,
      size,
      onClear,
      onSubmit,
      submitIcon,
      dirty,
      width,
      noWrap,
      ...props
    },
    ref
  ) => {
    const { theme, getColor } = useThemeContext()
    const el_input = useRef()
    const comboref = useCombinedRef(ref, el_input)
    const [focused, setFocused] = useState()

    const submit = useCallback(
      e => {
        if (comboref && comboref.current && onSubmit)
          onSubmit(comboref.current.value)
        e.stopPropagation()
        return e.preventDefault()
      },
      [comboref, onSubmit]
    )

    return (
      <Tooltip
        title={tooltip || ""}
        disableFocusListener={!tooltip}
        disableHoverListener={!tooltip}
        disableTouchListener={!tooltip}
        placement="top"
        className={cx(bss(), className)}
      >
        <div
          className={cx(
            bss("container", { focused }),
            css({
              backgroundColor: getColor(color, bg, -15),
              minHeight: size === "small" ? 21 : 32,
              ":hover, :focus": !disabled && {
                border: `1px solid ${getColor(color, bg)}`
              },
              boxShadow:
                !disabled &&
                focused &&
                `0px 0px 3px 1px ${getColor(color, bg)}`,
              border:
                (outlined || focused) &&
                !disabled &&
                `1px solid ${getColor(color, bg)}`,
              width: width,
              flexWrap:
                children && children.length > 0 && !noWrap ? "wrap" : "nowrap"
            })
          )}
          onClick={e => {
            // console.log("here")
            if (
              comboref &&
              comboref.current &&
              e.currentTarget === comboref.current
            ) {
              comboref.current.focus()
            }
            return e.preventDefault()
          }}
        >
          {children}
          {showinput !== false && (
            <input
              ref={comboref}
              className={cx(
                bss("input"),
                css({
                  "::placeholder": {
                    color: getColor(color, color)
                  },
                  flexBasis: width,
                  height: size === "small" ? 13 : 24
                })
              )}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => onSubmit && e.key === "Enter" && submit(e)}
              disabled={disabled}
              {...props}
            />
          )}
          {onClear && (dirty == null || dirty === true) && (
            <Button
              icon="Close"
              title="clear"
              className={css({
                marginLeft: 3,
                cursor: "pointer"
              })}
              onClick={onClear}
              tabIndex={2}
            />
          )}
          {onSubmit && (
            <Button
              icon={submitIcon}
              title="submit"
              className={css({
                marginLeft: 3,
                cursor: "pointer"
              })}
              onClick={submit}
              tabIndex={2}
            />
          )}
        </div>
      </Tooltip>
    )
  }
)

export default Input
