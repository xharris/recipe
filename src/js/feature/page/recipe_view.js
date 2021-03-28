import React, { useEffect, useState } from "react"
import { block, css } from "style"
import { useHistory, useParams, useRouteMatch } from "react-router-dom"
import Page from "."
import Body from "feature/body"
import Button from "component/button"
import Text from "component/text"
import Card from "component/card"
import Markdown from "component/markdown"
import Avatar from "feature/avatar"
import Editable from "component/editable"
import MenuButton from "component/menubutton"
import { useAuthContext } from "component/auth"
import diff from "diff"
import { commit, useGet, del } from "api/recipe"
import { profile, view_recipe, edit_recipe, recipe_history } from "util/url"

const bss = block("page_recipe_view")

const PageRecipeEdit = () => {
  const params = useParams()
  const { user } = useAuthContext()
  const [recipe, fetchRecipe] = useGet()
  const [text, setText] = useState()
  const [error, setError] = useState()
  const [message, setMessage] = useState()
  const router_history = useHistory()
  const editing = useRouteMatch("/recipe/:id/edit")
  const history = useRouteMatch("/recipe/:id/history/:page?")

  useEffect(() => {
    let call
    if (params) call = fetchRecipe(params.id)
    return () => {
      if (call) call.cancel()
    }
  }, [params])

  return (
    <Page className={bss()}>
      {recipe && (
        <Body className={bss("body")}>
          <div className={bss("recipe_header")}>
            <div className={bss("path")}>
              <Button
                label={recipe.user.display_name}
                type="link"
                to={profile(recipe.user.username)}
              />
              <Text>{"/"}</Text>
              <Button
                label={recipe.title}
                type="link"
                to={view_recipe(recipe._id)}
              />
              {/*<Button label={recipe.title} type="link" to={/> */}
            </div>
            {!editing && (
              <div className={bss("recipe_header_right")}>
                <Button icon="Restaurant" onClick={() => {}} label="Fork" />
                <MenuButton
                  icon="Add"
                  label="Add to list"
                  items={[{ icon: "CheckBoxOutlineBlank", label: "Favorites" }]}
                />
                <Button
                  icon="History"
                  to={recipe_history(recipe._id)}
                  outlined={history}
                />
                <Button
                  icon="Delete"
                  onClick={() => {
                    const name = window.prompt(
                      `Are you sure you want to delete? Type "${recipe.title}" to confirm:`
                    )
                    if (name === recipe.title)
                      del(recipe._id)
                        .then(() =>
                          router_history.push(profile(recipe.user.username))
                        )
                        .catch(console.error)
                  }}
                />
                {user && user._id === recipe.user._id && (
                  <Button
                    icon="Edit"
                    to={edit_recipe(recipe._id)}
                    label="Edit"
                  />
                )}
              </div>
            )}
          </div>
          {!history ? (
            <>
              <Editable
                defaultValue={recipe.text}
                onChange={setText}
                multiline
                disabled={!editing}
              />
              {(error || message) && editing && (
                <Text className={bss(error && !message ? "error" : "message")}>
                  {error || message}
                </Text>
              )}
            </>
          ) : (
            recipe.history.map((h) => {
              const date = new Date(h.date_created)
              return (
                <div key={h._id} className={bss("change")}>
                  <div className={bss("change_header")}>
                    <Text>{h.message}</Text>
                    <Text>{`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</Text>
                  </div>
                  <div className={bss("change_diff")}>
                    <Text>{h.patch_readable}</Text>
                  </div>
                </div>
              )
            })
          )}
          {editing && (
            <>
              <Button
                label="Save"
                disabled={!text}
                onClick={() =>
                  commit(recipe._id, text)
                    .then((res) => {
                      setMessage(res.data.message)
                      setError()
                    })
                    .catch((err) => {
                      setError(err.response.data)
                      setMessage()
                    })
                }
              />
            </>
          )}
        </Body>
      )}
    </Page>
  )
}

export default PageRecipeEdit
