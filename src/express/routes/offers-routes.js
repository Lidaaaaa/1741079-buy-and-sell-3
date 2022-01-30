"use strict";

const {Router} = require(`express`);
const path = require(`path`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);

const {getAPI} = require(`../api`);
const {ensureArray, prepareErrors} = require(`../../utils`);
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

const getAddOfferData = () => {
  return api.getCategories();
};

const getEditOfferData = async (offerId) => {
  const [offer, categories] = await Promise.all([api.getOffer(offerId), api.getCategories()]);
  return [offer, categories];
};

const getViewOfferData = (offerId, comments) => {
  return api.getOffer(offerId, comments);
};

offersRouter.get(`/category/:id`, (_req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, async (_req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/ticket-add`, {categories});
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await getViewOfferData(id, true);
  res.render(`offers/ticket`, {offer, id});
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const offerData = {
    picture: file ? file.filename : ``,
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: ensureArray(body.categories)
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`my/my-tickets`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const categories = await getAddOfferData();
    res.render(`offers/ticket-add`, {
      categories,
      validationMessages
    });
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await getEditOfferData(id);
  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.post(`/edit/:id`, async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const offerData = {
    picture: file ? file.name : body[`old-image`],
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: ensureArray(body.categories)
  };

  try {
    await api.editOffer(id, offerData);
    res.redirect(`/my`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const [offer, categories] = await getEditOfferData(id);
    res.render(`offers/ticket-edit`, {id, offer, categories, validationMessages});
  }
});

offersRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/offers/${id}`);
  } catch (e) {
    const validationMessages = prepareErrors(e);
    const offer = await getViewOfferData(id, true);
    res.render(`offers/ticket`, {offer, id, validationMessages});
  }
});

module.exports = offersRouter;
