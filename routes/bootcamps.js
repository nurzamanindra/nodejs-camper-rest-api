const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampUploadPhoto
} = require('../controllers/bootcamps');

const { protect, authorize } = require('../middleware/auth');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

//include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

//re-route to other resource routers
router.use('/:bootcampId/courses', courseRouter);

//bootcamp routers
router.route('/radius/:zipcode/:distance')
  .get(getBootcampsInRadius);

router.route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampUploadPhoto);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'),  updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'),  deleteBootcamp);

module.exports = router;
