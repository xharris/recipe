import React, { useEffect, useState, useCallback } from "react"
import { useHistory } from "react-router-dom"
import { block, css } from "style"
import Body from "feature/body"
import Editable from "component/editable"
import Button from "component/button"
import Text from "component/text"
import { Editor, EditorState, convertToRaw } from "draft-js"
import "draft-js/dist/Draft.css"
import { create } from "api/recipe"
import { view_recipe } from "util/url"

const bss = block("recipe_editor")

const RecipeEditor = ({ id }) => {
  const [text, setText] = useState()
  const [error, setError] = useState()
  const [editor, setEditor] = useState(() => EditorState.createEmpty())
  const history = useHistory()

  const getValue = useCallback(
    () =>
      convertToRaw(editor.getCurrentContent())
        .blocks.map((block) => block.text || "")
        .join("\n"),
    [editor]
  )

  return (
    <div className={bss()}>
      <Editor
        className={bss("editor")}
        editorState={editor}
        onChange={setEditor}
      />
      {error && <Text>{error}</Text>}
      <Button
        label="Add"
        onClick={() => {
          console.log("here")
          setError()
          if (id) {
          } else {
            console.log("ok go")
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
