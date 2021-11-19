"use strict";

const {Router} = require(`express`);
const path = require(`path`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);

const {getAPI} = require(`../api`);
const UPLOAD_DIR = `../upload/img/`;

const offersRouter = new Router();
const api = getAPI();
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

offersRouter.get(`/category/:id`, (_req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, async (_req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/ticket-add`, {categories});
});

offersRouter.get(`/:id`, (_req, res) => res.render(`offers/ticket`));

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const offerData = {
    picture: file ? file.filename : ``,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    category: body.category
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([api.getOffer(id), api.getCategories()]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

module.exports = offersRouter;
