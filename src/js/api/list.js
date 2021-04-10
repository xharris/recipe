import { Api } from "."

const api = Api("list", {
  create: { route: "/create", method: "post", withCredentials: true },
  get_user: { route: "/user/:id", method: "get", doclist: true },
  get: { route: "/:id", method: "get" },
  update: { route: "/:id", method: "put", withCredentials: true },
  add_recipe: {
    route: "/:id/recipe/:recipe",
    method: "put",
    withCredentials: true,
  },
})

export default api
