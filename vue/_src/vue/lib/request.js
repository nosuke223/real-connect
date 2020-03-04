import axios from 'axios'

const BASE_URL = 'https://real-connect.herokuapp.com/api/v1';
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
