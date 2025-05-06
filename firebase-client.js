(function(){
  var a="W3siMCI6IkFweUl6YVN5RGhKTU1XYWxsYWRaUTNYdENLZW5Mcm1rQXl0M1RnOVVRIiwiMSI6ImRvbGxpc3Rhbm5vdGVzLmZpcmViYXBwLmNvbSIsIjIiOiJkb2xsaXN0YW5ub3RlcyIsIjMiOiJkb2xsaXN0YW5ub3Rlcy5maXJlYmFzZXN0b3JhZ2UuYXBwIiwiNCI6IjYwMTA2OTQxNTY2NCIsIjUiOiIxOjYwMTA2OTQxNTY2NDp3ZWI6YWRmOTcyOTU3NDM2YjAxYmM2NjM1IiwiNiI6IkctNVE1UVpGTUdRRiJ9XQ==";
  var b=function(c){return window.atob?atob(c):c;};
  var d=function(e){return JSON.parse(e)[0];};
  var f=function(g){return typeof g==='string'&&g.length>0;};
  var h=function(i){return i.replace(/[^a-zA-Z0-9_\-.:/]/g,'');};
  var j=d(b(a));
  var k={
    apiKey: f(j['0'])?h(j['0']):'',
    authDomain: f(j['1'])?h(j['1']):'',
    projectId: f(j['2'])?h(j['2']):'',
    storageBucket: f(j['3'])?h(j['3']):'',
    messagingSenderId: f(j['4'])?h(j['4']):'',
    appId: f(j['5'])?h(j['5']):'',
    measurementId: f(j['6'])?h(j['6']):''
  };
  var l=function(m){
    var n=['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','measurementId'];
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