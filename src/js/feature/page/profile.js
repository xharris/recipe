import React, { useEffect, useState, useCallback } from "react"
import { block, css } from "style"
import {
  useRouteMatch,
  useParams,
  useLocation,
  Link,
  Route,
  Redirect,
} from "react-router-dom"
import Page from "."
import Body from "feature/body"
import RecipeList from "feature/recipe_list"
import Button from "component/button"
import Avatar from "feature/avatar"
import ListView from "feature/list_view"
import Text from "component/text"
import { getUser } from "api/recipe"
import { useAuthContext } from "component/auth"
import * as apiUser from "api/user"
import apiList from "api/list"
import * as url from "util/url"
import { useQuery } from "util"

const bss = block("page_profile")

const PageProfile = () => {
  const { username } = useParams()
  const [recipes, setRecipes] = useState()
  const [user, setUser] = useState()
  const { user: authUser } = useAuthContext()
  const [lists, fetchLists] = apiList.useRoute("get_user")
  const [list, setList] = useState()
  const m_lists = useRouteMatch(url.profile_lists())
  const location = useLocation()
  const { params, removeParam } = useQuery()

  useEffect(() => {
    if (username) {
      getUser(username).then((res) => setRecipes(res.data.docs))
      apiUser.get(username).then((res) => setUser(res.data.users[0]))
    }
  }, [username])

  useEffect(() => {
    if (m_lists && user) {
      fetchLists(user._id)
    }
  }, [location, user])

  useEffect(() => {
    if (params) {
      if (params.get("list")) setList(params.get("list"))
      else setList()
    }
  }, [params])

  return (
    <Page className={bss()}>
      <Body className={bss("body")}>
        <div className={bss("left")}>
          {user && <Avatar user={user} size="large" />}
          <Text className={bss("username")}>{username}</Text>
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
          <Route
            exact
            path={url.profile()}
            render={({ match }) => (
              <Redirect to={url.profile_recipes(match.params.username)} />
            )}
          />
          <Route path={url.profile_recipes()}>
            <RecipeList data={recipes} hideDisplayName />
          </Route>
          <Route path={url.profile_lists()}>
            {list ? (
              <ListView id={list} onBack={() => removeParam("list")} />
            ) : (
              [
                lists && lists.length > 0 && (
                  <div key="lists" className={bss("lists")}>
                    {lists.map((list) => (
                      <Button
                        key={list._id}
                        className={bss("list")}
                        label={list.name}
                        to={url.view_list(list._id)}
                        outlined
                      />
                    ))}
                  </div>
                ),
                authUser && user && authUser._id === user._id && (
                  <Button
                    key="add"
                    icon="Add"
                    label="Add list"
                    onClick={() =>
                      apiList.create().then(() => fetchLists(user._id))
                    }
                  />
                ),
              ]
            )}
          </Route>
          <Route path={url.profile()}></Route>
        </div>
      </Body>
    </Page>
  )
}

export default PageProfile
