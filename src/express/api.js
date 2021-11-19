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

  getOffers() {
    return this._load(`/offers`);
  }

  getOffer(id) {
    return this._load(`/offers/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories() {
    return this._load(`/categories`);
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
