const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getByCategoryID = async function(req, res) {
    try {
        const positions = await Position.find({
            category: req.params.categoryId,
            user: req.user.id
        })
        // check loader if is working
        // setTimeout(() => {
            res.status(200).json(positions)
        // }, 2000)
    } catch (err) {
        errorHandler(res, err)
    }
}

module.exports.create = async function(req, res) {
    try {
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        }).save()
        res.status(201).json(position)
    } catch (err) {
        errorHandler(res, err)
    }
}

module.exports.remove = async function(req, res) {
    try {
        await Position.remove({_id: req.params.id})
        res.status(200).json({
            message: 'Position was deleted'
        })
    } catch (err) {
        errorHandler(res, err)
    }
}

module.exports.update = async function(req, res) {
    try {
        const position = await Position.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json(position)
    } catch (err) {
        errorHandler(res, err)
    }
}
