"use strict";

const express = require(`express`);
const path = require(`path`);
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const sequelize = require(`../service/lib/sequelize`);
const {HttpCode, DEFAULT_FRONT_SERVER_PORT} = require(`../constants`);

const port = process.env.PORT || DEFAULT_FRONT_SERVER_PORT;
const {SESSION_SECRET} = process.env;
const PUBLIC_DIR = `public`;
const TEMPLATE_DIR = `templates`;
const UPLOAD_DIR = `upload`;

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

app.use(express.urlencoded({extended: false}));
app.use(
    session({
      secret: SESSION_SECRET,
      store: mySessionStore,
      resave: false,
      proxy: true,
      saveUninitialized: false
    })
);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((_req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/404`));
app.use((_err, _req, res) => res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`));

app.set(`views`, path.resolve(__dirname, TEMPLATE_DIR));
app.set(`view engine`, `pug`);

app.listen(port);
