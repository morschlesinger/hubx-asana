"use strict";
var config = require("config");
var qs = require("querystring");
var CloudElementsConfiguration = config.get("CloudElements");
var SalesForceConfiguration = config.get("SalesForce");
var hubXConfiguration = config.get("Core");
var hubx2 = require("@startx/hubx-core")(hubXConfiguration);
var request = require("request");
const utils = require("../utils/utils");
const cloudElements = require("../cloudElements/cloudElements");
const nerveCenter_1 = require("../services/nerveCenter");
const account = require("./data model/account");
const asset = require("./data model/asset");
const campaign = require("./data model/campaign");
const cases = require("./data model/case");
const group = require("./data model/group");
const contract = require("./data model/contract");
const dashboard = require("./data model/dashboard");
const document = require("./data model/document");
const event = require("./data model/event");
const folder = require("./data model/folder");
const idea = require("./data model/idea");
const lead = require("./data model/lead");
const macro = require("./data model/macro");
const note = require("./data model/note");
const open_activity = require("./data model/OpenActivity");
const order = require("./data model/order");
const product = require("./data model/product");
const report = require("./data model/report");
const solution = require("./data model/solution");
const task = require("./data model/task");
const contact = require("./data model/contact");
const opportunity = require("./data model/opportunity");
const user = require("./data model/user");
var enumDO = {
    ACCOUNT: "account",
    ACTIVITY: "activity",
    ASSET: "asset",
    CAMPAIGN: "campaign",
    CASE: "case",
    GROUP: "group",
    CONTRACT: "contract",
    DASHBOARD: "dashboard",
    DOCUMENT: "document",
    EVENT: "event",
    FOLDER: "folder",
    IDEA: "idea",
    LEAD: "lead",
    MACRO: "macro",
    NOTE: "note",
    OPEN_ACTIVITY: "open_activity",
    ORDER: "order",
    PRODUCT: "product",
    REPORT: "report",
    SOLUTION: "solution",
    TASK: "task",
    CONTACT: "contact",
    OPPORTUNITY: "opportunity",
    PIPELINE: "pipeline",
    USER: "user"
};
class apiSalesForce {
    constructor(QContent) {
        this.QContent = QContent;
        this.NerveCenter = new nerveCenter_1.nerveCenter;
        this.account = account;
        this.asset = asset;
        this.campaign = campaign;
        this.cases = cases;
        this.group = group;
        this.contract = contract;
        this.dashboard = dashboard;
        this.document = document;
        this.event = event;
        this.folder = folder;
        this.idea = idea;
        this.lead = lead;
        this.macro = macro;
        this.note = note;
        this.open_activity = open_activity;
        this.order = order;
        this.product = product;
        this.report = report;
        this.solution = solution;
        this.task = task;
        this.contact = contact;
        this.opportunity = opportunity;
        this.user = user;
        console.log("apiSalesForce constructed");
    }
    ;
    getUrl(SalesForceDomainPrefix) {
        return cloudElements.getSalesForceUrl(SalesForceDomainPrefix);
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
            this.MapElementsToEntities(accountData, enumDO.USER).then(() => {
                this.MapElementsToEntities(accountData, enumDO.ACCOUNT).then(() => {
                    this.MapElementsToEntities(accountData, enumDO.CONTACT).then(() => {
                        this.MapElementsToEntities(accountData, enumDO.ASSET).then(() => {
                            this.MapElementsToEntities(accountData, enumDO.EVENT).then(() => {
                                this.MapElementsToEntities(accountData, enumDO.FOLDER).then(() => {
                                    this.MapElementsToEntities(accountData, enumDO.DOCUMENT).then(() => {
                                        this.MapElementsToEntities(accountData, enumDO.GROUP).then(() => {
                                            this.MapElementsToEntities(accountData, enumDO.TASK).then(() => {
                                                this.MapElementsToEntities(accountData, enumDO.NOTE).then(() => {
                                                    this.MapElementsToEntities(accountData, enumDO.CASE).then(() => {
                                                        this.MapElementsToEntities(accountData, enumDO.SOLUTION).then(() => {
                                                            this.MapElementsToEntities(accountData, enumDO.IDEA).then(() => {
                                                                this.MapElementsToEntities(accountData, enumDO.MACRO).then(() => {
                                                                    this.MapElementsToEntities(accountData, enumDO.CONTRACT).then(() => {
                                                                        this.MapElementsToEntities(accountData, enumDO.LEAD).then(() => {
                                                                            this.MapElementsToEntities(accountData, enumDO.CAMPAIGN).then(() => {
                                                                                this.MapElementsToEntities(accountData, enumDO.OPPORTUNITY).then(() => {
                                                                                    this.MapElementsToEntities(accountData, enumDO.PRODUCT).then(() => {
                                                                                        this.MapElementsToEntities(accountData, enumDO.ORDER).then(() => {
                                                                                            this.MapElementsToEntities(accountData, enumDO.REPORT).then(() => {
                                                                                                resolve();
                                                                                            }).catch(reject);
                                                                                        }).catch(reject);
                                                                                    }).catch(reject);
                                                                                }).catch(reject);
                                                                            }).catch(reject);
                                                                        }).catch(reject);
                                                                    }).catch(reject);
                                                                }).catch(reject);
                                                            }).catch(reject);
                                                        }).catch(reject);
                                                    }).catch(reject);
                                                }).catch(reject);
                                            }).catch(reject);
                                        }).catch(reject);
                                    }).catch(reject);
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        });
    }
    getBusinessMapIdentifier(SalesForceObjectName) {
        switch (SalesForceObjectName) {
            case enumDO.ACCOUNT: return "SALESFORCE_ACCOUNT";
            case enumDO.ACTIVITY: return "SALESFORCE_ACTIVITY";
            case enumDO.ASSET: return "SALESFORCE_ASSET";
            case enumDO.CAMPAIGN: return "SALESFORCE_CAMPAIGN";
            case enumDO.CASE: return "SALESFORCE_CASE";
            case enumDO.GROUP: return "SALESFORCE_GROUP";
            case enumDO.CONTRACT: return "SALESFORCE_CONTRACT";
            case enumDO.DASHBOARD: return "SALESFORCE_DASHBOARD";
            case enumDO.DOCUMENT: return "SALESFORCE_DOCUMENT";
            case enumDO.EVENT: return "SALESFORCE_EVENT";
            case enumDO.FOLDER: return "SALESFORCE_FOLDER";
            case enumDO.IDEA: return "SALESFORCE_IDEA";
            case enumDO.LEAD: return "SALESFORCE_LEAD";
            case enumDO.MACRO: return "SALESFORCE_MACRO";
            case enumDO.NOTE: return "SALESFORCE_NOTE";
            case enumDO.OPEN_ACTIVITY: return "SALESFORCE_OPEN_ACTIVITY";
            case enumDO.ORDER: return "SALESFORCE_ORDER";
            case enumDO.PRODUCT: return "SALESFORCE_PRODUCT";
            case enumDO.REPORT: return "SALESFORCE_REPORT";
            case enumDO.SOLUTION: return "SALESFORCE_SOLUTION";
            case enumDO.TASK: return "SALESFORCE_TASK";
            case enumDO.CONTACT: return "SALESFORCE_CONTACT";
            case enumDO.OPPORTUNITY: return "SALESFORCE_OPPORTUNITY";
            case enumDO.PIPELINE: return "SALESFORCE_PIPELINE";
            case enumDO.USER: return "SALESFORCE_USER";
            default: return null;
        }
    }
    transformEntities(changedDataObjectType, accountData, whChangedItems) {
        return new Promise((resolve, reject) => {
            switch (changedDataObjectType) {
                case enumDO.ACCOUNT: {
                    account.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.ASSET: {
                    asset.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.CAMPAIGN: {
                    campaign.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.CASE: {
                    cases.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.GROUP: {
                    group.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.CONTRACT: {
                    contract.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.DASHBOARD: {
                    dashboard.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.DOCUMENT: {
                    document.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.EVENT: {
                    event.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.FOLDER: {
                    folder.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.IDEA: {
                    idea.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.LEAD: {
                    lead.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.MACRO: {
                    macro.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.NOTE: {
                    note.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.OPEN_ACTIVITY: {
                    open_activity.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.ORDER: {
                    order.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.PRODUCT: {
                    product.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.REPORT: {
                    report.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.SOLUTION: {
                    solution.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.TASK: {
                    task.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.CONTACT: {
                    contact.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.OPPORTUNITY: {
                    opportunity.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
                        resolve(finalItemsToWrite);
                    }).catch(reject);
                    break;
                }
                case enumDO.USER: {
                    user.transform(accountData, whChangedItems).then((finalItemsToWrite) => {
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
                case enumDO.CONTACT: {
                    let currentPage = 1;
                    contact.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                    ;
                }
                case enumDO.ACCOUNT: {
                    let currentPage = 1;
                    account.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.ASSET: {
                    let currentPage = 1;
                    asset.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.CAMPAIGN: {
                    let currentPage = 1;
                    campaign.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.CASE: {
                    let currentPage = 1;
                    cases.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.GROUP: {
                    let currentPage = 1;
                    group.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.CONTRACT: {
                    let currentPage = 1;
                    contract.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.DASHBOARD: {
                    let currentPage = 1;
                    dashboard.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.DOCUMENT: {
                    let currentPage = 1;
                    document.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.EVENT: {
                    let currentPage = 1;
                    event.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.FOLDER: {
                    let currentPage = 1;
                    folder.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.IDEA: {
                    let currentPage = 1;
                    idea.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.LEAD: {
                    let currentPage = 1;
                    lead.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.MACRO: {
                    let currentPage = 1;
                    macro.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.NOTE: {
                    let currentPage = 1;
                    note.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.OPEN_ACTIVITY: {
                    let currentPage = 1;
                    open_activity.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.ORDER: {
                    let currentPage = 1;
                    order.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.PRODUCT: {
                    let currentPage = 1;
                    product.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.REPORT: {
                    let currentPage = 1;
                    report.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.SOLUTION: {
                    let currentPage = 1;
                    solution.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.TASK: {
                    let currentPage = 1;
                    task.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.OPPORTUNITY: {
                    let currentPage = 1;
                    opportunity.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                case enumDO.USER: {
                    let currentPage = 1;
                    user.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                        if (finished)
                            resolve();
                    }).catch(reject);
                    break;
                }
                default: reject(new Error('apiSalesForce-MapElementsToEntities-unknown object to map-' + elementObjectName));
            }
        });
    }
    handleOAuthRedirect(SalesForceDomainPrefix, req, res) {
        return new Promise((resolve, reject) => {
            if (req.error) {
                reject(req.error);
            }
            let _this = this;
            cloudElements.createInstance(SalesForceDomainPrefix, req.query.code).then((result) => {
                let elementToken = result.token;
                let instanceElement = result.element;
                let accountData = { CEelementInstanceId: result.id, CEelementInstanceToken: result.token, identifier: '', siteAddress: '', organizationId: '', email: '', userId: '', apiKey: result.configuration['oauth.api.key'], apiSecret: result.configuration['oauth.api.secret'], authorizationUrl: result.configuration['oauth.authorization.url'], callbackUrl: result.configuration['oauth.callback.url'], scope: result.configuration['oauth.scope'], userToken: result.configuration['oauth.user.token'], tokenUrl: result.configuration['oauth.token.url'], userRefreshInterval: result.configuration['oauth.user.refresh_interval'], userRefreshTime: result.configuration['oauth.user.refresh_time'], userRefreshToken: result.configuration['oauth.user.refresh_token'] };
                var userId = result.configuration['sfdc.user.id.url'];
                accountData.userId = userId.substr(userId.lastIndexOf("/") + 1);
                accountData.siteAddress = result.configuration['base.url'];
                let userIdentifier = accountData.userId;
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
                        res.end('{"userIdentifier": ' + JSON.stringify(userIdentifier) + '}');
                        _this.processMapEntitiesFromAccountData(accountData).then(() => {
                            console.log("Mapping Completed Successfully");
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        });
    }
}
exports.apiSalesForce = apiSalesForce;
