(function(){
  var a="W3siMCI6IkFweUl6YVN5RGhKTU1XYWttWk1ETnBJZ2s2VElYZ0JaaldubldFb1QiLCIxIjoiZG9sbGlzdGFubm90ZXMuZmlyZWJhcHAuY29tIiwiMiI6ImRvbGxpc3Rhbm5vdGVzIiwiMyI6Imh0dHBzOi8vZG9sbGlzdGFubm90ZXMtZGVmYXVsdC1ydGRiLmFzaWEtc291dGhlYXN0MS5maXJlYmFzZWRhdGFiYXNlLmFwcC8iLCI0IjoiZG9sbGlzdGFubm90ZXMuZmlyZWJhc2VzdG9yYWdlLmFwcCIsIjUiOiI2MDEwNjk0MTU2NjQiLCI2IjoiMTo2MDEwNjk0MTU2NjQ6d2ViOjM1Y2RjMjNjYzMxZDBiYzRiYzY2MzUiLCI3IjoiRy00QzJYWUVEUzFFIn1d";
  var b=function(c){return window.atob?atob(c):c;};
  var d=function(e){return JSON.parse(e)[0];};
  var f=function(g){return typeof g==='string'&&g.length>0;};
  var h=function(i){return i.replace(/[^a-zA-Z0-9_\-.:/]/g,'');};
  var j=d(b(a));
  var k={
    apiKey: f(j['0'])?h(j['0']):'',
    authDomain: f(j['1'])?h(j['1']):'',
    projectId: f(j['2'])?h(j['2']):'',
    databaseURL: f(j['3'])?j['3']:'',
    storageBucket: f(j['4'])?h(j['4']):'',
    messagingSenderId: f(j['5'])?h(j['5']):'',
    appId: f(j['6'])?h(j['6']):'',
    measurementId: f(j['7'])?h(j['7']):''
  };
  var l=function(m){
    var n=['apiKey','authDomain','projectId','databaseURL','storageBucket','messagingSenderId','appId','measurementId'];
    var o=n.every(function(p){return f(m[p]);});
    if(o){
      (function(q){
        var r=[];
        for(var s in q){if(Object.prototype.hasOwnProperty.call(q,s)){r.push(s+':'+q[s]);}}
        (function(t){
          var u=function(v,w){
            firebase.initializeApp(v);
            window._fb_db=firebase.database();
            return w.length;
          };
          return u(t,r);
        })(q);
      })(m);
    }
  };
  l(k);
})();