const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
});

//ye plungin username, email, password automatic userSchema me save krega
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);