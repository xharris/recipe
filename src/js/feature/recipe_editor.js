import React, { useEffect, useState, useCallback } from "react"
import { useHistory } from "react-router-dom"
import { block, css } from "style"
import Body from "feature/body"
import Editable from "component/editable"
import Button from "component/button"
import Text from "component/text"
import { Editor, EditorState, convertToRaw, ContentState } from "draft-js"
import "draft-js/dist/Draft.css"
import { create, commit, useGet } from "api/recipe"
import { view_recipe } from "util/url"

const bss = block("recipe_editor")

const RecipeEditor = ({ id }) => {
  const [text, setText] = useState()
  const [error, setError] = useState()
  const [editor, setEditor] = useState(() => EditorState.createEmpty())
  const [focused, setFocused] = useState()
  const history = useHistory()
  const [recipe, fetchRecipe] = useGet()

  const getValue = useCallback(
    () =>
      convertToRaw(editor.getCurrentContent())
        .blocks.map((block) => block.text || "")
        .join("\n"),
    [editor]
  )

  const setValue = useCallback(
    (v) => setEditor(EditorState.push(editor, ContentState.createFromText(v))),
    []
  )

  useEffect(() => {
    if (recipe) setValue(recipe.text)
  }, [recipe])

  useEffect(() => {
    let call
    if (id) call = fetchRecipe(id)
    return () => {
      if (call) call.cancel()
    }
  }, [id])

  return (
    <div className={bss({ focused })}>
      <Editor
        className={bss("editor")}
        editorState={editor}
        onChange={setEditor}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <Text>{error}</Text>}
      <Button
        className={bss("save")}
        label={id ? "Save" : "Add"}
        onClick={() => {
          setError()
          if (id) {
            commit(id, getValue()).catch((e) => setError(e.response.data))
          } else {
            create({ text: getValue() })
              .then((res) => history.push(view_recipe(res.data.doc._id)))
              .catch((e) => setError(e.response.data))
          }
        }}
      />
    </div>
  )
}

export default RecipeEditor
