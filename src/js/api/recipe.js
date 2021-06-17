import { Api, route } from "."

const api = Api("recipe", {
  create: route("post", "/create", true),
  get_all: route("get", "/all", false, "doclist"),
  get: route("get", "/:id"),
  commit: route("put", "/:id/commit", true),
  get_user: route("get", "/user/:username", false, "doclist"),
  del: route("delete", "/:id", true),
  fork: route("post", "/:id/fork", true)
})

export default api 