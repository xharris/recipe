import * as api from "."
import { useApi } from "util"

export const create = ({ text }) =>
  api.post("recipe/create", { text }, { withCredentials: true })
export const getAll = () => api.get("recipe/all")

export const useGetAll = () =>
  useApi("recipe/all", () => api.get("recipe/all").then((res) => res.data.docs))

export const useGet = () =>
  useApi("recipe/all", (id) =>
    api.get(`recipe/${id}`).then((res) => res.data.doc)
  )

export const commit = (id, text) =>
  api.put(`recipe/${id}/commit`, { text }, { withCredentials: true })

export const getUser = (username) => api.get(`recipe/user/${username}`)

export const del = (id) =>
  api.del(`recipe/${id}`, {}, { withCredentials: true })
