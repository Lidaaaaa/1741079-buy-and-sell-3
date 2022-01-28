"use strict";

const axios = require(`axios`);

const {DEFAULT_API_PORT, API_TIMEOUT, API_PREFIX} = require(`../constants`);

const port = process.env.API_PORT || DEFAULT_API_PORT;
const defaultURL = `http://localhost:${port}${API_PREFIX}/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getOffers({comments, limit, offset}) {
    return this._load(`/offers`, {params: {comments, offset, limit}});
  }

  getOffer(id, {comments}) {
    return this._load(`/offers/${id}`, {params: {comments}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: count});
  }

  createOffer(data) {
    return this._load(`/offers`, {
      method: `POST`,
      data
    });
  }

  getComments() {
    return this._load(`/comments`);
  }
}

const defaultAPI = new API(defaultURL, API_TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
