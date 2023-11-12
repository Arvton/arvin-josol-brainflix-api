const express = require("express")
const router = express.Router();
const fs = require("fs")

// middleware that reads file data. needed before every handler to get up-to-date data
router.use((req, res, next) => {
    const rawVideo = fs.readFileSync("./data/videos.json")
    const parsedVideo = JSON.parse(rawVideo)
    req.rawVideo = parsedVideo
    next()
})

// handles get requests to /videos and responds with a concise version of the video array
router.get("/", (req, res) => {
    const videos = req.rawVideo
    const miniVideos = videos.map((video) => {
        const copiedVideo = {
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image
        }
        return copiedVideo
    })
    res.json(miniVideos)
})


// handles posts requests (uploads from front end)
router.post("/", (req, res) => {
    // create an object based on upload form values
    // const newVideo = {
    //     id: new id
    //     image: "http://localhost:8080/images/Upload-video-preview"
    // }
    // push new video object to videos array
    // write over original video file
    res.send("this is a post request")
})

// handles get requests to /videos/:id and responds with the whole object
router.get("/:id", (req, res) => {
    const videos = req.rawVideo
    const videoId = req.params.id
    const fullSingleVideo = videos.find(video => video.id === videoId)
    // error handling for when video is not found
    fullSingleVideo ? res.json(fullSingleVideo) : res.status(404).send("Video with ID not found.")
})


module.exports = router;