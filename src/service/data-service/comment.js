"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer, comment) {
    const id = nanoid(MAX_ID_LENGTH);
    const newComment = Object.assign({id}, comment);

    offer.comments.push(newComment);
    return newComment;
  }

  drop(offer, commentId) {
    const dropComment = offer.comments.find((item) => item.id === commentId);

    if (!dropComment) {
      return null;
    }

    offer.comments = offer.comments.filter((item) => item.id !== commentId);
    return dropComment;
  }

  findAllByOffer(offer) {
    return offer.comments;
  }

  findAll() {
    return this._offers.reduce((acc, item) => acc.concat(item.comments), []);
  }
}

module.exports = CommentService;
