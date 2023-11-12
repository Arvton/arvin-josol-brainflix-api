require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()

const videosRoutes = require("./routes/videos")
app.use("/videos", videosRoutes)

app.use(express.static("public"))

const { PORT, CORS_ORIGIN } = process.env

app.use(cors({ origin: CORS_ORIGIN }))

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})