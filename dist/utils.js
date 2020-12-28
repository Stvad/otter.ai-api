"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseXml = exports.getCookieValueAndHeader = void 0;

var _xml2js = require("xml2js");

const getCookieValueAndHeader = (cookieHeader, cookieName) => {
  const match = cookieHeader.match(new RegExp(`${cookieName}=(?<value>.*?);`));
  return {
    cookieValue: match[1],
    cookieHeader: match[0]
  };
};

exports.getCookieValueAndHeader = getCookieValueAndHeader;

const parseXml = xml => {
  return new Promise((resolve, reject) => {
    (0, _xml2js.parseString)(xml, {
      explicitArray: false,
      explicitRoot: false
    }, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

exports.parseXml = parseXml;