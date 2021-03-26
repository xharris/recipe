import React, { useEffect, useState } from "react"
import { block, css } from "style"
import { useHistory, Link } from "react-router-dom"
import Page from "."
import Body from "feature/body"
import Text from "component/text"
import Card from "component/card"
import Avatar from "feature/avatar"
import RecipeList from "feature/recipe_list"
import { create, useGetAll } from "api/recipe"

const bss = block("page_home")

const PageHome = () => {
  const [recipes, fetchRecipes] = useGetAll()

  useEffect(() => {
    fetchRecipes()
  }, [])

  return (
    <Page className={bss()}>
      <Body className={bss("body")}>
        <RecipeList data={recipes} />
      </Body>
    </Page>
  )
}

export default PageHome
