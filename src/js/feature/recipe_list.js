import React, { useEffect, useState } from "react"
import { block, css, cx } from "style"
import { useHistory, Link } from "react-router-dom"
import { edit_recipe } from "util/url"

const bss = block("recipe_list")

const RecipeList = ({ data }) => {
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
    <table className={cx(bss(), css({ fontSize: "0.9rem" }))}>
      <tbody>
        {data &&
          data.map((recipe) => (
            <tr
              key={recipe._id}
              className={css({
                "&:hover": {
                  outline: "1px solid #BDBDBD",
                },
              })}
            >
              <td className={bss("col_title", { col: "fit" })}>
                <Link
                  to={edit_recipe(recipe._id)}
                  className={css({
                    color: "#212121",
                  })}
                >
                  {recipe.title}
                </Link>
              </td>
              <td className={bss("col_desc")}>{recipe.short_description}</td>
              <td className={bss({ col: "fit" })}>{`(${formatTime(
                recipe.min_time,
                recipe.max_time
              )})`}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}

export default RecipeList
