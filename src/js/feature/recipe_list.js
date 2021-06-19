import React, { useEffect, useState } from "react"
import { bem, css, cx } from "style"
import { useHistory, Link } from "react-router-dom"
import Button from "component/button"
import Search from "component/search"
import MenuButton from "component/menubutton"
import { view_recipe } from "util/url"
import apiRecipe from "api/recipe"

const bss = bem("recipe_list")

const RecipeList = ({ data, hideDisplayName, onRemove }) => {
  const history = useHistory()
  const [searching, setSearching] = useState()
  const [sort, setSort] = useState("popular")

  const formatTime = (min, max) => {
    const formats = ["sec", "min", "hr", "d"]
    const amounts = [60, 60, 24]
    const getFormat = (num) => {
      let index = 0
      do {
        num /= amounts[index]
        index += 1
      } while (index < amounts.length && num > amounts[index])
      return [num, formats[index]]
    }

    const [min2, format1] = getFormat(min)
    const [max2, format2] = getFormat(max)

    if (min2 === max2) return `${min2} ${format1}`
    if (format1 === format2) return `${min2} - ${max2} ${format1}`
    else return `${min2} ${format1} - ${max2} - ${format2}`
  }

  return (
    <div className={bss()}>
      <div className={bss("header")}>
        <Search 
          className={bss("search")}
          blocks={[
            { name:"text", example:"text", icon:"FormatQuote", suggest: value => [`"${value}"`] },
            { name:"ingredient", example:"ingredient", icon:"BubbleChart", suggest: value => {
              // get list of similar ingredients from db
              // api.searchIngredient(value).then(docs => docs.map(d => d.value.join(' ')))
              return [value, `super ${value}`]
            } },
            { name:"servings", icon:"People", example: "# of servings", regex: [
              [/^([.\d]+)$/, "serves $1"]
            ] },
            { name:"time", icon:"AccessTime", 
              example: ["# min", "# - # min"], 
              regex: [
                [/^([.\d]+)[\s\-]+([.\d]+)$/, "$1 - $2 min"],
                [/^([.\d]+)$/, "$1 min"],
                [/^([.\d]+)[\s\-]+$/, "$1 - _ min"]
              ] 
            },
          ]}
          onOpen={() => setSearching(true)}
          onClose={() => setSearching()}
          onSearch={data => console.log(data)}
        />
        <MenuButton
          label={sort.charAt(0).toUpperCase() + sort.slice(1)}
          items={
            ["Popular", "New"]
              .map(item => ({ label: item, onClick: () => setSort(item.toLowerCase()) }))
          }
          closeOnSelect
        />
      </div>
      {data &&
        data.map((recipe) => (
          <div key={recipe._id} className={bss("recipe")}>
            <div className={bss("title")}>
              <Link
                to={view_recipe(recipe._id)}
                className={css({
                  color: "#212121",
                })}
              >
                {hideDisplayName
                  ? recipe.title
                  : `${recipe.user.display_name} / ${recipe.title}`}
              </Link>
            </div>
            <div className={bss("desc")}>{recipe.short_description}</div>
            <div className={bss("time")}>{`(${formatTime(
              recipe.min_time,
              recipe.max_time
            )})`}</div>
            {onRemove && (
              <div className={bss("remove")}>
                <Button icon="Close" onClick={() => onRemove(recipe._id)} />
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

export default RecipeList
