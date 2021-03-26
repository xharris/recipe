import React from "react"

const site_name = "Food Repo"

const Title = ({ children }) => (
  <title>{children ? `${children} | ${site_name}` : site_name}</title>
)

export default Title
