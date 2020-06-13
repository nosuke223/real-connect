import axios from "axios";
const domain = "http://localhost:8080";

const apiInstance = axios.create({
  timeout: 5000,
});

export default class ApiRequest {
  // resource 取得したいリソースの名称 http://localhost:3001/api/v1/sytem_admins/users のusersに当たる
  // urlNamseSpace urlのドメインの後のリソース名称までの名前空間部分のurl api/v1/sytem_admins にあたる
  constructor(resource, cookie, urlNameSpace = "api/v1/system_admins") {
    this.resource = resource || undefined;
    if (cookie && cookie.get("Authorization")) {
      apiInstance.defaults.headers.common["Authorization"] = cookie.get(
        "Authorization"
      );
    }
    apiInstance.defaults.baseURL = `${domain}/${urlNameSpace}`;
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
