const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder')
const path = require('path');

// @desc      Get all bootcamps, with or without query params
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
  res
    .status(200)
    .json(res.advancedResults);
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Create new bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  
  //add user id to request body
  req.body.user = req.user.id;

  //check user published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});

  //if user is not admin, can only add one post
  if(publishedBootcamp && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400)

    );
  }
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

// @desc      Update bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

  let bootcamp = await Bootcamp.findById(req.params.id);


  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if(bootcamp.user.toString()  !== req.user.id || req.user.role !=='admin'){
    return next(
      new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401)
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if(bootcamp.user.toString()  !== req.user.id || req.user.role !=='admin'){
    return next(
      new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401)
    );
  }


  await bootcamp.deleteOne();

  res.status(200).json({ success: true, data: {} });
});


// @desc      Get bootcamps within radius
// @route     GET /api/v1/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  
  const {zipcode, distance} = req.params;

  //get latitude/longitude from zipcode
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
console.log(loc)

  //calc earth radius
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
console.log(radius)
  const bootcamps = await Bootcamp.find(
    {
      location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    }
  );

  res.status(200).json({
    success: true,
    cont: bootcamps.length,
    data: bootcamps
  });
});


// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
exports.bootcampUploadPhoto = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);

  if(!bootcamp){
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404))
  }

  if(bootcamp.user.toString()  !== req.user.id || req.user.role !=='admin'){
    return next(
      new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401)
    );
  }

  if(!req.files){
    return next(new ErrorResponse(`please upload a file`,404))
  }

  const file = req.files.file;
  
  //check if image is a photo
  if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse(`please upload an image file`,404))
  }

  //check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });

  });

});