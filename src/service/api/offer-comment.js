"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../../constants`);
const commentValidator = require(`../middlewares/comment-validator`);
const offerExist = require(`../middlewares/offer-exists`);

module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  route.get(`/:offerId/comments`, offerExist(offerService), async (_req, res) => {
    const {offer} = res.locals;
    const comments = await commentService.findAllByOffer(offer.id);

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(
      `/:offerId/comments`,
      [offerExist(offerService), commentValidator],
      async (req, res) => {
        const {offerId} = req.params;
        const comment = await commentService.create(offerId, req.body);

        return res.status(HttpCode.CREATED).json(comment);
      }
  );

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.OK).json(deletedComment);
  });
};
