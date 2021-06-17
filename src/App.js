import React, { useState, useEffect, useRef } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import AuthProvider from "component/auth"
import { DndProvider } from "component/dragdrop"
import SettingsProvider from "component/settings"
import ThemeProvider from "component/theme"
import { SnackbarProvider } from "notistack"
import PageHome from "feature/page/home"
import PageRecipeAdd from "feature/page/recipe_add"
import PageRecipeView from "feature/page/recipe_view"
import PageProfile from "feature/page/profile"
import * as url from "util/url"
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
                <SnackbarProvider>
                  <Switch>
                    <Route path={url.home()} exact>
                      <PageHome />
                    </Route>
                    <Route path={url.add_recipe()}>
                      <PageRecipeAdd />
                    </Route>
                    <Route
                      path={[
                        url.edit_recipe(),
                        url.view_recipe(),
                        url.recipe_history(),
                      ]}
                      exact
                    >
                      <PageRecipeView />
                    </Route>
                    <Route path={url.profile()}>
                      <PageProfile />
                    </Route>
                  </Switch>
                </SnackbarProvider>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </DndProvider>
      </Router>
    </div>
  )
}

export default App
