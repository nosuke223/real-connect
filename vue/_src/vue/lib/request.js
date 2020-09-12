import axios from 'axios'
import jsonpAdapter from 'axios-jsonp'

let BASE_URL = 'https://real-connect.herokuapp.com/api/v1';

if (document.domain=='localhost') {
  BASE_URL = 'http://localhost:8080/api/v1';
}

// const BASE_URL = 'http://localhost:4000/api/v1';

let authorizationToken = null;

/**
 * APIのエラークラス
 */
class APIError {
  constructor({ result, message }) {
    this.result = result;
    this.message = message;
  }

  /**
   * エラーメッセージ
   */
  get messages() {
    if (this.result) {
      return this.result.error.message;
    }
    return this.message;
  }

  static get Unreachable() {
    return new APIError({ message: 'ネットワーク環境を確認してください。' });
  }

  static get Maintenance() {
    return new APIError({ message: '現在、メンテナンス中です。' });
  }

  static get SessionExpired() {
    return new APIError({ message: 'もう一度ログインしてください。' });
  }
}

/**
 * 認証トークンを設定
 */
export function setAuthorizationToken(token) {
  authorizationToken = token;
}

/**
 * タイムアウトの設定
 */
function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error());
    }, ms);

    promise.then(resolve, reject).catch(error => console.log(error));
  });
}

/**
 * レスポンスの制御を行う
 */
async function handleResponse(response) {
  if (!response) {
    return { error: APIError.Unreachable }
  }

  const { status } = response;

  if (status === 503) {
    return { error: APIError.Maintenance }
  }

  if (status === 401) {
    return { error: APIError.SessionExpired }
  }

  if (status >= 400) {
    return {
      error: new APIError({ result: response.data }),
    };
  }

  let authorization = response.headers.authorization;
  return { data: response.data, authorization };
}

/**
 * APIのリクエストを行う
 */
export async function request(
  method,
  path,
  { data = {}, params = {} } = {},
) {
  let headers = {
    Authorization: authorizationToken
  }
  let response = null;

  try {
    response = await timeout(60000, axios({
      method,
      url: BASE_URL + path,
      data,
      params,
      headers,
    })
    .then(function(r) {
      return r;
    }.bind(this))
    .catch(function(e) {
      return e.response;
    }.bind(this)));
  } catch (e) {
    response = null;
  }

  return handleResponse(response);
}

/**
 * 郵便番号での住所検索（外部API）
 */
export async function getAddress(zipcode) {
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
