"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connect = require("connect");
var express = require("express");
var url = require("url");
var qs = require("querystring");
var bodyParser = require("body-parser");
var config = require("config");
const apiSalesForce_1 = require("../salesforce/apiSalesForce");
const contentQueue_1 = require("../../src/singletons/contentQueue/contentQueue");
var QContent;
var http = require("http");
exports.app = express();
var server = http.Server(exports.app);
var PORT = process.env.PORT || 8080;
function boot() {
    var _this = this;
    this.QContent = new contentQueue_1.contentQueue;
    exports.app.use(allowCrossDomain);
    exports.app.use(bodyParser.urlencoded({ extended: false }));
    exports.app.use(bodyParser.json());
    exports.app.get('/', function (req, res) {
        res.send("HubX 2.0 SalesForce is up");
        res.end();
    });
    exports.app.get('/url', function (req, res) {
        let m_apiSalesForce = new apiSalesForce_1.apiSalesForce(_this.QContent);
        m_apiSalesForce.getUrl(req.query.vendorParameter).then((url) => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end('{"url": ' + JSON.stringify(url) + '}');
        }).catch(exception => {
            res.status(500).send(exception);
        });
    });
    exports.app.get('/oauth', function (req, res) {
        let m_apiSalesForce = new apiSalesForce_1.apiSalesForce(_this.QContent);
        m_apiSalesForce.handleOAuthRedirect(req.query.state, req, res).catch((ex) => {
            console.log(ex);
        });
    });
    exports.app.post('/webhooks', function (req, res) {
        let m_apiSalesForce = new apiSalesForce_1.apiSalesForce(_this.QContent);
        m_apiSalesForce.processWebhooks(req, res);
    });
    exports.app.get('/remap', function (req, res) {
        let m_apiSalesForce = new apiSalesForce_1.apiSalesForce(_this.QContent);
        m_apiSalesForce.processMapEntitiesFromAccountIdentifier(req.query.userIdentifier).then(() => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end('{userIdentifier: ' + JSON.stringify(req.query.userIdentifier) + '}');
        }).catch((ex) => {
            console.log(ex);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(ex);
        });
    });
    http.createServer(exports.app).listen(PORT, function () {
        console.log('[Restful] listening with HTTPS on *:{port}'.replace("{port}", PORT));
    });
}
exports.boot = boot;
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
module.exports = {
    boot: boot,
    app: exports.app,
};
