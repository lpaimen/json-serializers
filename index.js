const express = require("express");
const estatic = require("serve-static")

const PORT = 3000

const server = express()
server.use(estatic("static"))
server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})