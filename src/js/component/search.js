import React, { useState, useEffect, useRef } from "react"
import Input from "component/input"
import Button from "component/button"
import Text from "component/text"
import { useThemeContext } from "feature/theme"
import Icon from "component/icon"

import { cx, block, css, pickFontColor } from "style"

const bss = block("search")

const re_def_trigger = /[\s\w]+(:)/

const Block = ({
  type,
  label,
  icon,
  isPlaintext,
  onChange,
  onDelete,
  onSelect,
  onCancel,
  suggestions
}) => {
  const { getColor } = useThemeContext()
  const el_input = useRef()
  useEffect(() => {
    if (el_input.current) {
      el_input.current.focus()
    }
  }, [el_input])
  return (
    <span
      className={cx(
        bss("block"),
        css({
          backgroundColor: getColor()
        })
      )}
    >
      {icon && (
        <Icon
          className={css({
            marginLeft: 4,
            color: getColor(null, null, 10)
          })}
          icon={icon}
        />
      )}
      <Text
        className={bss("block_label")}
        bg="secondary"
        amt={-10}
        title={type}
        themed
      >{`${icon ? "" : type + ": "}${label ? label : ""}`}</Text>
      {!label && (
        <Input
          ref={el_input}
          size="small"
          onChange={onChange}
          onKeyDown={e => {
            const key = e.key
            if (isPlaintext && key === "Enter") {
              onSelect({
                icon: "FormatQuote",
                label: `"${e.target.value}"`,
                value: e.target.value,
                plaintext: true
              })
            }
            if (key === "Escape") onCancel()
          }}
        />
      )}
      <Button
        icon="Close"
        color="secondary"
        bg="secondary"
        onClick={e => onDelete(e)}
        tabIndex={-1}
      />
      {suggestions && (
        <div className={bss("suggestions")}>
          {suggestions.map(s => (
            <Button
              key={s.value}
              className={bss("suggest")}
              label={s.label}
              onClick={() => onSelect(s)}
              amt={30}
            />
          ))}
        </div>
      )}
    </span>
  )
}

const Search = ({
  active,
  blocks,
  suggestion,
  placeholder,
  className,
  onSearch,
  onChange,
  defaultValue,
  onOpen,
  onClose
}) => {
  const [searching, setSearching] = useState(active)
  const [terms, setTerms] = useState([])
  const [fullTerms, setFullTerms] = useState(defaultValue || [])
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState()
  const [focused, setFocused] = useState()
  const el_input = useRef()

  const clearSearch = () => {
    setValue("")
    setTerms([])
  }

  useEffect(() => {
    searching ? onOpen && onOpen() : onClose && onClose()
  }, [searching])

  useEffect(() => {
    if (onChange) onChange(fullTerms)
  }, [fullTerms])

  return searching || active ? (
    <div className={cx(bss(), css({}), className)}>
      {!active && (
        <Button
          icon="ArrowBack"
          title="Cancel"
          className={css({
            marginLeft: 3
          })}
          onClick={() => clearSearch() || setSearching(false) || onSearch([])}
        />
      )}
      <Input
        ref={el_input}
        className={bss("input")}
        placeholder={placeholder}
        value={value}
        dirty={value.length > 0 || terms.length > 0}
        onChange={e => {
          setValue(e.target.value)
          if (blocks) {
            blocks.forEach(b => {
              const match = e.target.value.match(b || re_def_trigger)
              if (match) {
                const term = match.slice(1).join(".")
                if (!terms.some(t => t === term)) {
                  setTerms([...terms, term])
                  setValue("")
                }
              }
            })
          }
        }}
        onKeyDown={e => {
          const key = e.key
          if (key === "Backspace" && (!value || value.length === 0)) {
            if (terms.length > 0) setTerms(terms.slice(0, -1))
            else if (fullTerms.length > 0) setFullTerms(fullTerms.slice(0, -1))
          }
        }}
        onClear={active && clearSearch}
        submitIcon={!active && "Search"}
        onSubmit={active ? null : () => onSearch(fullTerms)}
      >
        {fullTerms.map(t => (
          <Block
            key={`fullterm-${t.value}`}
            label={t.label}
            icon={t.icon}
            type={t.type}
            onDelete={() =>
              setFullTerms(
                fullTerms.filter(
                  term => !(term.type === t.type && term.value === t.value)
                )
              )
            }
          />
        ))}
        {terms.map((t, i) => (
          <Block
            key={`term-${t}`}
            type={t}
            isPlaintext={!suggestion || !suggestion[t]}
            onCancel={() => {
              setTerms(terms.filter(t2 => t2 !== t))
              if (el_input.current) el_input.current.focus()
            }}
            onSelect={s => {
              s.type = t
              if (
                !fullTerms.some(
                  term => term.type === t && term.value === s.value
                )
              ) {
                setFullTerms([...fullTerms, s])
                setTerms(terms.filter(t2 => t2 !== s.type))

                if (el_input.current) el_input.current.focus()
              }
            }}
            onDelete={() => setTerms(terms.filter((_, i2) => i2 !== i))}
            onChange={e => {
              // TODO: what to do if 't' is uppercase? Ex. user/User
              if (suggestion && suggestion[t]) {
                suggestion[t](setSuggestions, e.target.value)
              } else if (suggestions) {
                setSuggestions()
              }
              setFocused(t)
            }}
            suggestions={focused === t && suggestions}
          />
        ))}
      </Input>
    </div>
  ) : (
    <div className={cx(bss(), className)}>
      <Button icon="Search" title="Search" onClick={() => setSearching(true)} />
      {/*<Text className={bss("text")}>{inactiveText}</Text>*/}
    </div>
  )
}

export default Search
