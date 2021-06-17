import { useState } from "react"
import { notify, useNotify } from "util"
const axios = require("axios")

const constructUrl = (suffix) =>
  suffix.startsWith("http")
    ? suffix
    : `${process.env.REACT_APP_HOST}api/${suffix}`

export const isCancel = axios.isCancel

const tokens = {}
const transform = (method, suffix, data, config) => {
  const url = constructUrl(suffix)
  if (!config) config = {}
  if (tokens[url])
    tokens[url].cancel()
  tokens[url] = axios.CancelToken.source()
  return axios({ method, url, data, cancelToken: tokens[url].token, ...config })
}

export const get = (...args) => transform("get", ...args)
export const post = (...args) => transform("post", ...args)
export const put = (...args) => transform("put", ...args)
export const patch = (...args) => transform("patch", ...args)
export const del = (...args) => transform("delete", ...args)

// const api = Api("list", {
//   create: { route:"/create", method:"post", withCredentials: true },
//   get_user: { route:"/user/:id", method:"get", multiple: true },
//   get: { route:"/user/:id", method:"get" }
// })
// api.get(id)
// export default api

// route options
//  withCredentials, method, route, doclist, docless, raw

export const route = (method, route, withCredentials = false, doctype) =>
  ({ route, method, withCredentials, 
      docless: doctype === "docless",
      doclist: doctype === "doclist",
      raw: doctype === "raw"
    })

export const Api = (table, routes) => {
  const route_obj = {}
  for (const name in routes) {
    const info = { method: "get", ...routes[name] }
    route_obj[name] = (...args) => {
      // construct arguments
      const params = []
      let payload = {}
      for (const arg of args) {
        // payload
        if (typeof arg === "object" && arg != null) payload = arg
        // route param
        else params.push(arg)
      }
      // construct route with parameters
      let p = 0
      if (!info.route) throw `No route given for '${table}.${name}'`
      const path = `${table}${info.route.replace(/:\w+/g, () => params[p++])}`
      // make api call
      const options = { ...info }
      if (info.call)
        info.call(options, ...args)
      return (info.method === "get"
        ? get(path, options)
        : transform(info.method, path, payload, options)
      )
        .then((res) =>
          info.res ? 
            info.res(res) 
            : info.docless
          ? res.data
            : info.doclist
          ? res.data.docs
            : info.raw
          ? res
            : res.data.doc || res.data.data
        )
        .then((res) => {
          notify(table)
          return res
        })
    }
  }

  // returns [res, update(payload)]
  const useRoute = (name) => {
    const [data, setData] = useState()
    const call = (...args) =>
      route_obj[name](...args).then((new_data) => {
        setData(new_data)
        return new_data
      })
    return [data, call, setData]
  }

  return {
    useRoute,
    useNotify: (fn, ...args) => useNotify(fn, table, ...args),
    ...route_obj,
  }
}
