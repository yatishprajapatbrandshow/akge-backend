const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error(
                    "Strong password is required (A-Z, a-z, 1-9, special character) must 8 digit"
                );
            }
        },
    },
    type: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!value) {
                throw new Error("emailId is required");
            } else if (!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        },
    },
    mobile: {
        type: String,
    },
    pincode: {
        type: String,
    },
    lastLogin: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, timeseries: true });

adminSchema.methods.getJWT = function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return token;
    } catch (error) {
        throw new Error("Error while getting jwt token");
    }
};

adminSchema.methods.checkBcryptPassword = async function (password) {
    try {
        const isPasswordValid = await bcrypt.compare(password, this.password);
        return isPasswordValid;
    } catch (error) {
        throw new Error("Error while checking password");
    }
};

adminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('Admin', adminSchema);
