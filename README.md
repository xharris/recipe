# Recipes

![Deploy](https://github.com/xharris/recipes/workflows/Deploy/badge.svg)

## # Development

`yarn run dev`

-- or --

`yarn run frontend:dev`

`yarn run backend:dev`

## push to heroku

`heroku git:remote -a recipes-web`

`git push heroku master` / `git push heroku otherbranch:master`

## explore heroku files 

`heroku run bash`

## stop heroku build

`heroku plugins:install heroku-builds` (only once)

`heroku builds:cancel BUILD_UUID -a APP_NAME`

## yarn audit fix

```
npm i --package-lock-only
rm yarn.lock
npm audit fix
yarn import
rm package-lock.json
```

## add a package (will change if I stop using heroku)

`yarn add <pkg-name> --ignore-engines`

## Hot formula

actions = (len(comments) + len(reaction) + len(views))

hot = int(log10(actions) + (min(actions, 1) * date_created.ms / 45000))

## # What to do next?

[Features to implement, Bugs to fix](https://github.com/xharris/squeakr/issues?q=is%3Aopen+is%3Aissue)
