require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()

const videosRoutes = require("./routes/videos")
app.use("/videos", videosRoutes)

app.use(express.static("public"))

const { PORT } = process.env

app.use(cors())

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})