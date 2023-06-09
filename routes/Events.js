const express = require('express')
var router = express.Router()
const jwt = require('jsonwebtoken')
const Event = require('../models/Event.model')

//user events
router.get('/event', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], 'secret')
    if (decoded.roles === "admin") {
        Event.find({}).then((doc) => {
            res.json({ doc })
        }).catch((error) => {
            res.json({ error })
        })
    } else {
        Event.find({
            user_id: decoded._id
        }).then((doc) => {
            res.json({ doc })
        }).catch((error) => {
            res.json({ error })
        })
    }
})

router.get('/event/get', (req, res) => {
    Event.find({}).then((doc) => {
        res.json({ doc })
    }).catch((error) => {
        res.json({ error })
    })
})

//add event
router.post('/event/add', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], 'secret')
    var newEvent = new Event({
        title: req.body.title,
        name: decoded.name,
        startTime: req.body.startTime,
        startDate: req.body.startDate,
        endTime: req.body.endTime,
        endDate: req.body.endDate,
        description: req.body.description,
        classRoom: req.body.classRoom,
        user_id: decoded._id
    })
    Event.findOne({
        startDate: req.body.startDate, classRoom: req.body.classRoom,status: "Accepted",
        $or: [
            {
                $and: [
                    {
                        "startTime": {
                            $lte: req.body.startTime
                        }
                    }, {
                        "endTime": {
                            $gte: req.body.startTime
                        }
                    }
                ]
            }, {
                $and: [
                    {
                        "startTime": {
                            $lte: req.body.endTime
                        }
                    }, {
                        "endTime": {
                            $gte: req.body.endTime
                        }
                    }
                ]
            }, {
                $and: [
                    {
                        "startTime": {
                            $gte: req.body.startTime
                        }
                    }, {
                        "endTime": {
                            $lte: req.body.endTime
                        }
                    }
                ]
            }
        ]
    }).then((docs) => {
        if (!docs) {
            newEvent.save().then((doc) => {
                req.io.emit("newEvent", decoded.name);
                console.log("New event requested.")
                res.json({ doc })
            }).catch((error) => {
                res.json({ error })
            })
        }else{
            res.json({error:"Clash Found"})
        }
    }).catch((err) => {
        res.json({ err })
    })
})

//search event
router.post('/event/search', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], 'secret')
    const value = req.body.title
    if (decoded.roles == "admin") {
        Event.find({
            $or: [
                {
                    classRoom: { $regex: value, $options: 'ig', }
                }, {
                    title: { $regex: value, $options: 'ig', }
                }, {
                    status: { $regex: value, $options: 'ig', }
                }, {
                    startDate: { $regex: value, $options: 'ig', }
                }
            ]
        }, (err, doc) => {
            if (err) {
                res.json({ err })
            } else {
                res.json({ doc })
            }
        })
    } else {
        Event.find({
            $or: [
                {
                    classRoom: { $regex: value, $options: 'ig', }, user_id: decoded._id,
                }, {
                    title: { $regex: value, $options: 'ig', }, user_id: decoded._id,
                }, {
                    status: { $regex: value, $options: 'ig', }, user_id: decoded._id,
                }, {
                    startDate: { $regex: value, $options: 'ig', }, user_id: decoded._id,
                }
            ]
        }, (err, doc) => {
            if (err) {
                res.json({ err })
            } else {
                res.json({ doc })
            }
        })
    }
})

//delete event
router.delete('/event/:id', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], 'secret')
    if (decoded.roles == "admin") {
        Event.deleteOne({ _id: req.params.id }).then((doc) => {
            res.json({ doc })
        }).catch((err) => {
            res.json({ err })
        })
    } else {
        Event.deleteOne({ _id: req.params.id, user_id: decoded._id }).then((doc) => {
            res.json({ doc })
        }).catch((err) => {
            res.json({ err })
        })
    }
})

//edit event
router.put('/event/:id', (req, res) => {
    if(req.body.status==="Accepted"){
        Event.findOne({ _id: req.params.id }).then((docs) => {
            Event.findOne({
                startDate: docs.startDate, classRoom: docs.classRoom,status: req.body.status,
                $or: [
                    {
                        $and: [
                            {
                                "startTime": {
                                    $lte: docs.startTime
                                }
                            }, {
                                "endTime": {
                                    $gte: docs.startTime
                                }
                            }
                        ]
                    }, {
                        $and: [
                            {
                                "startTime": {
                                    $lte: docs.endTime
                                }
                            }, {
                                "endTime": {
                                    $gte: docs.endTime
                                }
                            }
                        ]
                    }, {
                        $and: [
                            {
                                "startTime": {
                                    $gte: docs.startTime
                                }
                            }, {
                                "endTime": {
                                    $lte: docs.endTime
                                }
                            }
                        ]
                    }
                ]
            }).then((doc) => {
                if (!doc) {
                    Event.findOneAndUpdate({ _id: req.params.id }, req.body, { returnNewDocument: true, returnOriginal: false}).then((doc) => {
                        req.io.emit("eventStatusUpdate", doc);
                        res.json({ doc })
                    }).catch((err) => {
                        res.json({ err })
                    })
                } else {
                    res.json({ error: 'Clash Found' })
                }
            }).catch(err => {
                res.send('error: ' + err)
            })
        }).catch((err) => {
            res.json({ err })
        })
    }else{
            Event.findOneAndUpdate({ _id: req.params.id }, req.body, { returnNewDocument: true, returnOriginal: false}).then((doc) => {
                req.io.emit("eventStatusUpdate", doc);
                console.log(doc)
                res.json({ doc })
            }).catch((err) => {
                res.json({ err })
            })
        
    }
})

module.exports = router