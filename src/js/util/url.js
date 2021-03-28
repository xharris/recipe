const server_url = "localhost:3000"

export const home = () => "/"
export const edit_recipe = (id) => `/recipe/${id}/edit`
export const view_recipe = (id) => `/recipe/${id}`
export const add_recipe = () => `/add/recipe`
export const recipe_history = (id) => `/recipe/${id}/history`

export const profile = (username) => `/profile/${username}`
export const profile_recipes = (username) => `/profile/${username}/recipes`
export const profile_lists = (username) => `/profile/${username}/lists`

export const play = (id) => `/play/${id}`
export const lobby = (id) => `/lobby/${id}`

export const card = (id) => `/card/${id}`
export const user = (id) => `/u/${id}`
export const post = (id) => `/p/${id}`
export const settings = () => `/settings`
export const explore = ({ group } = {}) =>
  group ? `/explore?group=${group}` : "/explore"
export const tag = ({ username, tags }) =>
  username
    ? `/u/${username}?tags=${tags.join(",")}`
    : `/explore?tags=${tags.join(",")}`
export const image = (id) => `${server_url}/file/${id}`
