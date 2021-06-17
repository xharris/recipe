import React, { useEffect, useState } from "react"
import { block, css } from "style"
import Page from "."
import Body from "feature/body"
import Editable from "component/editable"
import Button from "component/button"
import Text from "component/text"
import RecipeEditor from "feature/recipe_editor"
import { Editor, EditorState } from "draft-js"
import "draft-js/dist/Draft.css"
import apiRecipe from "api/recipe"

const bss = block("page_recipe_add")

const PageRecipeAdd = () => {
  const { create } = apiRecipe
  const [text, setText] = useState()
  const [error, setError] = useState()
  const [editor, setEditor] = useState(() => EditorState.createEmpty())

  useEffect(() => {
    console.log(editor)
  }, [editor])

  return (
    <Page className={bss()}>
      <Body className={bss("body")}>
        <RecipeEditor />
      </Body>
    </Page>
  )
}

export default PageRecipeAdd
