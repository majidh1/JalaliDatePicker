/*!
 * Jalalidatepicker v0.0.1
 * undefined
 *
 * Copyright 2020-present Majid Hooshiyar
 * Released under the MIT license
 *
 * Date: 2020-10-28T12:57:18.235Z
 */

(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var IS_BROWSER = typeof window !== 'undefined';
  var WINDOW = IS_BROWSER ? window : {};
  var IS_TOUCH_DEVICE = IS_BROWSER ? 'ontouchstart' in WINDOW.document.documentElement : false;
  var NAMESPACE = 'datepicker';

  window.console.warn(NAMESPACE);

})));
