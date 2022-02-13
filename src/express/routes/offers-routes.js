"use strict";

const {Router} = require(`express`);
const csrf = require(`csurf`);

const {getAPI} = require(`../api`);
const {ensureArray, prepareErrors} = require(`../../utils`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);

const offersRouter = new Router();
const api = getAPI();
const csrfProtection = csrf();

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

offersRouter.get(`/category/:id`, (req, res) => {
  const {user} = req.session;

  res.render(`offers/category`, {user});
});

offersRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  res.render(`offers/ticket-add`, {
    categories,
    user,
    csrfToken: req.csrfToken()
  });
});

offersRouter.get(`/:id`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const offer = await getViewOfferData(id, true);

  res.render(`offers/ticket`, {offer, id, user});
});

offersRouter.post(`/add`, auth, csrfProtection, upload.single(`avatar`), async (req, res) => {
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
    const {user} = req.session;
    const categories = await getAddOfferData();

    res.render(`offers/ticket-add`, {
      categories,
      validationMessages,
      user
    });
  }
});

offersRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [offer, categories] = await getEditOfferData(id);

  res.render(`offers/ticket-edit`, {
    offer,
    categories,
    user,
    csrfToken: req.csrfToken()
  });
});

offersRouter.post(`/edit/:id`, auth, csrfProtection, async (req, res) => {
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
    const {user} = req.session;
    const [offer, categories] = await getEditOfferData(id);

    res.render(`offers/ticket-edit`, {
      id,
      offer,
      categories,
      user,
      validationMessages
    });
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
    const {user} = req.session;
    const offer = await getViewOfferData(id, true);

    res.render(`offers/ticket`, {
      offer,
      id,
      validationMessages,
      user
    });
  }
});

module.exports = offersRouter;
