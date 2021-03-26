import * as api from "."
import { useApi, useFetch } from "util"

export const useTheme = fn_notify =>
  useApi(
    "user/theme",
    user_id =>
      api.get(`user/theme/${user_id}`).then(res => res.data._doc.theme),
    props => api.put("user/theme/update", props, { withCredentials: true }),
    fn_notify
  )

export const get = values =>
  api.post("user/get", { values: [].concat(values), key: "username" })
export const login = ({ id, pwd, remember }) =>
  api.post(
    "user/login",
    { remember },
    { withCredentials: true, headers: { authorization: btoa(`${id}:${pwd}`) } }
  )
export const logout = () =>
  api.post("user/logout", {}, { withCredentials: true })
export const add = props => api.post("user/add", props)
export const verify = () =>
  api.post("user/verify", {}, { withCredentials: true })

export const search = term => api.post("user/search", { term })
export const useSearch = () =>
  useFetch(term => search(term).then(res => res.data.docs))
export const updateDispName = name =>
  api.put("user/displayname", { name }, { withCredentials: true })
export const getDispName = body => api.post("user/displayname/get", body)
