import React, { useEffect, useState } from "react"
import { block, css, cx } from "style"
import { useHistory, Link } from "react-router-dom"
import Button from "component/button"
import { view_recipe } from "util/url"

const bss = block("recipe_list")

const RecipeList = ({ data, hideDisplayName, onRemove }) => {
  const history = useHistory()

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
