import React, { useEffect, useState } from "react"
import { block, css } from "style"
import { useHistory, useParams, Link, Route, Redirect } from "react-router-dom"
import Page from "."
import Body from "feature/body"
import RecipeList from "feature/recipe_list"
import Button from "component/button"
import Avatar from "feature/avatar"
import { getUser } from "api/recipe"
import * as apiUser from "api/user"
import * as url from "util/url"

const bss = block("page_profile")

const PageProfile = () => {
  const { username } = useParams()
  const [recipes, setRecipes] = useState()
  const [user, setUser] = useState()
  useEffect(() => {
    if (username) {
      getUser(username).then((res) => setRecipes(res.data.docs))
      apiUser.get(username).then((res) => setUser(res.data.users[0]))
    }
  }, [username])

  return (
    <Page className={bss()}>
      <Body className={bss("body")}>
        <div className={bss("left")}>
          {user && <Avatar user={user} size="large" />}
          {username}
        </div>
        <div className={bss("right")}>
          <div className={bss("subpages")}>
            <Button
              icon="Restaurant"
              label="Recipes"
              to={url.profile_recipes(username)}
            />
            <Button
              icon="Restaurant"
              label="Lists"
              to={url.profile_lists(username)}
            />
          </div>
          <Redirect
            from="/profile/:username"
            to={url.profile_recipes(username)}
            exact
          />
          <Route path="/profile/:username/recipes">
            <RecipeList data={recipes} />
          </Route>
        </div>
      </Body>
    </Page>
  )
}

export default PageProfile
