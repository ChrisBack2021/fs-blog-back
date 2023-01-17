const router = require('express').Router()
const User = require('../models/User')
const Post = require('../models/Post')



// CREATE
router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).send(savedPost)
    } catch (error) {
        res.status(500).send(error)
    }
})

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.username ===req.body.username)
        try {
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },
                { new: true }
            )
            res.status(200).json(updatedPost)
        } catch (error) {
            res.status(401).send("You can only update your own post")
        }

    } catch (error) {
        res.status(500).send(error)
    }
})

// DELETE POST
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.username ===req.body.username)
        try {
            await post.delete()
            res.status(200).json("Post has been deleted...")
        } catch (error) {
            res.status(401).send("You can only delete your own post")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

// GET POST
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).send(err)
    }
})

// GET ALL POSTS
router.get('/', async (req, res) => {
    const username = req.query.user
    const catName = req.query.cat
    try {
        let posts
        if (username) {
            posts = await Post.find({username})
        } else if (catName) {
            posts = await Post.find({
                categories: {
                $in:[catName]
            }})
        } else {
            posts = await Post.find()
        }
        res.status(200).send(posts)
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports = router