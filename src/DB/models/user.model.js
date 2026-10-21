import mongoose, { Schema } from "mongoose";
import { GenderEnum, RoleEnum } from "../../common/enum/user.enum.js";

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true,
    },
    lastname: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    DOB: Date,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    profilePicPath: String,
    coverPicPath: [String],
    deletedAt: Date,
    changeCredencialesTime: Date,
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
  },
);

userSchema
  .virtual("username")
  .get(function () {
    return `${this.firstname} ${this.lastname}`;
  })
  .set(function (val) {
    const [firstname, lastname] = val.split(" ");
    this.firstname = firstname;
    this.lastname = lastname;
  });

const userModel = mongoose.model("Users", userSchema);

export default userModel;
