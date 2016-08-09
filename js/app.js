'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global PushClient */
/* eslint-env browser */

// Converts the URL-safe base64 encoded |base64UrlData| to an Uint8Array buffer.
function base64UrlToUint8Array(base64UrlData) {
  var padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
  var base64 = (base64UrlData + padding).replace(/\-/g, '+').replace(/_/g, '/');

  var rawData = window.atob(base64);
  var buffer = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

var AppController = function () {
  function AppController() {
    var _this = this;
    _classCallCheck(this, AppController);

    // Define a different server URL here if desire.
    this._PUSH_SERVER_URL = '';
    this._API_KEY = 'AIzaSyBGYBrdXl54d5ekpqsdFcE_PlBjrpiAgPg';

    this.ready = Promise.resolve();


    // _this2._pushClient.subscribeDevice();
  }

  _createClass(AppController, [{
    key: 'initialize',
    value: function initialize() {
      var _this1 = this;

      this._stateChangeListener = this._stateChangeListener.bind(this);
      this._subscriptionUpdate = this._subscriptionUpdate.bind(this);

      this._pushClient = new PushClient(this._stateChangeListener, this._subscriptionUpdate);
    }
  }, {
    key: 'registerServiceWorker',
    value: function registerServiceWorker() {
      var _this2 = this;

      // Check that service workers are supported
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js').catch(function (err) {
          console.error(err);
        });
      } else {
        console.error(err);
      }
    }
  }, {
    key: '_stateChangeListener',
    value: function _stateChangeListener(state, data) {
      if (typeof state.interactive !== 'undefined') {
        if (state.interactive) {
          console.info('interactive: on');
        } else {
          console.info('interactive: off');
        }
      }

      if (typeof state.pushEnabled !== 'undefined') {
        if (state.pushEnabled) {
          console.info('push: on');
        } else {
          console.info('push: off');
        }
      }

      switch (state.id) {
        case 'UNSUPPORTED':
          console.error('unsupported', data);
          break;
        case 'ERROR':
          console.info('error', data);
          break;
        default:
          break;
      }
    }
  }, {
    key: '_sendStatusUpdate',
    value: function _subscriptionUpdate(data) {
      if (XMLHttpRequest) {
        // start a manual ajax-request
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {
          if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            //done
          }
        }

        // generate data
        queryString = [];
        for (key in data) {
          queryString.push(key + '=' + data.status);
        }
        queryString = queryString.join('&');
        if (queryString.length) {
          queryString = '&' + queryString;
        }

        // send request
        xmlhttp.withCredentials = true;
        xmlhttp.open("GET","/index.php?action-notifications=setUserPushNotificationConfig&main=notifications&view=ajax_result&asmain=false"+queryString,true);
        xmlhttp.send();
      }
    }
  }, {
    key: '_subscriptionUpdate',
    value: function _subscriptionUpdate(subscription) {
      this._currentSubscription = subscription;

      var data = {
        status: 'denied'
      };

      // This is to handle old versions of Firefox where keys would exist
      // but auth wouldn't
      var subscriptionObject = JSON.parse(JSON.stringify(subscription));

      if (subscriptionObject && subscriptionObject.endpoint) {
        var endpointArr = subscriptionObject.endpoint.split('/');
        var token = endpointArr.length > 1 ? endpointArr[endpointArr.length - 1] : '';

        if (token) {
          data.status = 'granted';
          data.token = token;
        }
      }
      this._sendStatusUpdate(data);
    }
  }]);

  return AppController;
}();

if (window) {
  window.AppController = AppController;
}
