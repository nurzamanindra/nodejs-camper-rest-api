const express = require('express');
const { getCourses } = require('../controllers/courses')


// create router object and config to handle merge params
const router = express.Router({mergeParams: true});


router.route('/')
    .get(getCourses);

module.exports = router;