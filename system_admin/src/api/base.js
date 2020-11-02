import axios from "axios";
import jsonpAdapter from "axios-jsonp";
const domain = "http://realconnect.ddns.net:8080";

const apiInstance = axios.create({
  timeout: 5000
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
      DELETE: "delete"
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

  // zipcodeから住所取得（外部API JSONP利用）
  async getAddress(zipcode) {
    let api = axios.create();
    let { response, error } = [null, null];
    try {
      response = await api({
        url: "https://zipcloud.ibsnet.co.jp/api/search",
        method: "get",
        adapter: jsonpAdapter,
        params: {
          zipcode
        }
      });
      // 外部APIからエラーメッセージがある場合(形式不正等)
      if (response.data.message) {
        error = response.data.message;
      // 形式不正はないが結果が0件の場合
      } else if (!response.data.results) {
        error = "郵便番号から住所を取得できませんでした";
      }
    } catch (e) {
      error = e;
    }
    return { response, error };
  }
}
