"use strict";

class UserService {
  constructor(sequelize) {
    this._user = sequelize.models.User;
  }

  async create(data) {
    const user = await this._user.create(data);
    return user.get();
  }

  async findByEmail(email) {
    const user = await this._user.findOne({
      where: email
    });

    return user && user.get();
  }
}

module.exports = UserService;
