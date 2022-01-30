"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validtator`);
const offerExist = require(`../middlewares/offer-exists`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result =
      limit || offset ? await service.findPage({limit, offset}) : await service.findAll(comments);

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:offerId`, offerExist(service), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await service.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, [offerExist(service), offerValidator], async (req, res) => {
    const {offer} = res.locals;
    const updatedOffer = await service.update(offer.id, req.body);

    return res.status(HttpCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, offerExist(service), async (_req, res) => {
    const {offer} = res.locals;
    const droppedOffer = await service.drop(offer.id);

    return res.status(HttpCode.OK).json(droppedOffer);
  });
};
