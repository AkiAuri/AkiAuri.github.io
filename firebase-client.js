// Obfuscated Firebase config
(function(){
  // Encoded config string (replace with your actual values, base64-encoded)
  var cfg_b64 = "ewogICJhcGlLZXkiOiAiWU9VUl9BUElfS0VZIiwKICAiYXV0aERvbWFpbiI6ICJZT1VSX1BST0pFQ1RfSUQuZmlyZWJhcHAuY29tIiwKICAiZGF0YWJhc2VVUkwiOiAiaHR0cHM6Ly9ZT1VSX1BST0pFQ1RfSUQuaW8iLAogICJwcm9qZWN0SWQiOiAiWU9VUl9QUk9KRUNUX0lEIiwKICAic3RvcmFnZUJ1Y2tldCI6ICJZT1VSX1BST0pFQ1RfSUQuaXBwLmNvbSIsCiAgIm1lc3NnaW5nU2VuZGVySWQiOiAiWU9VUl9TRU5ERVJfSUQiLAogICJhcHBJZCI6ICJZT1VSX0FQUF9JRCIKfQ==";
  // Decode base64 to JSON
  var config = JSON.parse(atob(cfg_b64));
  // Initialize Firebase
  firebase.initializeApp(config);
  window._fb_db = firebase.database();
})();
