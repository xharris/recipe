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
import RecipeEditor from "feature/recipe_editor"
import diff from "diff"
import { commit, useGet, del, fork } from "api/recipe"
import { profile, view_recipe, edit_recipe, recipe_history } from "util/url"
import apiList from "api/list"
import * as url from "util/url"

const bss = block("page_recipe_view")

const PageRecipeEdit = () => {
  const params = useParams()
  const { user } = useAuthContext()
  const [recipe, fetchRecipe] = useGet()
  const router_history = useHistory()
  const editing = useRouteMatch(url.edit_recipe())
  const history = useRouteMatch(url.recipe_history())
  const [userLists, fetchUserLists] = apiList.useRoute("get_user")

  useEffect(() => {
    if (user) fetchUserLists(user._id)
  }, [user])

  useEffect(() => {
    let call
    if (params) call = fetchRecipe(params.id)
    return () => {
      if (call) call.cancel()
    }
  }, [params])

  const EditView = () => <RecipeEditor id={params.id} />

  const TextView = () => <Markdown content={recipe.text} />

  const HistoryView = () =>
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

  return (
    <Page className={bss()} title={recipe && recipe.title}>
      {recipe && (
        <Body className={bss("body")}>
          <div className={bss("recipe_header")}>
            <div className={bss("path")}>
              <div className={bss("row")}>
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
              </div>
              {recipe.forked_from && (
                <div className={bss("row", { fork: true })}>
                  <Text>{"Forked from"}</Text>
                  <Button
                    label={`${recipe.forked_from.user.display_name}`}
                    type="link"
                    to={view_recipe(recipe.forked_from._id)}
                  />
                </div>
              )}
            </div>
            {!editing && (
              <div className={bss("recipe_header_right")}>
                {user && recipe.user._id !== user._id && (
                  <Button
                    icon="Restaurant"
                    onClick={() => {
                      if (window.confirm(`Fork "${recipe.title}"?`))
                        fork(recipe._id).then((res) => {
                          console.log(res.data.doc._id)
                          fetchRecipe(res.data.doc._id)
                        })
                    }}
                    label="Fork"
                  />
                )}
                {userLists && (
                  <MenuButton
                    icon="Add"
                    label="Add to list"
                    items={userLists.map((list) => ({
                      key: list._id,
                      icon: list.recipes.includes(recipe._id)
                        ? "CheckBox"
                        : "CheckBoxOutlineBlank",
                      label: list.name,
                      onClick: () =>
                        apiList
                          .update(list._id, {
                            recipes: list.recipes.includes(recipe._id)
                              ? // deselect
                                list.recipes.filter((r) => r !== recipe._id)
                              : // select
                                [...list.recipes, recipe._id],
                          })
                          .then(() => fetchUserLists(user._id)),
                    }))}
                  />
                )}
                <Button
                  icon="History"
                  to={recipe_history(recipe._id)}
                  outlined={history}
                  backTo={view_recipe(recipe._id)}
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
          {history ? <HistoryView /> : editing ? <EditView /> : <TextView />}
          {editing && (
            <Button
              className={css({ alignSelf: "flex-start" })}
              to={view_recipe(recipe._id)}
              label="Done"
            />
          )}
        </Body>
      )}
    </Page>
  )
}

export default PageRecipeEdit
