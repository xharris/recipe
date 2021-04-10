import React, { useState, useEffect, memo } from "react"
import Text from "component/text"
import ReactHtmlParser from "react-html-parser"
import { useThemeContext } from "feature/theme"
import { lookup } from "mime-types"
import Video from "component/video"
import * as apiUtil from "api/util"
import { block, cx, css } from "style"

const re_url = /(.*)(https?:\/\/\S+)(.*)/i
const re_api_image = /\/api\/file\/img\/\w+/i
const re_api_video = /\/api\/file\/v\/\w+/i

const bss = block("link")

const preview_scrape_cache = {}
const scrape_cache = {}

const Link = ({
  newtab,
  className,
  href: _href,
  preview,
  alt,
  children,
  bg = "secondary",
  color = "primary",
  amt = 20,
}) => {
  const { getColor } = useThemeContext()
  const [metadata, setMetadata] = useState()
  const [data, setData] = useState()
  const [lastHref, setLastHref] = useState()
  const [type, setType] = useState()
  const [href, setHref] = useState()

  useEffect(() => {
    let cancel = false
    if (type && lastHref !== _href) {
      // console.log(type, _href)
      if (type === "link") {
        const cached_res = preview
          ? preview_scrape_cache[_href]
          : scrape_cache[_href]
        if (cached_res) {
          setData(cached_res)
          setMetadata(cached_res.data)
        } else {
          apiUtil
            .scrape(_href, { preview })
            .then((res) => {
              if (!cancel) {
                setData(res.data)
                setMetadata(res.data.data)
                if (preview) {
                  preview_scrape_cache[_href] = res.data
                } else {
                  scrape_cache[_href] = res.data
                }
              }
            })
            .finally(() => !cancel && setHref(_href))
        }
      } else if (type === "video" && re_api_video.test(_href)) {
        fetch(_href)
          .then((res) => res.blob())
          .then((blob) => {
            if (!cancel) setHref(URL.createObjectURL(blob))
          })
      } else {
        setHref(_href)
      }
      setLastHref(_href)
    }
    return () => {
      cancel = true
    }
  }, [preview, preview_scrape_cache, scrape_cache, type, _href, href])

  useEffect(() => {
    return () => {
      let parent = document.getElementById(`scripts-${encodeURI(_href)}`)
      if (parent) parent.parentElement.removeChild(parent)
    }
  }, [_href])

  useEffect(() => {
    if (_href) {
      const mimetype = lookup(_href)
      const isurl = re_url.test(_href)

      // console.log("isurl", isurl, _href)

      if (re_api_image.test(_href)) {
        setType("image")
      } else if (mimetype) {
        if (mimetype.startsWith("video")) setType("video")
        else if (mimetype.startsWith("image")) setType("image")
      } else {
        setType(isurl ? "link" : "other")
      }
    }
  }, [_href])

  return !(href || type) ? (
    <div
      className={cx(
        bss({ loading: true }),
        css({
          backgroundColor: getColor("secondary", "secondary"),
        })
      )}
    />
  ) : metadata && data ? (
    <div
      className={cx(
        bss({ preview, thumbnail: !!metadata.thumbnail_url }),
        css({
          backgroundImage:
            preview &&
            metadata.thumbnail_url &&
            `url(${metadata.thumbnail_url})`,
          width: metadata.width,
          height: metadata.height,
          maxHeight: preview && 150,
        }),
        className
      )}
    >
      {preview && data.preview_html ? (
        ReactHtmlParser(data.preview_html)
      ) : preview && !data.render_preview ? (
        <Text themed className={bss("title")}>
          {data.preview_html || metadata.title || href}
        </Text>
      ) : metadata.html ? (
        ReactHtmlParser(metadata.html, {
          transform: function (node) {
            if (node.type === "script") {
              let parent = document.getElementById(`scripts-${encodeURI(href)}`)
              if (!parent) {
                parent = document.createElement("div")
                parent.id = `scripts-${encodeURI(href)}`
                document.head.appendChild(parent)
              }
              let el_src = document.createElement("script")
              el_src.src = node.attribs.src
              parent.appendChild(el_src)
            }
          },
        })
      ) : null}
    </div>
  ) : type === "video" ? (
    <Video
      className={bss("video")}
      source={href}
      type={type}
      preview={preview}
    />
  ) : type === "image" ? (
    <img className={bss("image")} src={href} alt={alt || href} loading="lazy" />
  ) : type === "link" ? (
    <a
      className={cx(
        bss(),
        css({
          color: getColor(color, bg, amt),
        }),
        className
      )}
      href={href}
      alt={alt}
      rel={newtab ? "noreferrer" : null}
      target={newtab ? "_blank" : null}
    >
      {children || href}
    </a>
  ) : (
    children || href
  )
}

export default memo(Link)
