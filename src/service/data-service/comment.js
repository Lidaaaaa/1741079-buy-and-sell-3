"use strict";

class CommentService {
  constructor(sequelize) {
    this._offer = sequelize.models.Offer;
    this._comment = sequelize.models.Comment;
  }

  async create(offerId, comment) {
    return await this._comment.create({offerId, ...comment});
  }

  async drop(id) {
    const deletedComment = await this._comment.destroy({
      where: {id}
    });

    return !!deletedComment;
  }

  async findAllByOffer(offerId) {
    const comments = await this._comment.findAll({
      where: {offerId},
      raw: true
    });

    return comments;
  }

  findAll() {
    return this._comment.findAll({raw: true});
  }
}

module.exports = CommentService;
