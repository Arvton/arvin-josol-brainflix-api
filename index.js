require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()

const { PORT } = process.env

app.use(cors())

const videosRoutes = require("./routes/videos")
app.use("/videos", videosRoutes)

app.use(express.static("public"))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})