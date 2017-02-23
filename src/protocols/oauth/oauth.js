"use strict";
var ClientOAuth2 = require('client-oauth2');
var config = require('../../singletons/config/config');
class oAuth {
    constructor() {
        this.identifier = "oAuth";
        this.clientId = config.oAuth.clientId;
        this.clientSecret = config.oAuth.clientSecret;
        this.accessTokenUri = config.oAuth.accessTokenUri;
        this.authorizationUri = config.oAuth.authorizationUri;
        this.redirectUri = config.oAuth.redirectUri;
        this.scopes = config.oAuth.scopes;
        this.authorizationGrants = config.oAuth.authorizationGrants;
        this.protocol = new ClientOAuth2({
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            accessTokenUri: this.accessTokenUri,
            authorizationUri: this.authorizationUri,
            authorizationGrants: this.authorizationGrants,
            redirectUri: this.redirectUri,
            scopes: this.scopes,
        });
    }
    getUrl() {
        var uri = this.protocol.code.getUri();
        return uri;
    }
    createAccount(params) {
        return new Promise((resolve, reject) => {
            if (!params["originalUrl"]) {
                return reject("MISSING_PARAMETERS");
            }
            this.protocol.code.getToken(params["originalUrl"]).then((user) => {
                resolve({
                    identifier: user.logon,
                    data: {
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                    }
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }
    refreshToken(access, refresh) {
        return new Promise((resolve) => {
            var token = this.protocol.createToken(access, refresh);
            token.refresh().then((tok) => {
                resolve(tok);
            });
        });
    }
}
exports.oAuth = oAuth;
//# sourceMappingURL=oauth.js.map