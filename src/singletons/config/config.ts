/**
 * Configuration Settings
 */

var preferences = {
	oAuth: {
		clientId: null,
		clientSecret: null,
		accessTokenUri: null,
		authorizationUri: null,
		redirectUri: null,
		authorizationGrants: [ "credentials" ],
		scopes: null,
	},
	accountType: ""
};

module.exports = preferences;