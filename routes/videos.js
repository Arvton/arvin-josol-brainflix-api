const express = require("express")
const router = express.Router();
router.use(express.json())
const uuid = require("uuid")
const fs = require("fs")

const { SERVER_URL } = process.env

// function that creates a concise version of videos.json with only: id, title, channel, image
const getMiniVideos = (videos) => {
    const miniVideos = videos.map((video) => {
        const copiedVideo = {
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image
        }
        return copiedVideo
    })
    return miniVideos
}

// middleware that reads file data. needed before every handler to get up-to-date data for reads and writes with fs
router.use((req, res, next) => {
    const rawVideo = fs.readFileSync("./data/videos.json")
    const parsedVideo = JSON.parse(rawVideo)
    req.rawVideo = parsedVideo
    next()
})

// handles get requests to /videos and responds with a concise version of the video array
router.get("/", (req, res) => {
    const videos = req.rawVideo
    res.json(getMiniVideos(videos))
})


// handles posts requests (uploads from front end)
router.post("/", (req, res) => {
    // create an object based on upload form values
    const videos = req.rawVideo
    const testId = uuid.v4()
    const timestamp = Date.now()
    const newVideo = {
        "id": testId,
        "title": req.body.title,
        "channel": "Mrs. Beast",
        "image": `${SERVER_URL}/images/Upload-video-preview.jpg`,
        "description": req.body.description,
        "views": "2,031,023",
        "likes": "11,985",
        "duration": "3:03",
        "video": "https://project-2-api.herokuapp.com/stream",
        "timestamp": timestamp,
        "comments": [
            {
                "id": "35bba08b-1b51-4153-ba7e-6da76b5ec1b9",
                "name": "Micheal Lyons",
                "comment": "They BLEW the ROOF off at their last event, once everyone started figuring out they were going. This is still simply the greatest opening of an event I have EVER witnessed.",
                "likes": 0,
                "timestamp": 1628522461000
            },
            {
                "id": "ade82e25-6c87-4403-ba35-47bdff93a51c",
                "name": "Mattie Casarez",
                "comment": "This is exactly the kind of advice I’ve been looking for! One minute you’re packing your bags, the next you’re dancing around in the streets without a care in the world.",
                "likes": 0,
                "timestamp": 1625250720000
            },
            {
                "id": "f7b9027b-e407-45fa-98f3-7d8a308ddf7c",
                "name": "Sharon Tillson",
                "comment": "Amazing footage of an amazing spot! It’s so inspiring to watch the sun rising over a landscape like this. I can only imagine how fresh the air must feel there on a snowy morning.",
                "likes": 3,
                "timestamp": 1623002522000
            }
        ]
    }
    // push new video object to videos array
    videos.push(newVideo)
    // write over original video file
    const updatedVideoArray = JSON.stringify(videos)
    fs.writeFile("./data/videos.json", updatedVideoArray, () => res.json(getMiniVideos(videos)))
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