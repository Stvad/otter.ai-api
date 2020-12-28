"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createClient = exports.OtterApi = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const API_BASE_URL = 'https://otter.ai/forward/api/v1';
const AWS_S3_URL = 'https://s3.us-west-2.amazonaws.com';
const CSRF_COOKIE_NAME = 'csrftoken';

class OtterApi {
  constructor(options = {}) {
    this.login = async () => {
      const {
        email,
        password
      } = this.options;

      if (!email || !password) {
        throw new Error("Email and/or password were not given. Can't perform authentication to otter.ai");
      }

      const csrfResponse = await (0, _axios.default)({
        method: 'GET',
        url: `${API_BASE_URL}/login_csrf`
      });
      const {
        cookieValue: csrfToken,
        cookieHeader: csrfCookie
      } = (0, _utils.getCookieValueAndHeader)(csrfResponse.headers['set-cookie'][0], CSRF_COOKIE_NAME);
      const response = await (0, _axios.default)({
        method: 'GET',
        url: `${API_BASE_URL}/login`,
        params: {
          username: email
        },
        headers: {
          authorization: `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`,
          'x-csrftoken': csrfToken,
          cookie: csrfCookie
        },
        withCredentials: true
      });
      const cookieHeader = `${response.headers['set-cookie'][0]}; ${response.headers['set-cookie'][1]}`;
      ({
        cookieValue: this.csrfToken
      } = (0, _utils.getCookieValueAndHeader)(response.headers['set-cookie'][0], CSRF_COOKIE_NAME));
      this.user = response.data.user;
      _axios.default.defaults.headers.common.cookie = cookieHeader; //todo: interferes with alfred :( `
      // console.log('Successfuly logged in to Otter.ai');

      return response;
    };

    this.getSpeeches = async () => {
      const {
        data
      } = await (0, _axios.default)({
        method: 'GET',
        url: `${API_BASE_URL}/speeches`,
        params: {
          userid: this.user.id
        }
      });
      return data.speeches;
    };

    this.getSpeech = async speech_id => {
      const {
        data
      } = await (0, _axios.default)({
        method: 'GET',
        url: `${API_BASE_URL}/speech`,
        params: {
          speech_id,
          userid: this.user.id
        }
      });
      return data.speech;
    };

    this.speechSearch = async query => {
      const {
        data
      } = await (0, _axios.default)({
        method: 'GET',
        url: `${API_BASE_URL}/speech_search`,
        params: {
          query,
          userid: this.user.id
        }
      });
      return data.hits;
    };

    this.validateUploadService = () => (0, _axios.default)({
      method: 'OPTIONS',
      url: `${AWS_S3_URL}/speech-upload-prod`,
      headers: {
        Accept: '*/*',
        'Access-Control-Request-Method': 'POST',
        Origin: 'https://otter.ai',
        Referer: 'https://otter.ai/'
      }
    });

    this.uploadSpeech = async file => {
      const uploadOptionsResponse = await (0, _axios.default)({
        method: 'GET',
        url: `${API_BASE_URL}/speech_upload_params`,
        params: {
          userid: this.user.id
        },
        headers: {
          Accept: '*/*',
          Connection: 'keep-alive',
          Origin: 'https://otter.ai',
          Referer: 'https://otter.ai/'
        }
      });
      delete uploadOptionsResponse.data.data.form_action;
      const xmlResponse = await (0, _requestPromise.default)({
        method: 'POST',
        uri: `${AWS_S3_URL}/speech-upload-prod`,
        formData: { ...uploadOptionsResponse.data.data,
          file
        }
      });
      const {
        Bucket,
        Key
      } = await (0, _utils.parseXml)(xmlResponse);
      const finishResponse = await (0, _axios.default)({
        method: 'POST',
        url: `${API_BASE_URL}/finish_speech_upload`,
        params: {
          bucket: Bucket,
          key: Key,
          language: 'en',
          country: 'us',
          userid: this.user.id
        },
        headers: {
          'x-csrftoken': this.csrfToken
        }
      });
      return finishResponse.data;
    };

    this.options = options;
    this.user = {};
    this.csrfToken = '';
  }

}
/**
 * @param options
 * @returns {Promise<OtterApi>}
 */


exports.OtterApi = OtterApi;

const createClient = async options => {
  const client = new OtterApi(options);
  await client.login();
  return client;
};

exports.createClient = createClient;
var _default = OtterApi;
exports.default = _default;