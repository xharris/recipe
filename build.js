const { exec } = require("child_process")
const { copy, remove } = require("fs-extra")
const { join } = require("path")

remove("build")
  .then(() => {
    // build frontend with craco build
    const child = exec("craco build")
    child.stdout.on("data", console.log)
    child.stderr.on("data", console.error)
    return new Promise(res => child.on("exit", res))
  })
  // copy backend into build folder
  .then(() => copy("backend", join("build", "backend")))
  .then(() => remove(join("build", "backend", "files")))
  .then(() => remove(join("build", "backend", "notes.md")))
  // package.json
  .then(() => copy("package.json", join("build", "package.json")))
// .then(() => copy(".env", join("build", ".env")))
