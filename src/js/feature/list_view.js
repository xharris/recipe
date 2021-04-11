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
import Text from "component/text"
import Button from "component/button"
import Input from "component/input"
import RecipeList from "feature/recipe_list"
import { useAuthContext } from "component/auth"
import apiList from "api/list"

const bss = block("list_view")

const ListView = ({ id, onBack }) => {
  const { user } = useAuthContext()
  const [list, fetchList] = apiList.useRoute("get")
  const [name, setName] = useState()
  const can_edit = user && list && list.user._id === user._id

  useEffect(() => {
    if (id) fetchList(id)
  }, [id])

  return !list ? null : (
    <div className={bss()}>
      <div className={bss("left")}>
        {onBack && <Button icon="ArrowBack" onClick={onBack} />}
      </div>
      <div className={bss("right")}>
        <div className={bss("header")}>
          <div className={bss("header_left")}>
            {can_edit ? (
              <Input
                defaultValue={list.name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <Text>{list.name}</Text>
            )}
            {name && name !== list.name && (
              <Button
                label="Save"
                onClick={() => apiList.update(list._id, { name })}
              />
            )}
          </div>
          {can_edit && (
            <div className={bss("header_right")}>
              <Button icon="Delete" />
            </div>
          )}
        </div>
        {list.recipes.length > 0 ? (
          <RecipeList
            data={list.recipes}
            onRemove={
              can_edit &&
              ((recipe_id) =>
                console.log("remove", recipe_id) ||
                apiList
                  .update(list._id, {
                    recipes: list.recipes.filter((r) => r._id !== recipe_id),
                  })
                  .then((doc) => fetchList(doc._id)))
            }
          />
        ) : (
          <Text className={bss("no_recipes")}>{"No recipes yet"}</Text>
        )}
      </div>
    </div>
  )
}

export default ListView
