import { useState, useEffect, useCallback, useRef } from "react"
import { useLocation, useHistory } from "react-router-dom"
import SocketIO from "socket.io-client"

export const useListen = (...args) => {
  var [path, id, fn] = [null, null, () => {}]
  if (args.length === 2) [path, fn] = args
  if (args.length === 3) [path, id, fn] = args

  useEffect(() => {
    let sock
    const [obj, evt] = (path || "").split("/")
    if (obj) {
      sock = SocketIO(`${process.env.REACT_APP_HOST}${obj}`)
      if (evt)
        sock.on(evt, (_id) => {
          if (id == null || _id === id) fn(_id)
        })
      else
        sock.onAny((_evt, _id) => {
          if (id == null || _id === id) fn(_evt, _id)
        })
    }

    return () => {
      if (sock) sock.disconnect()
    }
  }, [path, id])
}

export const useApi = (route, fn_fetch, fn_update, fn_notify) => {
  const [data, setData] = useState()
  const mountedRef = useRef(true) // neat hack found at https://stackoverflow.com/a/60693711

  const fetch = useCallback(
    (...args) => {
      if (fn_fetch)
        fn_fetch(...args).then((res) => {
          if (!mountedRef.current) return res
          setData(res)
        })
    },
    [fn_fetch]
  )

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const update = useCallback(
    (...args) => {
      if (fn_update)
        fn_update(...args).then((res) => {
          notify(route)
        })
    },
    [fn_update, route]
  )

  useNotify(fn_notify === "fetch" ? fetch : fn_notify, route)

  return [data, fetch, update, setData]
}

// api

export const notify = (type, id) =>
  dispatch(`fetch_one_${type}`, {
    detail: { id },
  })

export const useNotify = (fn, type, id) => {
  const call = useCallback(
    (e) => {
      if (!id || e.detail.id === id) fn(e)
    },
    [fn, type, id]
  )

  useEffect(() => {
    if (type) {
      on(`fetch_one_${type}`, call)
      return () => {
        off(`fetch_one_${type}`, call)
      }
    }
  }, [])
}

export const useFetch = (fn, type, id, init) => {
  const [result, setResult] = useState(init)
  const fetch = (...args) =>
    fn(...args)
      .then((res) => {
        setResult(res)
        return res
      })
      .catch((e) => {
        console.error(e)
      })

  const onFetchOne = useCallback(
    (e) =>
      (e.detail.id == null || id == null || e.detail.id === id) && fetch(id),
    [id]
  )

  // notify subscribers of change
  const notify_type = useCallback(
    (diff_id) => type && notify(type, diff_id || id),
    [type, id]
  )

  // subscribe to changes
  useEffect(() => {
    if (type) {
      on(`fetch_one_${type}`, onFetchOne)
      return () => {
        off(`fetch_one_${type}`, onFetchOne)
      }
    }
  }, [])

  return [result, fetch, notify_type, setResult]
}

// can be used on a simple api.update(id, data) function
const api_fns = {}
export const useUpdate = ({
  fn,
  type,
  data: initial_data,
  key,
  cooldown,
  skip_notify,
}) => {
  const [stateData, setData] = useState(initial_data)
  var is_object = typeof data === "object"
  var data = is_object ? { ...initial_data } : initial_data

  const api_call = (res, rej) =>
    fn(data)
      .then((r) => {
        if (data && !skip_notify) notify(type, is_object && data[key || "_id"])
        return res(r)
      })
      .catch(rej)

  const update = (new_data) =>
    new Promise((res, rej) => {
      // update local copy immediately
      if (typeof new_data === "object") data = { ...stateData, ...new_data }
      else data = new_data
      setData(data)

      if (!cooldown || cooldown === 0) {
        api_call(res, rej)
      } else if (!api_fns[fn]) {
        // update remote copy when off cooldown
        api_fns[fn] = setTimeout(() => {
          api_call(res, rej)
          api_fns[fn] = null
        }, cooldown)
      }
    })

  return [
    stateData,
    update,
    (d) => {
      setData(d)
      data = d
    },
  ]
}

// event handling

export const dispatch = (...args) =>
  document.dispatchEvent(new CustomEvent(...args))

export const on = (...args) => document.addEventListener(...args)
export const off = (...args) => document.removeEventListener(...args)

// misc

export const cooldown = (time, fn) => {
  var can_call = true

  const wrapper = (...args) => {
    if (can_call) {
      // not on cooldown
      fn(...args)
      can_call = false
      setTimeout(() => {}, time)
    }
  }
}

export const useQuery = () => {
  const { search } = useLocation()
  const { location, replace } = useHistory()
  const [params, setParams] = useState()

  useEffect(() => {
    setParams(new URLSearchParams(search))
  }, [search])

  const updateLocation = useCallback(() => {
    if (params) {
      replace(location.pathname + "?" + params.toString())
    }
  }, [params])

  const setParam = useCallback(
    (k, v) => {
      if (params) {
        if (v) params.set(k, v)
        else params.delete(k)
        updateLocation()
      }
    },
    [params]
  )

  const removeParam = useCallback(
    (k) => {
      if (params) {
        params.delete(k)
        updateLocation()
      }
    },
    [params]
  )

  return { params, setParam, removeParam }
}

export const useWindowSize = () => {
  const [width, setW] = useState(0)
  const [height, setH] = useState(0)

  const sizeChange = (e) => {
    setW(window.innerWidth)
    setH(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener("resize", sizeChange)
    return () => {
      window.removeEventListener("resize", sizeChange)
    }
  }, [])

  return [width, height]
}

export const insertAtCursor = (myField, myValue) => {
  var sel
  //IE support
  if (document.selection) {
    myField.focus()
    sel = document.selection.createRange()
    sel.text = myValue
  }
  //MOZILLA and others
  else if (myField.selectionStart || myField.selectionStart === 0) {
    var startPos = myField.selectionStart
    var endPos = myField.selectionEnd
    myField.value =
      myField.value.substring(0, startPos) +
      myValue +
      myField.value.substring(endPos, myField.value.length)
  } else {
    myField.value += myValue
  }
}

export const capitalize = (s) => s.replace(/^\w/, (c) => c.toUpperCase())

export const useCombinedRef = (...refs) => {
  const targetRef = useRef()

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === "function") {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

export const pluralize = (amt, suffix) => (amt === 1 ? "" : suffix)

const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item)
}

export const merge = (target, ...sources) => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        merge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return merge(target, ...sources)
}

export const is_dev = () =>
  (process.env.NODE_ENV || "development") === "development"
