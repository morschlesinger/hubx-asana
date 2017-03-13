var config = require("config");
var qs = require("querystring");
var CloudElementsConfiguration = config.get("CloudElements");
var SalesForceConfiguration = config.get("SalesForce");
var hubXConfiguration = config.get("Core");
var hubx2 = require("@startx/hubx-core")(hubXConfiguration);
var request = require("request");
import * as utils from "../utils/utils"
import * as cloudElements from "../cloudElements/cloudElements";
import {EVENT_TYPES,nerveCenter} from "../services/nerveCenter";
//import {users} from "./data model/users";
import * as account from "./data model/account";
//import * as activity from "./data model/activity";
import * as asset from "./data model/asset";
import * as campaign from "./data model/campaign";
import * as cases from "./data model/case";
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
import * as open_activity from "./data model/OpenActivity";
import * as order from "./data model/order";
import * as product from "./data model/product";
import * as report from "./data model/report";
import * as solution from "./data model/solution";
import * as task from "./data model/task";
import * as contact from "./data model/contact";
import * as opportunity from "./data model/opportunity";
//import * as pipeline from "./data model/pipeline";
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

    public account: any;
    //public activity: any;
    public asset: any;
    public campaign: any;
    public cases: any;
    public group: any;
    public contract: any;
    public dashboard: any;
    public document: any;
    public event: any;
    public folder: any;
    public idea: any;
    public lead: any;
    public macro: any;
    public note: any;
    public open_activity: any;
    public order: any;
    public product: any;
    public report: any;
    public solution: any;
    public task: any;
    public contact: any;
    public opportunity: any;
    //public pipeline: any;
    public user: any;

    //private apiClient: any;
    constructor(QContent: contentQueue) {
        this.QContent = QContent;
        this.NerveCenter = new nerveCenter;

        this.account = account;
        //this.activity = activity;
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
        //this.pipeline = pipeline;
        this.user = user;

       //this.apiClient = apiClient || m_ApiClient.getNewInstance();
        console.log("apiSalesForce constructed");
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
                this.MapElementsToEntities(accountData, enumDO.USER).then(() => {
                this.MapElementsToEntities(accountData, enumDO.ACCOUNT).then(() => {
                this.MapElementsToEntities(accountData, enumDO.CONTACT).then(() => {
                //this.MapElementsToEntities(accountData, enumDO.DASHBOARD).then(() => {
                //this.MapElementsToEntities(accountData, enumDO.ACTIVITY).then(() => {
                //this.MapElementsToEntities(accountData, enumDO.OPEN_ACTIVITY).then(() => {
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
                //this.MapElementsToEntities(accountData, enumDO.PIPELINE).then(() => {
                this.MapElementsToEntities(accountData, enumDO.REPORT).then(() => {
                resolve();
                //}).catch(reject);
                //}).catch(reject);
                //}).catch(reject);
                //}).catch(reject);
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
                case enumDO.ACCOUNT: {
                     account.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
/*                case enumDO.ACTIVITY: {
                     acticity.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }*/
                case enumDO.ASSET: {
                     asset.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.CAMPAIGN: {
                     campaign.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.CASE: {
                     cases.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.GROUP: {
                     group.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.CONTRACT: {
                     contract.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.DASHBOARD: {
                     dashboard.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.DOCUMENT: {
                     document.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.EVENT: {
                     event.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.FOLDER: {
                     folder.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.IDEA: {
                     idea.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.LEAD: {
                     lead.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.MACRO: {
                     macro.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.NOTE: {
                     note.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.OPEN_ACTIVITY: {
                     open_activity.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.ORDER: {
                     order.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.PRODUCT: {
                     product.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.REPORT: {
                     report.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.SOLUTION: {
                     solution.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.TASK: {
                     task.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.CONTACT: {
                     contact.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                case enumDO.OPPORTUNITY: {
                     opportunity.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
                /*case enumDO.PIPELINE: {
                     pipeline.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }*/
                case enumDO.USER: {
                     user.transform(accountData,whChangedItems).then((finalItemsToWrite) => {
                         resolve(finalItemsToWrite);
                     }).catch(reject);
                     break;                    
                }
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
/*                case enumDO.ACTIVITY: {
                     let currentPage = 1;
                     activity.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                         if (finished)
                             resolve();
                     }).catch(reject);
                     break;
                  
                }*/
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
                /*case enumDO.PIPELINE: {
                     let currentPage = 1;
                     pipeline.mapAll(_this.QContent, accountData, currentPage).then((finished) => {
                         if (finished)
                             resolve();
                     }).catch(reject);
                     break;
                }*/
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
                var userId: String = result.configuration['sfdc.user.id.url'];
                accountData.userId=userId.substr(userId.lastIndexOf("/")+1)
                //cloudElements.getUserOfElementByToken(result.token).then((user: any) => { 
                //accountData.organizationId=user.organization_id;
                accountData.siteAddress= result.configuration['base.url'];
                let userIdentifier: String = accountData.userId;   //user.email;                          
                hubx2.memory.createAccount(hubXConfiguration.accountType, userIdentifier, "oAuth2", accountData, accountData.organizationId).then((accountResult) => {
                    accountData.identifier = accountResult.account.identifier;
                    let accessToken = {identifier: userIdentifier,
                                    accountType: hubXConfiguration.accountType,
                                    protocol: "oAuth2",
                                     vendorParameter: SalesForceDomainPrefix,
                                      apiKey: result.configuration['oauth.api.key'],
                                       apiSecret: result.configuration['oauth.api.secret'],
                                        accessToken: result.configuration['oauth.user.token'],
                                         refreshToken: result.configuration['oauth.user.refresh_token'],
                                          scopes: result.configuration['oauth.scope'],
                                           authorizationUrl: result.configuration['sfdc.revoke.url'],
                                            tokensUrl: result.configuration['oauth.token.url'],
                                            tokenRefreshUrl: result.configuration['oauth.token.url'],
                                        tokenExpiresAt: new Date((result.configuration['oauth.user.refresh_time']) * 1000)};
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
                        res.end('{"userIdentifier": ' + JSON.stringify(userIdentifier) + '}');                        
                        console.log("accessToken=" + accessToken);
                        console.dir(accessToken);
                        hubx2.memory.keepAccessToken(hubXConfiguration.accountType, String(userIdentifier), accessToken, true).then((newToken) => {
                            console.log("newToken=" + newToken);
                            console.dir(newToken);
                            _this.processMapEntitiesFromAccountData(accountData).then(() => {
                                console.log("Mapping Completed Successfully");
                                //Notify nerve center
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
                //}).catch(reject);
            }).catch(reject);
        });        
    }    
}