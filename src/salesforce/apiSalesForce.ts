var config = require("config");
var qs = require("querystring");
var CloudElementsConfiguration = config.get("CloudElements");
var SalesForceConfiguration = config.get("SalesForce");
var hubXConfiguration = config.get("Core");
var hubx2 = require("@startx/hubx-core")(hubXConfiguration);
var request = require("request");
var utils = require("../utils/utils");
var cloudElements = require("../cloudElements/cloudElements");

import {EVENT_TYPES,nerveCenter} from "../services/nerveCenter";
//import {users} from "./data model/users";
import * as account from "./data model/account";
import * as activity from "./data model/activity";
import * as asset from "./data model/asset";
import * as campaign from "./data model/campaign";
import * as case from "./data model/case";
import * as group from "./data model/group";
import * as contract from "./data model/contract";
import * as dashboard from "./data model/dashboard";
import * as document from "./data model/document";
import * as event from "./data model/event";
import * as folder from "./data model/folder";
import * as idea from "./data model/idea";
import * as lead from "./data model/lead";
import * as macro from "./data model/macro";
import * as note from "./data model/note";
import * as open_activity from "./data model/open_activity";
import * as order from "./data model/order";
import * as product from "./data model/product";
import * as report from "./data model/report";
import * as solution from "./data model/solution";
import * as task from "./data model/task";
import * as contact from "./data model/contact";
import * as opportunity from "./data model/opportunity";
import * as pipeline from "./data model/pipeline";
import * as user from "./data model/user";

import {contentQueue} from "../singletons/contentQueue/contentQueue";

