import React, { useEffect, useState } from "react"
import { block, css } from "style"
import { useHistory, useParams } from "react-router-dom"
import Page from "."
import Body from "feature/body"
import Button from "component/button"
import Text from "component/text"
import Card from "component/card"
import Avatar from "feature/avatar"
import Editable from "component/editable"
import { commit, useGet } from "api/recipe"
import { profile } from "util/url"

const bss = block("page_recipe_edit")

const PageRecipeEdit = () => {
  const params = useParams()
  const [recipe, fetchRecipe] = useGet()
  const [text, setText] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    if (params) fetchRecipe(params.id)
  }, [params])

  return (
    <Page className={bss()}>
      {recipe && (
        <Body className={bss("body")}>
          <div className={bss("path")}>
            <Button
              label={recipe.user.display_name}
              type="link"
              to={profile(recipe.user.display_name)}
            />
            <Text>{"/"}</Text>
            <Text>{recipe.title}</Text>
            {/*<Button label={recipe.title} type="link" to={/> */}
          </div>
          <Editable defaultValue={recipe.text} onChange={setText} multiline />
          {error && <Text className={bss("error")}>{error}</Text>}
          <Button
            label="Update"
            disabled={!text}
            onClick={() =>
              commit(recipe._id, text)
                .then(() => alert("saved!"))
                .catch((err) => {
                  console.log(err)
                })
            }
          />
        </Body>
      )}
    </Page>
  )
}

export default PageRecipeEdit
