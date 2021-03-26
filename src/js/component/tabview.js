import React, { useState, useEffect } from "react"
import Button from "component/button"
import Separator from "component/separator"

import { cx, block } from "style"

const bss = block("tabview")

const TabView = ({ className, tabs, defaultTab, content }) => {
  const [tab, setTab] = useState(defaultTab || 0)

  return (
    <div className={cx(bss(), className)}>
      <div className={bss("header")}>
        {tabs.map(({ className, ...props }, i) => (
          <>
            <Button
              key={i}
              className={cx(bss("label"), className)}
              underline={tab === i}
              onClick={() => setTab(i)}
              {...props}
            />
            {i !== tabs.length - 1 && <Separator />}
          </>
        ))}
      </div>
      {content && content[tab] ? content[tab]() : <div />}
    </div>
  )
}

export default TabView
