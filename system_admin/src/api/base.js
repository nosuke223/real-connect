import axios from "axios";
const domain = "http://localhost:8080";

const apiInstance = axios.create({
  baseURL: `${domain}/api/v1`,
  timeout: 5000,
});

export default class ApiRequest {
  constructor(resource, cookie) {
    this.resource = resource || undefined;
    if (cookie && cookie.get("Authorization")) {
      apiInstance.defaults.headers.common["Authorization"] = cookie.get(
        "Authorization"
      );
    }
    this.HTTPMethods = {
      GET: "get",
      POST: "post",
      PUT: "put",
      PATCH: "patch",
      DELETE: "delete",
    };
  }
  async baseRequest(HTTPMethods, resource, body) {
    let { response, error } = [null, null];
    try {
      response = await apiInstance[HTTPMethods](resource, body);
    } catch (e) {
      error = e;
    }
    return { response, error };
  }
  async requestWrapper(HTTPMethods, resource, body) {
    const { response, error } = await this.baseRequest(
      HTTPMethods,
      resource,
      body
    );
    return { response, error };
  }

  // Rails側の共通的なapiにリクエストする関数群を定義
  index(body) {
    return this.requestWrapper(this.HTTPMethods.GET, this.resource, body);
  }
  create(body) {
    return this.requestWrapper(this.HTTPMethods.POST, this.resource, body);
  }
  show(id, body) {
    const uri = `${this.resource}/${id}/`;
    return this.requestWrapper(this.HTTPMethods.GET, uri, body);
  }
  update(id, body) {
    const uri = `${this.resource}/${id}/`;
    return this.requestWrapper(this.HTTPMethods.PUT, uri, body);
  }
  partialUpdate(id, body) {
    const uri = `${this.resource}/${id}/`;
    return this.requestWrapper(this.HTTPMethods.PATCH, uri, body);
  }
  destroy(id) {
    const uri = `${this.resource}/${id}/`;
    return this.requestWrapper(this.HTTPMethods.DELETE, uri);
  }
}
