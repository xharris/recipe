import { Api, route } from "."

const _api = Api("user", {
  get_theme: route("get", "/theme/:user_id"),
  update_theme: route("put", "/theme/update", true),
  get: { method:"post", route:"/get", res: res => res.data.users[0] },
  get_multiple: route("post", "/get", false, "doclist"),
  login: { method:"post", route:"/login", withCredentials: true, call: (opt, id, pwd) => {
    opt.authorization = btoa(`${id}:${pwd}`)
  } },
  logout: route("post", "/logout", true),
  add: route("post", "/add"),
  verify: route("post", "/verify", true),
  search: route("post", "/search", false, "doclist"),
  update_disp_name: route("put", "/displayname", true),
  get_disp_name: route("post", "/displayname/get")
})

export default _api