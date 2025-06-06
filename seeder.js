const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');

//load env vars
dotenv.config({path: './config/config.env'});

//load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User')
//connect to Mongodb
mongoose.connect(process.env.MONGO_URI);


//read json file for dummy data
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);
const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`)
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`)
);



//import to database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        console.log(`data Imported...`.green.inverse);
        process.exit();

    } catch (err) {
        console.error(err);
    }
}


//delete all data from database
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        console.log(`data deleted ...`.red.inverse);
        process.exit();

    } catch (err) {
        console.error(err);
    }
}



if(process.argv[2] === '-i'){
    importData();
} else if(process.argv[2] === '-d'){
    deleteData();
}

