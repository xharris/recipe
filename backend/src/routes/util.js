const { Api } = require("../api")
const { status } = require("../api/util")
const axios = require("axios")
const util = new Api("util")

const re_urlstart = /https?:\/\/(www\.)?/
const OEMBED_URL = "https://oembed.com/providers.json"
const provider_cache = {}
const render_preview = [] // "Twitter"]
const preview_html = {
  Twitter: (data) => `${data.author_name}</br>${data.url}`,
}

util.router.post("/scrape", async (req, res) => {
  const provider_options = {}

  const { data: providers } = await axios.get(OEMBED_URL)
  let embed_url, url_options, provider_name

  // check cache first (TODO: to impelement or not to implement?)
  // let cached = !Object.keys(provider_cache).every(p => {
  //   return provider_cache[p].every(({ scheme, url }) => {
  //     const match = scheme.match(req.body.url)
  //     if (match) {
  //       embed_url = url
  //       return false
  //     }
  //     return true
  //   })
  // })

  let cached = false
  const body_url = req.body.url

  if (!cached) {
    providers.every((p) => {
      if (p.endpoints) {
        return p.endpoints.every((e) => {
          if (e.schemes)
            return e.schemes.every((s) => {
              const re_scheme = new RegExp(
                s
                  .replace(/([^\\])([.])/g, "$1\\$2")
                  .replace(/\*/g, ".*")
                  .replace(/\//g, "\\/")
              )
              const match = body_url.match(re_scheme)
              if (match) {
                // cache scheme
                if (!provider_cache[p.provider_name])
                  provider_cache[p.provider_name] = []
                provider_cache[p.provider_name].push({
                  scheme: re_scheme,
                  url: e.url,
                })

                embed_url = e.url
                provider_name = p.provider_name
                return false
              }

              return true
            })
          // schemes
          else if (
            body_url
              .replace(re_urlstart, "")
              .startsWith(p.provider_url.replace(re_urlstart, ""))
          ) {
            // probably discovery url
            embed_url = e.url
            provider_name = p.provider_name
          }

          return true
        }) // endpoints
      }
      return true
    }) // providers
  }

  if (embed_url) {
    url_options = provider_options[provider_name]
      ? `&${provider_options[provider_name]}`
      : ""
    const size = req.body.preview
      ? "maxwidth=270&maxheight=150"
      : "maxwidth=645&maxheight=490"
    embed_url = `${embed_url}?format=json&${size}${url_options}&url=${body_url}`
    const { data } = await axios.get(embed_url)
    return status(200, res, {
      endpoint: embed_url,
      name: provider_name,
      render_preview: render_preview.includes(provider_name),
      preview_html:
        preview_html[provider_name] && preview_html[provider_name](data),
      data,
    })
  } else {
    return status(200, res, {})
  }
})

/*
  if (req.body.twitter) {
    console.log("URL", req.body)
    const { data } = await axios.get(
      `https://publish.twitter.com/oembed?url=${req.body.twitter}`
    )
    return status(200, res, { data })
  } else if (req.body.url) {
    const meta = {}
    const og = {}
    let hasOG = false

    const html = await axios.get(req.body.url)
    if (!html || !html.data) return status(200, res, { message: "NO_META" })
    const $ = cheerio.load(html.data)

    $("meta").each((i, elem) => {
      const $elem = $(elem)
      const prop = $elem.attr("property")
      const title = $elem.attr("name") || $elem.attr("itemprop") || prop

      // OpenGraph meta tag
      if (prop) {
        const prop_parts = prop.split(":")
        if (prop_parts[0] === "og") {
          hasOG = true
          const content = $elem.attr("content")
          const content_type = prop_parts[1]
          const key = prop_parts[2] || "value"

          if (!og[content_type]) og[content_type] = []
          if (
            prop_parts.length === 2 ||
            key === "url" ||
            key === "secure_url"
          ) {
            og[content_type].push({ [key]: content })
          }
          const group = og[content_type].slice(-1)
          if (group) group[key] = content
        }
      }

      meta[title] = {
        name: $elem.attr("name"),
        property: prop,
        content: $elem.attr("content"),
        itemprop: $elem.attr("itemprop")
      }
    })

    Object.keys(og).forEach(type => {
      if (og[type].length === 1) {
        const group_keys = Object.keys(og[type][0])
        if (group_keys.length === 1) og[type] = og[type][0][group_keys[0]]
        else og[type] = og[type][0]
      }
    })

    if (hasOG) {
      og.image_multiple = Array.isArray(og.image)
    }

    return status(200, res, { meta, og: hasOG ? og : false })
  }
  */
