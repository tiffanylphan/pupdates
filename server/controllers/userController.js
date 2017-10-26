// require user database
// const db = require('../../db');
const Owners = require('../../db/Owners/ownerSchema');
const mongoose = require('mongoose');

module.exports = {

  getAllUsers: (req, res) => {
    Owners.find({}, (err, owners) => {
      if (err) {
        console.log('error getting all users ', err);
        res.status(500).send(err);
      }
      const ownerMap = {};

      owners.forEach((owner) => {
        ownerMap[owner._id] = owner;
      });
      res.status(200).send(ownerMap);
    });
  },

  getUser: (req, res) => {
    Owners.find({ fb_id: req.params.userid }, (err, owner) => {
      if (err) {
        console.log('error getting this user ', err);
        res.status(500).send(err);
      }
      res.status(200).send(owner);
    });
  },

  addUser: (req, res) => {
    const owner = new Owners({
      _id: new mongoose.Types.ObjectId(),
      fb_id: req.body.fb_id,
      name: req.body.name,
      age: req.body.age,
      location: req.body.location,
      picture: req.body.picture,
      bio: req.body.bio,
      rating: req.body.rating,
    });
    owner.save((err) => {
      if (err) {
        console.error('Could not save owner', err);
      }
    })
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },

  updateUser: (req, res) => {
    Owners.findOneAndUpdate({ _id: req.body._id }, {
      $set: {
        name: req.body.name,
        age: req.body.age,
        location: req.body.location,
        picture: req.body.picture,
        bio: req.body.bio,
        rating: req.body.rating,
      },
    }, { new: true }, (err, data) => {
      if (err) {
        console.log('update error', err);
        res.status(500).send(err);
      }
      res.status(201).send(data);
    });
  },

  removeUser: (req, res) => {
    Owners.remove({ _id: req.params.userid }, (err, data) => {
      if (err) {
        res.status(500).send('error removing user', err);
      }
      res.status(202).send('User successfully deleted');
    });
  },

  updateSeenDogs: (req, res) => {
    Owners.findOneAndUpdate({ _id: req.params.userid }, { $push: { dogsSeen: req.body.dogid } },
      { new: true } , (err, data) => {
      if(err) {
        console.log('push to dogsSeen error', err);
        res.status(500).send('error', err);
      }
      res.status(201).send(data);
    });
  },

  updateLikedDogs: (req, res) => {
    Owners.findOneAndUpdate({ _id: req.params.userid }, { $push: { dogsLiked: req.body.dogid } },
      { new: true } , (err, data) => {
      if(err) {
        console.log('push to dogsLiked error', err);
        res.status(500).send('error', err);
      }
      res.status(201).send(data);
    });
  },

  removeLikedDog: (req, res) => {
    Owners.findOneAndUpdate({ _id: req.params.userid }, { $pull: { dogsLiked: req.body.dogid } },
      { new: true } , (err, data) => {
        if(err) {
          console.log('remove dogs from dogsLiked error', err);
          res.status(500).send('error', err);
        }
        res.status(201).send(data);
    });
  },

};