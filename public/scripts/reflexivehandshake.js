"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ReflexiveHandshake_Registered = _ReflexiveHandshake_Registered || false;

var ReflexiveHandshake = ReflexiveHandshake || function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, null, [{
    key: "_handshakeSendMyInfo",
    value: function _handshakeSendMyInfo(appId, sourceWindow, sourceOrigin) {
      var data = { Identity: {
          url: window.location.href,
          appId: appId
        } };
      sourceWindow.postMessage(JSON.stringify(data), "*");
    }
  }, {
    key: "register",
    value: function register(appId) {
      if (!_ReflexiveHandshake_Registered) {
        _ReflexiveHandshake_Registered = true;
        window.addEventListener("message", function (e) {
          if (e.data === "AppViewHandshake:WhoAreYou?") {
            ReflexiveHandshake._handshakeSendMyInfo(appId, e.source, e.origin);
          }
        });
      }
    }
  }]);

  return _class;
}();
