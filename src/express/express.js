"use strict";

const express = require(`express`);
const path = require(`path`);

const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {HttpCode, DEFAULT_FRONT_SERVER_PORT} = require(`../constants`);

const port = process.env.PORT || DEFAULT_FRONT_SERVER_PORT;
const PUBLIC_DIR = `public`;
const TEMPLATE_DIR = `templates`;
const UPLOAD_DIR = `upload`;

const app = express();

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
