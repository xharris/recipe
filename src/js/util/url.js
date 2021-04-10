const server_url = "localhost:3000"

const url = (path) => {
  return (...args) => {
    if (args.length > 0) {
      let p = 0
      return path.replace(/:\w+\??/g, () => args[p++] || "")
    }
    return path
  }
}

export const home = () => "/"
export const edit_recipe = url(`/recipe/:id/edit`)
export const view_recipe = url(`/recipe/:id`)
export const add_recipe = url(`/add/recipe`)
export const recipe_history = url(`/recipe/:id/history/:page?`)

export const view_list = url(`?list=:id`)

export const profile = url(`/u/:username`)
export const profile_recipes = url("/u/:username/recipes")
export const profile_lists = url("/u/:username/lists")

export const settings = url("/settings")
