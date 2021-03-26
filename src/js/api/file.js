import * as api from "."

export const upload = (f, data) => {
  const form_data = new FormData()
  form_data.append("file", f)
  if (data) form_data.append("data", data)
  return api.post("file/upload", form_data, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
}

export const get = id => api.get(`file/${id}`)
