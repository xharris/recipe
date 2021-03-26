import React, { useEffect, useState } from "react"
import { block, css } from "style"
import Page from "."
import Body from "feature/body"
import Editable from "component/editable"
import Button from "component/button"
import Text from "component/text"
import { create } from "api/recipe"

const bss = block("page_recipe_add")

const PageRecipeAdd = () => {
  const [text, setText] = useState()
  const [error, setError] = useState()

  return (
    <Page className={bss()}>
      <Body className={bss("body")}>
        <Editable onChange={setText} multiline />
        {error && <Text>{error}</Text>}
        <Button
          label="Add"
          onClick={() => {
            setError()
            create({ text })
              .then((res) => console.log(res))
              .catch((e) => setError(e.response.data))
          }}
        />
      </Body>
    </Page>
  )
}

export default PageRecipeAdd
