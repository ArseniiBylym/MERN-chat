const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {type: String, required: [true, 'Name is required']},
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: value => {
                return /\S+@\S+\.\S+/.test(value);
            },
            message: `Not valid email`,
        },
        index: true,
    },
    avatar: {type: String, default: ''},
    googleId: {type: String},
    password: {type: String},
});

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj.__v
    return obj;
   }

module.exports = model('User', userSchema);