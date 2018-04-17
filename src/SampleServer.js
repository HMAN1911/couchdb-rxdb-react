// include dependencies
var PouchDB = require('pouchdb');
var express = require('express');
var cors = require('cors')

var app = express();


app.use('/db', require('express-pouchdb')(PouchDB));

app.use(cors())


app.use('/', (req, res, next) => {
  console.log(req.headers);
  next();
});

app.listen(3232);

// var http = require('http'),
//   httpProxy = require('http-proxy');

// //
// // Create a proxy server with custom application logic
// //
// var proxy = httpProxy.createProxyServer({});

// // To modify the proxy connection before data is sent, you can listen
// // for the 'proxyReq' event. When the event is fired, you will receive
// // the following arguments:
// // (http.ClientRequest proxyReq, http.IncomingMessage req,
// //  http.ServerResponse res, Object options). This mechanism is useful when
// // you need to modify the proxy request before the proxy connection
// // is made to the target.
// //
// proxy.on('proxyReq', function (proxyReq, req, res, options) {
//   proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
// });

// var server = http.createServer(function (req, res) {
//   // You can define here your custom logic to handle the request
//   // and then proxy the request.
//   if (req.headers.authorization) {
//     // decode the jwt here
//     proxy.web(req, res, {
//       // proxy to the correct db after figuring out who this is from the jwt
//       target: 'http://127.0.0.1:3232/test'
//     })
//   }
// });

// console.log("listening on port 5050")
// // server.listen(5050);