const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

 // @desc      Get courses
 // @route     GET /api/v1/courses
 // @route     GET /api/v1/bootcamps/:bootcampId/courses
 // @access    Private
 exports.getCourses =  asyncHandler(async (req, res, next) => {

    // GET /api/v1/bootcamps/:bootcampId/courses
    if(req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId});

        return res.status(200).json({
            success: true,
            count : courses.length,
            data: courses
        })

    } else { //GET /api/v1/courses
       res.status(200).json(res.advancedResults) 
    }
    
});

 
 // @desc      Get Single course
 // @route     GET /api/v1/courses/:id
 // @access    Private
 exports.getCourse =  asyncHandler(async (req, res, next) => {

   const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
   });

   if(!course){
    return next(
        new ErrorResponse(`No course with id ${req.params.id}`, 404)
    );
   }

    res.status(200).json({
        success: true,
        data: course
    })
 }
 );


 // @desc      Add course
 // @route     POST /api/v1/bootcamps/:bootcampId/courses
 // @access    Private
 exports.addCourse =  asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
 
    if(!bootcamp){
     return next(
         new ErrorResponse(`No bootcamp with id ${req.params.bootcampId}`, 404)
     );
    }

    //check if user is the owner of bootcamp and is also has admin role
    if(bootcamp.user.toString() !== req.user.id && req.user.role !=='admin'){
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
         401)
        )
    }

    const course = await Course.create(req.body)
 
     res.status(200).json({
         success: true,
         data: course
     })
  }
  );


  
 // @desc      Update Single course
 // @route     PUT /api/v1/courses/:id
 // @access    Private
 exports.updateCourse =  asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);
 
    if(!course){
     return next(
         new ErrorResponse(`No course with id ${req.params.id}`, 404)
     );
    }

    if(course.user.toString() != req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`,
         401)
        )
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true
    });
 
     res.status(200).json({
         success: true,
         data: course
     })
  }
  );

  
 // @desc      Delete Single course
 // @route     DELETE /api/v1/courses/:id
 // @access    Private
 exports.deleteCourse =  asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);
 
    if(!course){
     return next(
         new ErrorResponse(`No course with id ${req.params.id}`, 404)
     );
    }

    if(course.user.toString() != req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`,
         401)
        )
    }

    await course.deleteOne();
 
     res.status(200).json({
         success: true,
         data: {}
     })
  }
  );