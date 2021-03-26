import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AuthProvider from "component/auth"
import { DndProvider } from "component/dragdrop"
import SettingsProvider from "component/settings"
import ThemeProvider from "feature/theme"
import PageHome from "feature/page/home"
import PageRecipeAdd from "feature/page/recipe_add"
import PageRecipeEdit from "feature/page/recipe_edit"
import PageProfile from "feature/page/profile"
import "style/index.scss"

/**TODO
 * - opengraph meta tags: https://pastebin.com/uPHJBzGV
 */

const App = () => {
  return (
    <div className="App">
      <Router>
        <DndProvider>
          <AuthProvider>
            <SettingsProvider>
              <ThemeProvider>
                <Switch>
                  <Route path="/" exact>
                    <PageHome />
                  </Route>
                  <Route path="/add/recipe" exact>
                    <PageRecipeAdd />
                  </Route>
                  <Route path="/recipe/:id/edit" exact>
                    <PageRecipeEdit />
                  </Route>
                  <Route path="/profile/:username">
                    <PageProfile />
                  </Route>
                </Switch>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </DndProvider>
      </Router>
    </div>
  )
}

export default App
