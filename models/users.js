import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true
    } ,
    email: {
        type: String,
        unique: true,
        required:true
    },
    password:{
        type:String,
        required: true
    },
    salt: String
});

const infoUserSchema = new mongoose.Schema({
    personalInfo: {
    fullName:{
        type:String,
        required: true} ,
    dateOfBirth:{
        type:Date,
        required: true} ,
    placeOfBirth: {
        type:Date,
        required: true} ,
    citizen: {
        type:String,
        required: true} ,
    education: {
        type:String,
        required: true} ,
},
    workInfo: {
        skills: [String],
        projects: [{
            projectName: String,
            description: String,
            role: String,
            startDate: String,
            endDate: String,
        }],
        experience:[ {
            companyName: String,
            role: String,
            startDate: Date,
            endDate: Date,

        }]
    },
    additionalInfo: {
        hobbies: [String],
        goals:[String]
    },
    user: userSchema
});


const UserModel = mongoose.model('users', infoUserSchema);

export default UserModel;