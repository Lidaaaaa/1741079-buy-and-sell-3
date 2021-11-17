"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exists`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const comments = commentService.findAllByOffer(offer);

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(offer, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });
};
