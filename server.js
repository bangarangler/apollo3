require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const main = async () => {
  try {
    const MongoClient = require("mongodb").MongoClient;
    let db;
    MongoClient.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@apollo3.dzuts.mongodb.net/apollo3?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, database) => {
        if (err) {
          return console.error(err);
        }
        db = database;
      }
    );

    const app = express();
    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: {
        endpoint: "/graphql",
      },
      context: async ({ req, res }) => {
        return { db, req, res };
      },
    });

    server.applyMiddleware({ app });

    console.log("database connected");
    try {
      const port = process.env.PORT || 5000;
      app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (err) {
      console.log("err", err);
    }
  } catch (err) {
    console.log("err", err);
  }
};

main();