var enumDO = { //Data Objects
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


export class apiSalesForce {
    private QContent: contentQueue;
    private NerveCenter: nerveCenter;
    public users: any;
    public articles: any;
    public categories: any;
    public sections: any;
    public groups: any;
    public tickets: any;    
    //private apiClient: any;
    constructor(QContent: contentQueue) {
        this.QContent = QContent;
        this.NerveCenter = new nerveCenter;
        // this.users = users; // new users(this.QContent);
        // this.articles = articles
        // this.categories = categories;
        // this.sections = sections;
        // this.groups = groups;
        // this.tickets = tickets;
        //this.apiClient = apiClient || m_ApiClient.getNewInstance();
        //console.log("apiSalesForce constructed");
    };

    public getUrl(SalesForceDomainPrefix) {
        return cloudElements.getSalesForceUrl(SalesForceDomainPrefix);
    }
    
    public processMapEntitiesFromAccountIdentifier(accountIdentifier) {
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
//add user-field

    public processMapEntitiesFromAccountData(accountData) {
        return new Promise((resolve, reject) => {
            var _this = this;
            this.MapElementsToEntities(accountData, enumDO.ACCOUNT).then(() => {
                 _this.MapElementsToEntities(accountData, enumDO.USER).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.CONTACT).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.DASHBOARD).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.ACTIVITY).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.OPEN_ACTIVITY).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.ASSET).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.EVENT).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.FOLDER).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.DOCUMENT).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.GROUP).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.TASK).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.NOTE).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.CASE).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.SOLUTION).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.IDEA).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.MACRO).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.CONTRACT).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.LEAD).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.CAMPAIGN).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.OPPORTUNITY).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.PRODUCT).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.ORDER).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.PIPELINE).then(() => {
                _this.MapElementsToEntities(accountData, enumDO.REPORT).then(() => {
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
                }).catch(reject);
                }).catch(reject);
                }).catch(reject);
                }).catch(reject);
            });        
    }

    private getBusinessMapIdentifier(SalesForceObjectName): String {
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
    
    private transformEntities(changedDataObjectType, accountData, whChangedItems) {
        return new Promise((resolve, reject) => {
            switch (changedDataObjectType) {
                // case enumDO.USERS: {
                //     users.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                //         resolve(finalItemsToWrite);
                //     }).catch(reject);
                //     break;
                // }            
                // case enumDO.TICKETS: {
                //     tickets.transform(accountData,whChangedItems).then((args) => {
                //         resolve(args);
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.CATEGORIES: {
                //     categories.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                //         resolve(finalItemsToWrite);
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.GROUPS: {
                //     groups.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                //         resolve(finalItemsToWrite);
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.SECTIONS: {
                //     sections.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                //         resolve(finalItemsToWrite);
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.TICKETRATINGS: {
                //     ticketSatisfactionRatings.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                //         resolve(finalItemsToWrite);
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.ARTICLES: {
                //     articles.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                //         resolve(finalItemsToWrite);
                //     }).catch(reject);
                //     break;
                // }
                default: reject(new Error("unknown object to transform"));
            }
        });
    }

    private decodeHtmlEntity (str) {
        return str.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
        });
    };
    
    public processWebhooks(req,res) {
        var _this=this;
        res.writeHead(200, "OK", {'content-type' : 'text/plain'});
        res.end();

        let whMessage = req.body.message;
        if (!(whMessage.elementKey==CloudElementsConfiguration.elementKey)) {
            return false;
        }

        console.log(whMessage);
        console.dir(whMessage);


        let whEvents = whMessage.events;
        console.log(whEvents);
        console.dir(whEvents);


/* Event    {elementKey:"zendesk",
            eventType:"UPDATED",
            objectId:"7952451365",
            objectType:"users"}*/
        if (whEvents && whEvents.length>0) {
            hubx2.memory.createAccount(hubXConfiguration.accountType, this.decodeHtmlEntity(whMessage.instanceName), "oAuth2",null, null).then((accountResult) => {
                let accountData = JSON.parse(accountResult.account.data);
                accountData.identifier = accountResult.account.identifier;
                whEvents.forEach((event) => {
                    let changedDataObjectType: String = event.objectType;                
                    let whChangedDataRawItems = whMessage.raw;

                    console.log("changedDataObjectType=" + changedDataObjectType);

                    let whChangedItems = utils.byString(whChangedDataRawItems,"." + changedDataObjectType);

                    _this.transformEntities(changedDataObjectType,accountData,whChangedItems).then((finalItemsToWrite: any) => {
                        _this.QContent.mapNameEntities(accountData.identifier, _this.getBusinessMapIdentifier(changedDataObjectType), finalItemsToWrite[finalItemsToWrite.mainEntityName]).then((result) => {
                            //console.log(finalItemsToWrite);
                            console.dir(finalItemsToWrite);
                            console.log("processWebhooks-Updated " + changedDataObjectType )
                        }).catch(exception => {
                            console.log(exception);
                        });
                    }).catch(exception => {
                        console.log(exception);
                    });
                });
            }).catch(function(ex){
                console.log(ex);    
            });
        }
    }

    private MapElementsToEntities(accountData, elementObjectName) {
        return new Promise((resolve, reject) => {
            var _this=this;
            switch (elementObjectName) {
                // case enumDO.USERS: {
                //     let currentPage = 1;
                //     users.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                //         if (finished)
                //             resolve();
                //     }).catch(reject);
                //     break;
                // }            
                // case enumDO.TICKETS: {
                //     let currentPage = 1;
                //     tickets.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                //         if (finished)
                //             resolve();
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.CATEGORIES: {
                //     let currentPage = 1;
                //     categories.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                //         if (finished) 
                //             resolve();
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.GROUPS: {
                //     let currentPage = 1;
                //     groups.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                //         if (finished)
                //             resolve();
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.SECTIONS: {
                //     let currentPage = 1;
                //     sections.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                //         if (finished)
                //             resolve();
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.ARTICLES: {
                //     let currentPage = 1;
                //     articles.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                //         if (finished) 
                //             resolve();
                //     }).catch(reject);
                //     break;
                // }
                // case enumDO.TICKETRATINGS: {
                //     //let currentPage = 1;
                //     //this.MapCE SectionsToEntities(accountData, currentPage).then((finished) => {
                //         //if (finished)
                //         resolve();
                //     //}).catch(reject);
                //     //break;
                //     console.log("not implemented for SalesForce yet, do for other drivers");
                //     break;
                // }
                default: reject(new Error('apiSalesForce-MapElementsToEntities-unknown object to map-' + elementObjectName));
            }
        });        
    }  

    public handleOAuthRedirect(SalesForceDomainPrefix, req, res) {
        return new Promise((resolve, reject) => {
            if (req.error) {
                reject(req.error);
            }
            let _this=this;
            cloudElements.createInstance(SalesForceDomainPrefix, req.query.code).then((result: any) => { 
                let elementToken = result.token;
                let instanceElement = result.element;
                let accountData = {CEelementInstanceId: result.id, CEelementInstanceToken: result.token, identifier: '', siteAddress: '', organizationId: '', email: '', userId: '', apiKey: result.configuration['oauth.api.key'], apiSecret: result.configuration['oauth.api.secret'], authorizationUrl: result.configuration['oauth.authorization.url'], callbackUrl: result.configuration['oauth.callback.url'], scope: result.configuration['oauth.scope'], userToken: result.configuration['oauth.user.token'], tokenUrl: result.configuration['oauth.token.url'], userRefreshInterval: result.configuration['oauth.user.refresh_interval'], userRefreshTime: result.configuration['oauth.user.refresh_time'], userRefreshToken: result.configuration['oauth.user.refresh_token']};
                cloudElements.getUserOfElementByToken(result.token).then((user: any) => { 
                    accountData.userId=user.id;
                    accountData.organizationId=user.organization_id;
                    accountData.siteAddress=SalesForceDomainPrefix;
                    accountData.email=user.email;
                    let userIdentifier: String = accountData.userId;   //user.email;                          
                    hubx2.memory.createAccount(hubXConfiguration.accountType, userIdentifier, "oAuth2", accountData, accountData.organizationId).then((accountResult) => {
                        accountData.identifier = accountResult.account.identifier;
                        if (!accountResult.created) {
                            let previousData = JSON.parse(accountResult.account.data);
                            if(!(accountData.CEelementInstanceId==previousData.CEelementInstanceId)) {
                                hubx2.memory.updateAccount(userIdentifier, hubXConfiguration.accountType, {data: accountData}).then(() => {
                                    console.log("account updated with new instance");
                                    cloudElements.deleteCEInstance(previousData.CEelementInstanceToken, previousData.CEelementInstanceId).then(() => { //delete old instance, keep new and update hubx account data
                                        console.log("old instance deleted");
                                    }).catch(reject);
                                }).catch(reject);
                            }
                        }                            
                        cloudElements.SetInstanceName(accountData.CEelementInstanceToken, accountData.CEelementInstanceId, accountData.identifier).then(() => {
                            res.writeHead(200, {"Content-Type": "application/json"});
                            res.end('{userIdentifier: ' + JSON.stringify(userIdentifier) + '}');
                            _this.processMapEntitiesFromAccountData(accountData).then(() => {
                                console.log("Mapping Completed Successfully");
                                //Notify nerve center
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        });        
    }    
}