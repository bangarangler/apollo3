const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const createToken = require("../../utils/createToken");

module.exports = {
  Query: {
    users: async (_, __, { db }, ____) => {
      return await db.db("apollo3").collection("users").find({}).toArray();
    },
    // me: async (parent, args, ctx, info) => {
    // },
  },
  Mutation: {
    register: async (parent, { options }, { db }, info) => {
      const { email, username, password, confirmPassword } = options;
      try {
        if (!email || !username || !password || !confirmPassword) {
          const error = "All Fields Are Required";
          return error;
        }
        if (confirmPassword.toString().trim() !== password.toString().trim()) {
          const errors = [
            {
              field: "password",
              message: "Passwords Don't Match!",
            },
          ];
          return errors;
        }
        const user = await db
          .db("apollo3")
          .collection("users")
          .findOne({ email });
        if (user) {
          // const error = { error: { error: "User Already Exists" } };
          // return "User Already Exists";
          return { error: "User Already Exists" };
        }
        console.log({ user });
        const salt = await bcrypt.genSalt(10);
        const hashedPW = await bcrypt.hash(password, salt);
        console.log({ hashedPW });
        const newUser = {
          username,
          email,
          password: hashedPW,
        };
        const haveNewUser = await db
          .db("apollo3")
          .collection("users")
          .insertOne(newUser);
        console.log("haveNewUser", haveNewUser.ops[0]);
        // make token
        console.log(createToken(haveNewUser.ops[0], process.env.SECRET, 86400));
        return {
          token: createToken(haveNewUser.ops[0], process.env.SECRET, 86400),
        };
      } catch (err) {
        console.log("err", err);
        const error = "Internal error something went wrong";
        return error;
      }
    },
  },
};
