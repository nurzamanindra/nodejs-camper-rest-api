const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  sendTokenResponse(user, 200, res);
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});


// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});


// @desc      Forgot Password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  //check if user is exist
  const user = await User.findOne({email: req.body.email});

  if(!user){
    return next(
      new ErrorResponse(`There is no user with the email address ${req.body.email}`, 404)
    )
  }

  //generate reset token and save to existing user
  const resetToken = user.getResetPasswordToken();

  await user.save({validateBeforeSave : false});

  //create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    const options = {
      email: user.email,
      subject: 'Password reset token',
      message
    }
    await sendEmail(options);

    console.log(`Email sent to ${user.email}`);

    // res.status(200).json(
    //   {
    //     success: true,
    //     data : 'Email sent'
    //   }
    // )
  } catch (err) {
    console.log(err);

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    
    await user.save({validateBeforeSave: false});

    return next(new ErrorResponse('Email could not be sent', 500));
    
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Reset Password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt : Date.now()}
  });

  if(!user){
    return next(new ErrorResponse("Invalid Token", 400))
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
  
});

// @desc      Update User details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

  const fieldsToUpdate = {
    name : req.body.name,
    email: req.body.email
  }
  
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new : true,
    runValidators: true
  });


  res.status(200).json({
    success: true,
    data: user
  });
});


// @desc      Update Password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

  const {newPassword, currentPassword} = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if(!(await user.matchPassword(currentPassword))){
    return next(new ErrorResponse("Password is Incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});


// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
 res.cookie('token', 'none', {
   expires: new Date(Date.now() + 10 * 1000),
   httpOnly: true
 });

res.status(200).json({
   success: true,
   data: {}
 });
});

















// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};


