(function(){
  var _0x1a2b=['c3BsaXQ','cmV2ZXJzZQ==','am9pbg==','cGFyc2U=','YXRvYg==','bGVuZ3Ro','bWFw','Y2hhckF0','Y29kZVBvaW50','c3RyaW5n','Y2hhckNvZGVBdA=='];
  function _0xaa1b(_0x21b5,_0x3e6b){_0x21b5=_0x21b5-0x0;var _0x1a2b1d=_0x1a2b[_0x21b5];return _0x1a2b1d;}
  var _0xabcde = "W3siYSI6IkFweUl6YVN5QXZKMnNuRTJXS01aTUROcElnaDZUSVhnQlpqV25uV0VvIiwiYiI6ImRvbGxpc3Rhbm5vdGVzLmZpcmViYXBwLmNvbSIsImMiOiJkb2xsaXN0YW5ub3RlcyIsImQiOiJkb2xsaXN0YW5ub3Rlcy5maXJlYmFzZXN0b3JhZ2UuYXBwIiwiZSI6IjYwMTA2OTQxNTY2NCIsImYiOiIxOjYwMTA2OTQxNTY2NDp3ZWI6YWRmOTcyOTU3NDM2YjAxYmM2NjM1IiwiZyI6IkctNVE1UVpGTUdRRiJ9XQ==";
  var _0x12345 = function(str){return window.atob?atob(str):Buffer.from(str,'base64').toString('binary');};
  var _0x67890 = function(s){return JSON.parse(s)[0];};
  var _validateString = function(s){return typeof s === 'string' && s.length > 0;};
  var _sanitizeInput = function(s){return s.replace(/[^a-zA-Z0-9_\-.:/]/g, '');};
  var _0xkey = _0x67890(_0x12345(_0xabcde));
  var _config = {
    apiKey: _validateString(_0xkey['a'])?_sanitizeInput(_0xkey['a']):'',
    authDomain: _validateString(_0xkey['b'])?_sanitizeInput(_0xkey['b']):'',
    projectId: _validateString(_0xkey['c'])?_sanitizeInput(_0xkey['c']):'',
    storageBucket: _validateString(_0xkey['d'])?_sanitizeInput(_0xkey['d']):'',
    messagingSenderId: _validateString(_0xkey['e'])?_sanitizeInput(_0xkey['e']):'',
    appId: _validateString(_0xkey['f'])?_sanitizeInput(_0xkey['f']):'',
    measurementId: _validateString(_0xkey['g'])?_sanitizeInput(_0xkey['g']):''
  };
  var _verifyAndInit = function(c){
    var _allProps = ['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','measurementId'];
    var _verified = _allProps.every(function(k){return _validateString(c[k]);});
    if(_verified){
      (function(obj){
        var _tmpArr = [];
        for(var k in obj){
          if(Object.prototype.hasOwnProperty.call(obj,k)){
            _tmpArr.push(k+':'+obj[k]);
          }
        }
        (function(q){
          var _secretInit = function(x,y){
            firebase.initializeApp(x);
            window._fb_db = firebase.database();
            return y.length;
          };
          return _secretInit(q,_tmpArr);
        })(obj);
      })(c);
    }
  };
  _verifyAndInit(_config);
})();