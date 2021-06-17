import React, { useEffect, useState, useCallback, useRef } from "react"
import { useHistory } from "react-router-dom"
import { bem, css } from "style"
import Body from "feature/body"
import Editable from "component/editable"
import Button from "component/button"
import Text from "component/text"
import { useSnackbar } from "notistack"
import apiRecipe from "api/recipe"
import { view_recipe } from "util/url"

import Quill from "quill"

const bss = bem("recipe_editor")

const RecipeEditor = ({ id }) => {
  const { create, commit } = apiRecipe
  const [recipe, fetchRecipe] = apiRecipe.useRoute("get")

  const [text, setText] = useState()
  const [error, setError] = useState()
  const [editor, setEditor] = useState()
  const [focused, setFocused] = useState()
  const history = useHistory()
  const ref_editor = useRef()
  const { enqueueSnackbar } = useSnackbar()

  const handleImage = useCallback(
    (...args) => {
      console.log(ref_editor, args)
    },
    [ref_editor]
  )

  useEffect(() => {
    if (ref_editor.current)
      setEditor(
        new Quill(ref_editor.current, {
          modules: {
            toolbar: [["bold", "italic", "underline"]],
          },
          handlers: {
            image: handleImage,
          },
          theme: "snow",
        })
      )
  }, [ref_editor])

  const getValue = useCallback(() => editor && editor.getText(), [editor])

  const setValue = useCallback((v) => editor && editor.setText(v), [editor])

  useEffect(() => {
    if (recipe) setValue(recipe.text)
  }, [recipe])

  useEffect(() => {
    if (id) fetchRecipe(id)
  }, [id])

  return (
    <div className={bss({ focused })}>
      <div className={bss("editor")} ref={ref_editor} />
      {error && <Text>{error}</Text>}
      <Button
        className={bss("save")}
        label={id ? "Save" : "Add"}
        onClick={() => {
          setError()
          if (id) {
            console.log(getValue())
            // commit(id, getValue())
            //   .then(() => enqueueSnackbar("Saved!"))
            //   .catch((e) => setError(e.response.data))
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
