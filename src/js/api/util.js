import * as api from "."

export const scrape = (url, opt) => api.post("util/scrape", { url, ...opt })
