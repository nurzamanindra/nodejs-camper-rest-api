const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});


//function to caculate aggregate AverageCost
//make this static so we can call by Course.getAverageCourse()
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  console.log('calculating average cost ..'.blue);
  
  const obj = await this.aggregate([
    {
      $match: {bootcamp: bootcampId}
    },
    {
      $group:{
        _id: '$bootcamp',
        averageCost: {$avg: '$tuition'}
      }
    }

  ])
  //result obj: 
  //[
  //  { _id: new ObjectId('5d725a037b292f5f8ceff787'), averageCost: 6500 }
  //]

  //update bootcamp data
  try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10

    });
  } catch (err) {
    console.error(err);
  }
}

//call aggregate getAverageCost before save
CourseSchema.pre('save', function(){
  this.constructor.getAverageCost(this.bootcamp)
})

//call aggregate getAverageCost before remove
CourseSchema.pre('deleteOne', { document: true, query: false } , function(next){
  this.constructor.getAverageCost(this.bootcamp)
  next()
})

module.exports = mongoose.model('Course', CourseSchema);