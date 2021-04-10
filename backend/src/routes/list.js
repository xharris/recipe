const { Api } = require("../api")
const { status, queryCheck, ref } = require("../api/util")

const list = new Api("list", {
  user: ref("user"),
  name: { type: String, default: "New list" },
  recipes: [ref("recipe")],
})

list.auth.any = ["/create", { method: "PUT", path: "/:id" }]

list.router.get("/:id", (req, res) => {
  list.model
    .findById(req.params.id)
    .populate("user")
    .populate({
      path: "recipes",
      populate: {
        path: "user",
      },
    })
    .exec((err, doc) => status(200, res, { doc }))
})

list.router.get("/user/:id", async (req, res) => {
  // const { user } = require("./user")
  // const doc_user = await user.model.findOne({ username: req.params.username })
  // if (queryCheck(res, "USER_NOT_FOUND", doc_user)) return
  list.model
    .find({ user: req.params.id })
    .exec(
      (err, docs) => queryCheck(res, err, docs) || status(200, res, { docs })
    )
})

list.router.post("/create", (req, res) => {
  list.model.create({ user: req.user }).then((doc) => status(200, res, { doc }))
})

list.router.put("/:id", (req, res) => {
  console.log(req.params.id, req.user._id, req.body)
  list.model
    .findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body)
    .exec((err, doc) => status(200, res, { doc }))
})

module.exports = { list }
