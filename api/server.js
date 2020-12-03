const express = require("express");
const helmet = require("helmet");
const session = require('express-session');
const cors = require("cors");
const knexSessionStore = require('connect-session-knex')(session);

const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/auth-router.js')


const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const sessionConfig = {

  name: 'sksession',
  secret: 'keep it dark',
  cookie: {
    maxAge: 3600 * 1000,
    secure: false, //http vs. https
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,

  store: new knexSessionStore({
    knex: require('../database/connection'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 3600 * 1000
  })

}

server.use(session(sessionConfig))
server.use('/api/auth', authRouter)
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;