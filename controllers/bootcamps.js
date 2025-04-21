const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder')

// @desc      Get all bootcamps, with or without query params
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
  let query;

  //copy req.query
  const reqQuery = {...req.query};
  console.log(reqQuery)

  //fields to exclude 
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  //create query string 
  let queryStr = JSON.stringify(reqQuery);

  //create operator $gt , $gte, ...
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //find resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //construct select field 
  if(req.query.select){
    //will result something like this:
    //from : ?select=name,desc,housing --> 'name desc housing'
    const fields = req.query.select.split(',').join(' ');

    query = query.select(fields);
  }

  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);

  } else {
    query.sort('-createdAt');
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const total = await Bootcamp.countDocuments();

  //construct pagination query
  query.skip(startIndex).limit(limit);

  //exec the query builder
  const bootcamps = await query;

  //construct pagination object for response
  const pagination = {};
  
  //next page
  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  //prev page
  if(startIndex > 0) {
    pagination.prev = {
      page : page - 1,
      limit
    }
  }

  res
    .status(200)
    .json({ 
      success: true, 
      count: bootcamps.length, 
      pagination,
      data: bootcamps });
});

// @desc      Get single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

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
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

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