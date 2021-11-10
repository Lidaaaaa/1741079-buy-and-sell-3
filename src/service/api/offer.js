"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validtator`);
const offerExist = require(`../middlewares/offer-exists`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/`, (req, res) => {
    const offers = service.findAll();
    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, offerExist(service), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, (req, res) => {
    const offer = service.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, offerExist(service), (req, res) => {
    const {offer} = req.locals;
    const updatedOffer = service.update(offer, req.body);

    return res.status(HttpCode.OK).json(updatedOffer);
  });

  route.delete(`/:offerId`, offerExist(service), (req, res) => {
    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  });
};
