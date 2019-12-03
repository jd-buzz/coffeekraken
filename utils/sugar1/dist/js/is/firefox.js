"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFirefox;

/**
 * @name        isFirefox
 * @namespace       sugar.js.is
 * @type      Function
 *
 * Detect if is firefox
 *
 * @example 	js
 * import isFirefox from '@coffeekraken/sugar/js/is/firefox'
 * if (isFirefox()) {
 *   // do something cool
 * }
 *
 * @return    {Boolean}    true if is firefox, false if not
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
 */
function isFirefox() {
  return navigator.userAgent.indexOf("Firefox") > -1;
}

module.exports = exports.default;