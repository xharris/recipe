import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext
} from "react"
import { merge } from "util"

const default_settings = {
  postview: {
    view_type: "new"
  },
  postview_ui: {
    showcontrols: true
  }
}

const SettingsContext = createContext({
  settings: default_settings,
  setSettings: () => {}
})

export const useSettingsContext = group => {
  const { settings, setSetting } = useContext(SettingsContext)
  const set = (k, v) => setSetting(group, k, v)
  return [settings[group] || default_settings[group], set]
}

const SettingsProvider = ({ children }) => {
  let local_settings = localStorage.getItem("settings") || {}
  try {
    local_settings = JSON.parse(localStorage.getItem("settings"))
  } catch (e) {
    local_settings = {}
  }

  const [settings, setSettings] = useState(
    merge(default_settings, local_settings)
  )

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSetting: (group, k, v) =>
          setSettings({ ...settings, [group]: { ...settings[group], [k]: v } })
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
