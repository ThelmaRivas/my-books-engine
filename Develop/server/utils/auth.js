// Update the auth middleware function to work with the GraphQL API
require("dotenv").config;
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const path = require("path");

// Set expiration date
const expiration = "2h";
// Set secret key
const secret = "supersecret";

module.exports = {
  // Error Handling
  AuthenticationError: new GraphQLError(
    "Authentication token is invalid, please log in again",
    {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    }
  ),

  // Auth Middleware function
  authMiddleware: function ({ req }) {
    console.log(`Verifying token for ${req.method} ${req.path}`);
    console.log("req.body.token:", req.body.token);
    console.log("req.query.token:", req.query.token);
    console.log("req.headers.authorization:", req.headers.authorization);

    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    const authHeader = req.headers.authorization;

    if (authHeader) {
      console.log("Token is in headers");
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      console.log("No token provided");
      return req;
    }

    // verify token and get user data out of it
    try {
      console.log("Token is:", token);
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log("Token verified, user is", req.user);
    } catch (err) {
      console.log("Invalid token", err);
      return req;
    }

    return req;
  },

  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
