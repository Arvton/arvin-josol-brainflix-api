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
    const newVideoId = uuid.v4()
    const newVideoTimestamp = Date.now()
    const newCommentId = uuid.v4()
    const newCommentTimestamp = Date.now()
    const newVideo = {
        "id": newVideoId,
        "title": req.body.title,
        "channel": "Mrs. Beast",
        "image": `${SERVER_URL}/images/Upload-video-preview.jpg`,
        "description": req.body.description,
        "views": "2,031,023",
        "likes": "11,985",
        "duration": "3:03",
        "video": "https://project-2-api.herokuapp.com/stream",
        "timestamp": newVideoTimestamp,
        "comments": [
            {
                "id": newCommentId,
                "name": "Micheal Lyons",
                "comment": "They BLEW the ROOF off at their last event, once everyone started figuring out they were going. This is still simply the greatest opening of an event I have EVER witnessed.",
                "likes": 0,
                "timestamp": newCommentTimestamp
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

// handles new comments for a video using it's videoId
router.post("/:id/comments", (req, res) => {
    // grab latest data from videos.json
    const videos = req.rawVideo
    // grab video id from request
    const videoId = req.params.id
    // create an object based on upload form values, create id and timestamp
    const newCommentId = uuid.v4()
    const timestamp = Date.now()
    const newComment = {
        "id": newCommentId,
        "name": req.body.name,
        "comment": req.body.comment,
        "likes": 0,
        "timestamp": timestamp
    }
    // find video to add new comment to
    const videoWithNewComment = videos.find(video => video.id === videoId)
    // add new comment to the video
    videoWithNewComment.comments.push(newComment)
    // filter original array to leave out video with new comment
    const filteredVideoArray = videos.filter(video => video.id !== videoId)
    // push video with new comment to filtered array
    filteredVideoArray.push(videoWithNewComment)
    // stringify updated array to write back to file system
    const updatedVideoArray = JSON.stringify(filteredVideoArray)
    fs.writeFile("./data/videos.json", updatedVideoArray, () => res.json(videoWithNewComment.comments))
    return
})

// handles delete comments by video id and comment id
router.delete("/:id/comments/:commentId", (req, res) => {
    // grab latest data from videos.json
    const videos = req.rawVideo
    // grab video id from request
    const videoId = req.params.id
    // grab comment id from request
    const commentId = req.params.commentId
    // find video to delete comment on
    const videoToUpdate = videos.find(video => video.id === videoId)
    const updatedComments = videoToUpdate.comments.filter(comment => comment.id !== commentId)
    videoToUpdate.comments = updatedComments
    // filter original array to leave out video with deleted comment
    const filteredVideoArray = videos.filter(video => video.id !== videoId)
    //push video with deleted comment to filtered videos
    filteredVideoArray.push(videoToUpdate)
    // stringify updated array to write back to file system
    const updatedVideoArray = JSON.stringify(filteredVideoArray)
    fs.writeFile("./data/videos.json", updatedVideoArray, () => res.json(updatedComments))
    return
})

module.exports = router;