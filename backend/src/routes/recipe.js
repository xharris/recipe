const { Api, Schema } = require("../api")
const { status, queryCheck, ref } = require("../api/util")
const diff = require("diff")

const ingredient = Schema({
  amount: Number,
  values: [String],
})

const history = Schema(
  {
    message: String,
    original: String,
    patch: String,
    patch_readable: {
      type: String,
      get: function () {
        const patch = diff.parsePatch(this.patch)
        console.log("CHANGE", this.date_created)
        patch.forEach((p) => console.log(p.hunks))
        // diff.diffChars(
        //   htmlToText(doc.text),
        //   htmlToText(req.body.text)
        // )
        return this.patch
      },
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  }
)

const recipe = new Api(
  "recipe",
  {
    text: String,
    user: ref("user"),
    title: String,
    min_time: Number,
    max_time: Number,
    body: {
      type: String,
      trim: true,
    },
    short_description: {
      type: String,
      get: function () {
        let steps_found = 0
        return this.body
          .split(/[\r\n]/)
          .filter((line) => {
            steps_found += re_step.test(line) ? 1 : 0
            return steps_found < 1 && !re_step.test(line)
          })
          .join(" ")
      },
    },
    servings: Number,
    tags: [String],
    ingredients: [ingredient],
    history: [history],
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  }
)

const re_title = /^#([^#].*)/i
const re_ingredient = /^[-*](.*)/i
const re_step = /^(\d)\.(.*)/i
const re_attribute = /^#{2,}(.*)/i
const re_time = /(few|couple|[\d\s\-\.]+)\s*(secs?|mins?|hrs?|hours?)/gi
const re_time_split = /[\s-]+/i
const re_servings = /servings?|serves?/i
const re_tags = /tags?:?/i
const re_ingredient_ignore = /of/i

const htmlToText = (html) =>
  html
    .replace(/^(<\/?div>|<br\/?>)+/i, "")
    .replace(/(<\/?div>|<br\/?>)+$/i, "")
    .replace(/(<\/?div>|<br\/?>)+/gi, "\n")

const parseRecipeText = (html) => {
  const text = htmlToText(html)
  let title
  const ingredients = []
  const body = []
  // in seconds
  let min_time = 0
  let max_time = 0
  const attributes = {}

  const lines = text.split(/[\r\n]/)
  const split = (l) => l.split(/\s+/i)
  for (const line of lines) {
    // ingredient
    if (re_ingredient.test(line)) {
      const elements = split(line).slice(1)
      const ingredient = {
        amount: -1,
        values: [],
      }
      for (const elem of elements) {
        if (!isNaN(parseFloat(elem))) ingredient.amount = parseFloat(elem)
        else if (!re_ingredient_ignore.test(elem)) ingredient.values.push(elem)
      }
      ingredients.push(ingredient)
    }
    // step
    else if (re_step.test(line)) {
      const elements = split(line).slice(1)
      let m_time = re_time.exec(line)
      if (m_time) {
        //while ((m_time = re_time.exec(line))) {
        // parse time value (couple / few / number)
        const amt = m_time[1]
          .split(re_time_split)
          .map((t) => {
            if (t === "few") return 3
            else if (t === "couple") return 2
            return t
          })
          .map(parseFloat)
          .filter((t) => t && !isNaN(t))
        const unit = m_time[2]
        const multiplier = /hr|hour/.test(unit)
          ? 3600
          : /min/.test(unit)
          ? 60
          : 1
        // time range?
        if (amt.length === 2) {
          min_time += amt[0] * multiplier
          max_time += amt[1] * multiplier
        }
        // single time
        else if (amt.length === 1) {
          min_time += amt[0] * multiplier
          max_time += amt[0] * multiplier
        }
      }
      body.push(line)
    }
    // attribute
    else if (re_attribute.test(line)) {
      const elements = split(line).slice(1)
      let type, amount, str_value
      const list_values = []
      for (const elem of elements) {
        // console.log(type, elem)
        if (!isNaN(parseFloat(elem))) amount = parseFloat(elem)
        else if (re_servings.test(elem)) type = "servings"
        else if (re_tags.test(elem)) type = "tags"
        else if (type === "tags") list_values.push(elem)
        else str_value = elem
      }
      if (
        type &&
        (amount != null || str_value != null || list_values.length > 0)
      ) {
        attributes[type] =
          list_values.length > 0 ? list_values : str_value || amount
      }
    }
    // title
    else if (re_title.test(line)) {
      title = split(line).slice(1).join(" ")
    }
    // description
    else {
      body.push(line)
    }
  }

  return {
    text,
    title,
    min_time,
    max_time,
    ingredients,
    body: body.join("\n"),
    ...attributes,
  }
}

const verifyRecipe = (res, info) => {
  if (!info.title) {
    status(400, res, "RECIPE_NO_TITLE")
    return false
  }
  return true
}

recipe.auth.any = [
  "/create",
  "/:id/commit", // /\/(\w+)\/commit/,
  { method: "DELETE", path: /\/(\w+)/ },
]

recipe.router.post("/create", (req, res) => {
  const new_recipe = parseRecipeText(req.body.text)
  if (verifyRecipe(res, new_recipe))
    recipe.model
      .create({ text: req.body.text, user: req.user, ...new_recipe })
      .then((doc) => status(200, res, { doc }))
})

recipe.router.get("/all", (req, res) => {
  recipe.model.find().then((docs) => status(200, res, { docs }))
})

recipe.router.get("/:id", (req, res) => {
  recipe.model
    .findById(req.params.id)
    .populate("user")
    .then((doc) => status(200, res, { doc }))
})

recipe.router.put("/:id/commit", async (req, res) => {
  const recipe_info = parseRecipeText(req.body.text)
  if (verifyRecipe(res, recipe_info)) {
    const doc = await recipe.model.findById(req.params.id).exec()
    if (queryCheck(res, null, doc)) return
    const patch = diff.createPatch(
      `recipe-${doc._id}`,
      doc.text,
      req.body.text,
      doc.date_modified,
      new Date()
    )
    const changes = diff.diffLines(
      htmlToText(doc.text),
      htmlToText(req.body.text)
    )
    if (changes.length > 1) {
      doc.history.push({ original: doc.text, message: req.body.message, patch })
      doc.text = req.body.text
      return doc.save(
        (err) =>
          queryCheck(res, err, doc) ||
          status(200, res, { doc, message: "SAVED" })
      )
    }
    status(200, res, { doc, message: "NO_CHANGES" })
  }
})

recipe.router.get("/user/:username", async (req, res) => {
  const { user } = require("./user")
  const doc_user = await user.model
    .findOne({ username: req.params.username })
    .exec()
  if (!queryCheck(res, `User ${req.params.username} not found`, doc_user)) {
    console.log(doc_user)
    recipe.model
      .find({ user: doc_user })
      .exec(
        (err, docs) => queryCheck(res, err, docs) || status(200, res, { docs })
      )
  }
})

recipe.router.delete("/:id", (req, res) => {
  recipe.model
    .findOneAndDelete({ _id: req.params.id, user: req.user._id })
    .exec((err, doc) => queryCheck(res, err, doc) || status(200, res))
})
