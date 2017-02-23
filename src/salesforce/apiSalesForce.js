"use strict";
var config = require("config");
var qs = require("querystring");
var CloudElementsConfiguration = config.get("CloudElements");
var ZendeskConfiguration = config.get("Zendesk");
var hubXConfiguration = config.get("Core");
var hubx2 = require("@startx/hubx-core")(hubXConfiguration);
var request = require("request");
var utils = require("../utils/utils");
var cloudElements = require("../cloudElements/cloudElements");
const nerveCenter_1 = require("../services/nerveCenter");
const users = require("./data model/users");
const articles = require("./data model/articles");
const categories = require("./data model/categories");
const sections = require("./data model/sections");
const groups = require("./data model/groups");
const tickets = require("./data model/tickets");
const ticketSatisfactionRatings = require("./data model/ticketSatisfactionRatings");
var enumDO = {
    USERS: "users",
    TICKETS: "incidents",
    CATEGORIES: "categories",
    GROUPS: "groups",
    SECTIONS: "sections",
    TICKETRATINGS: "ratings",
    TICKETCOMMENT: "comments",
    TICKETAUDITS: "history",
    TICKETAUTIDSEVENTS: "historyEvents",
    ARTICLES: "articles"
};
class apiSalesForce {
    constructor(QContent) {
        this.QContent = QContent;
        this.NerveCenter = new nerveCenter_1.nerveCenter;
        this.users = users;
        this.articles = articles;
        this.categories = categories;
        this.sections = sections;
        this.groups = groups;
        this.tickets = tickets;
    }
    ;
    getUrl(ZendeskDomainPrefix) {
        return cloudElements.getZendeskUrl(ZendeskDomainPrefix);
    }
    processMapEntitiesFromAccountIdentifier(accountIdentifier) {
        return new Promise((resolve, reject) => {
            let userIdentifier = accountIdentifier;
            let accountData;
            hubx2.memory.createAccount(hubXConfiguration.accountType, userIdentifier, "oAuth2", accountData).then((accountResult) => {
                accountData = accountResult.account.data;
                accountData.identifier = accountResult.account.identifier;
                this.processMapEntitiesFromAccountData(accountData).then(() => {
                    console.log("Re-Mapping Completed Successfully");
                }).catch(reject);
            }).catch(reject);
        });
    }
    processMapEntitiesFromAccountData(accountData) {
        return new Promise((resolve, reject) => {
            var _this = this;
            this.MapElementsToEntities(accountData, enumDO.CATEGORIES).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.SECTIONS).then(() => {
                    _this.MapElementsToEntities(accountData, enumDO.GROUPS).then(() => {
                        _this.MapElementsToEntities(accountData, enumDO.USERS).then(() => {
                            _this.MapElementsToEntities(accountData, enumDO.ARTICLES).then(() => {
                                _this.MapElementsToEntities(accountData, enumDO.TICKETS).then(() => {
                                    resolve();
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        });
    }
    getBusinessMapIdentifier(ZendeskObjectName) {
        switch (ZendeskObjectName) {
            case enumDO.USERS: return "ZENDESK_USER";
            case enumDO.TICKETS: return "ZENDESK_TICKET";
            case enumDO.CATEGORIES: return "ZENDESK_CATEGORY";
            case enumDO.ARTICLES: return "ZENDESK_ARTICLE";
            case enumDO.GROUPS: return "ZENDESK_GROUP";
            case enumDO.SECTIONS: return "ZENDESK_SECTION";
            case enumDO.TICKETRATINGS: return "ZENDESK_TICKET_RATING";
            case enumDO.TICKETCOMMENT: return "ZENDESK_TICKET_COMMENT";
            case enumDO.TICKETAUDITS: return "ZENDESK_TICKET_AUDIT";
            case enumDO.TICKETAUTIDSEVENTS: return "ZENDESK_TICKET_AUDIT_EVENT";
            default: return null;
        }
    }
    transformEntities(changedDataObjectType, accountData, whChangedItems) {
        return new Promise((resolve, reject) => {
            switch (changedDataObjectType) {
                case enumDO.USERS: {
                    users.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.TICKETS: {
                    tickets.transform(accountData, whChangedItems).then((args) => {
                        resolve(args);
                    }).catch(reject);
                    break;
                }
                case enumDO.CATEGORIES: {
                    categories.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.GROUPS: {
                    groups.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.SECTIONS: {
                    sections.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.TICKETRATINGS: {
                    ticketSatisfactionRatings.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.ARTICLES: {
                    articles.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                default: reject(new Error("unknown object to transform"));
            }
        });
    }
    decodeHtmlEntity(str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    }
    ;
    processWebhooks(req, res) {
        var _this = this;
        res.writeHead(200, "OK", { 'content-type': 'text/plain' });
        res.end();
        let whMessage = req.body.message;
        if (!(whMessage.elementKey == CloudElementsConfiguration.elementKey)) {
            return false;
        }
        console.log(whMessage);
        console.dir(whMessage);
        let whEvents = whMessage.events;
        console.log(whEvents);
        console.dir(whEvents);
        if (whEvents && whEvents.length > 0) {
            hubx2.memory.createAccount(hubXConfiguration.accountType, this.decodeHtmlEntity(whMessage.instanceName), "oAuth2", null, null).then((accountResult) => {
                let accountData = JSON.parse(accountResult.account.data);
                accountData.identifier = accountResult.account.identifier;
                whEvents.forEach((event) => {
                    let changedDataObjectType = event.objectType;
                    let whChangedDataRawItems = whMessage.raw;
                    console.log("changedDataObjectType=" + changedDataObjectType);
                    let whChangedItems = utils.byString(whChangedDataRawItems, "." + changedDataObjectType);
                    _this.transformEntities(changedDataObjectType, accountData, whChangedItems).then((finalItemsToWrite) => {
                        _this.QContent.mapNameEntities(accountData.identifier, _this.getBusinessMapIdentifier(changedDataObjectType), finalItemsToWrite[finalItemsToWrite.mainEntityName]).then((result) => {
                            console.dir(finalItemsToWrite);
                            console.log("processWebhooks-Updated " + changedDataObjectType);
                        }).catch(exception => {
                            console.log(exception);
                        });
                    }).catch(exception => {
                        console.log(exception);
                    });
                });
            }).catch(function (ex) {
                console.log(ex);
            });
        }
    }
    MapElementsToEntities(accountData, elementObjectName) {
        return new Promise((resolve, reject) => {
            var _this = this;
            switch (elementObjectName) {
                case enumDO.USERS: {
                    let currentPage = 1;
                    users.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.TICKETS: {
                    let currentPage = 1;
                    tickets.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.CATEGORIES: {
                    let currentPage = 1;
                    categories.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.GROUPS: {
                    let currentPage = 1;
                    groups.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.SECTIONS: {
                    let currentPage = 1;
                    sections.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.ARTICLES: {
                    let currentPage = 1;
                    articles.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.TICKETRATINGS: {
                    resolve();
                    console.log("not implemented for zendesk yet, do for other drivers");
                    break;
                }
                default: reject(new Error('apiSalesForce-MapElementsToEntities-unknown object to map-' + elementObjectName));
            }
        });
    }
    handleOAuthRedirect(ZendeskDomainPrefix, req, res) {
        return new Promise((resolve, reject) => {
            if (req.error) {
                reject(req.error);
            }
            let _this = this;
            cloudElements.createInstance(ZendeskDomainPrefix, req.query.code).then((result) => {
                let elementToken = result.token;
                let instanceElement = result.element;
                let accountData = { CEelementInstanceId: result.id, CEelementInstanceToken: result.token, identifier: '', siteAddress: '', organizationId: '', email: '', userId: '', apiKey: result.configuration['oauth.api.key'], apiSecret: result.configuration['oauth.api.secret'], authorizationUrl: result.configuration['oauth.authorization.url'], callbackUrl: result.configuration['oauth.callback.url'], scope: result.configuration['oauth.scope'], userToken: result.configuration['oauth.user.token'], tokenUrl: result.configuration['oauth.token.url'], userRefreshInterval: result.configuration['oauth.user.refresh_interval'], userRefreshTime: result.configuration['oauth.user.refresh_time'], userRefreshToken: result.configuration['oauth.user.refresh_token'] };
                cloudElements.getUserOfElementByToken(result.token).then((user) => {
                    accountData.userId = user.id;
                    accountData.organizationId = user.organization_id;
                    accountData.siteAddress = ZendeskDomainPrefix;
                    accountData.email = user.email;
                    let userIdentifier = user.email;
                    hubx2.memory.createAccount(hubXConfiguration.accountType, userIdentifier, "oAuth2", accountData, accountData.organizationId).then((accountResult) => {
                        accountData.identifier = accountResult.account.identifier;
                        if (!accountResult.created) {
                            let previousData = JSON.parse(accountResult.account.data);
                            if (!(accountData.CEelementInstanceId == previousData.CEelementInstanceId)) {
                                hubx2.memory.updateAccount(userIdentifier, hubXConfiguration.accountType, { data: accountData }).then(() => {
                                    console.log("account updated with new instance");
                                    cloudElements.deleteCEInstance(previousData.CEelementInstanceToken, previousData.CEelementInstanceId).then(() => {
                                        console.log("old instance deleted");
                                    }).catch(reject);
                                }).catch(reject);
                            }
                        }
                        cloudElements.SetInstanceName(accountData.CEelementInstanceToken, accountData.CEelementInstanceId, accountData.identifier).then(() => {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.end('{userIdentifier: ' + JSON.stringify(userIdentifier) + '}');
                            _this.processMapEntitiesFromAccountData(accountData).then(() => {
                                console.log("Mapping Completed Successfully");
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        });
    }
}
exports.apiSalesForce = apiSalesForce;
//# sourceMappingURL=apiSalesForce.js.map