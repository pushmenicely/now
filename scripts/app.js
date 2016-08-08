'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global PushClient */
/* eslint-env browser */

var AppController = function () {
  function AppController() {
    var _this = this;
    _classCallCheck(this, AppController);

    // Define a different server URL here if desire.
//    this._PUSH_SERVER_URL = '';
//    this._API_KEY = 'AIzaSyBBh4ddPa96rQQNxqiq_qQj7sq1JdsNQUQ';

    this._applicationKeys = {
//      publicKey: window.base64UrlToUint8Array('BDd3_hVL9fZi9Ybo2UUzA284WG5FZR30_95YeZJsiA' + 'pwXKpNcF1rRPF3foIiBHXRdJI2Qhumhf6_LFTeZaNndIo'),
//      privateKey: window.base64UrlToUint8Array('xKZKYRNdFFn8iQIF2MH54KTfUHwH105zBdzMR7SI3xI')
    };
    this.ready = Promise.resolve();
  }

  _createClass(AppController, [{
    key: 'registerServiceWorker',
    value: function registerServiceWorker() {
      this._stateChangeListener = this._stateChangeListener.bind(this);
      this._subscriptionUpdate = this._subscriptionUpdate.bind(this);

      this._pushClient = new PushClient(this._stateChangeListener, this._subscriptionUpdate/*, this._applicationKeys.publicKey*/);

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
          console.info('on');
        } else {
          console.info('off');
        }
      }

      if (typeof state.pushEnabled !== 'undefined') {
        if (state.pushEnabled) {
          console.info('on');
        } else {
          console.info('off');
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
    key: '_subscriptionUpdate',
    value: function _subscriptionUpdate(subscription) {
      this._currentSubscription = subscription;
      if (!subscription) {
        // Remove any subscription from your servers if you have
        // set it up.
        
	//this._sendPushOptions.style.opacity = 0;
        return;
      }

      // This is too handle old versions of Firefox where keys would exist
      // but auth wouldn't
      var payloadTextfieldContainer = document.querySelector('.js-payload-textfield-container');
      var subscriptionObject = JSON.parse(JSON.stringify(subscription));
      if (subscriptionObject && subscriptionObject.keys && subscriptionObject.keys.auth && subscriptionObject.keys.p256dh) {
        //payloadTextfieldContainer.classList.remove('hidden');
      } else {
        //payloadTextfieldContainer.classList.add('hidden');
      }

      console.log(subscriptionObject);

      // this.updatePushInfo();

      // Display the UI
      // this._sendPushOptions.style.opacity = 1;
    }
  }]);

  return AppController;
}();

if (window) {
  window.AppController = AppController;
}
