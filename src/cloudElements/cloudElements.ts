var config = require("config");
var CloudElementsConfiguration = config.get("CloudElements");
var request = require("request");
var SalesforceConfiguration = config.get("SalesForce");
import * as utils from "../utils/utils"

export function getSalesForceUrl (SalesforceDomainPrefix) {
    return new Promise((resolve, reject) => {
        let request = require('request');
        var options = {
            url: CloudElementsConfiguration.apiBaseURL + utils.strReplaceAll(CloudElementsConfiguration.GetOAuthURLpath,"%s",CloudElementsConfiguration.elementKey) + "?apiKey=" + SalesforceConfiguration.apiKey + "&apiSecret=" + SalesforceConfiguration.apiSecret + "&callbackUrl=" + SalesforceConfiguration.callbackUrl + "&state=" + SalesforceDomainPrefix,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                resolve(info.oauthUrl);
            }
            else
            {
                console.log("apiSalesforce-cloudElements-getUrl-error=" + error);
                console.log("apiSalesforce-cloudElements-getUrl-response.statusCode=" + response.statusCode);
                console.dir(response);
                if (error) {
                    reject(error);
                }
                else {
                    reject(new Error(response.statusCode));
                }
            }            
        });

    });
};

export function SetInstanceName (elementToken, instanceId, newName) {
    return new Promise((resolve, reject) => {
        let request = require('request');
        let options = {
            url: CloudElementsConfiguration.apiBaseURL + '/instances/' + instanceId,
            headers: {
                'Authorization': 'User ' + CloudElementsConfiguration.userSecret + ', Organization ' + CloudElementsConfiguration.organizationSecret + ', Element ' + elementToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: {name: newName},
            json: true            
        };
        request.patch(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                        resolve(body);
                }
                else
                {
                    if (error) {
                        reject(error);
                    }
                    else {
                        reject(new Error("apiSalesforce-cloudElements--GetElementObject-Error statusCode=" + response.statusCode));
                    } 
                };
        });
    });        
}

export function deleteCEInstance (elementToken, instanceId) {
    return new Promise((resolve, reject) => {
        let request = require('request');
        let options = {
            url: CloudElementsConfiguration.apiBaseURL + '/instances/' + instanceId,
            headers: {
                'Authorization': 'User ' + CloudElementsConfiguration.userSecret + ', Organization ' + CloudElementsConfiguration.organizationSecret + ', Element ' + elementToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }                
        };
        request.delete(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                    resolve();
            }
            else
            {
                if (response.statusCode==404) {
                    resolve();
                } else {
                    console.log("************apiSalesforce-cloudElements--deleteCEInstance - something wrong error " + response.statusCode + " options:" + options);
                    reject(error);
                } 
            };
        });
    });
}

export function createInstance (SalesforceDomainPrefix, userCode) {
    return new Promise((resolve, reject) => {
        var request = require('request');        
        var createInstanceData = {"element": {
            "key": CloudElementsConfiguration.elementKey
            },
            "providerData": {
                "code": userCode
            },
            "configuration": {
                "oauth.api.key": SalesforceConfiguration.apiKey,
                "oauth.api.secret": SalesforceConfiguration.apiSecret,
                "oauth.callback.url": SalesforceConfiguration.callbackUrl,
                "salesforce.subdomain": SalesforceDomainPrefix,
                "event.notification.enabled": "false", //change this to enable webhooks/polling
                "event.vendor.type": "polling", //or "polling", event.notification.enabled = true
                "event.notification.type": "webhook", //only value supported
                "event.notification.callback.url": CloudElementsConfiguration.webhooksUrl,
                "event.notification.signature.key": CloudElementsConfiguration.webhooksSignatureKey,
                "filter.response.nulls": "false",
                "event.poller.refresh_interval": 1,
                "event.poller.configuration": "{\"agents\":{\"url\":\"/hubs/crm/agents\",\"idField\":\"id\",\"pageSize\":100,\"datesConfiguration\":{\"updatedDateField\":\"updated_at\",\"updatedDateFormat\":\"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\":\"created_at\",\"createdDateFormat\":\"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"articles\":{\"url\":\"/hubs/crm/resources/articles?where=category%20IS%20NOT%20NULL\",\"idField\":\"id\",\"pageSize\":100,\"datesConfiguration\":{\"updatedDateField\":\"updated_at\",\"updatedDateFormat\":\"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\":\"created_at\",\"createdDateFormat\":\"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"categories\":{\"url\":\"/hubs/crm/resources/categories\",\"idField\":\"id\",\"pageSize\":100,\"datesConfiguration\":{\"updatedDateField\":\"updated_at\",\"updatedDateFormat\":\"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\":\"created_at\",\"createdDateFormat\":\"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"sections\":{\"url\":\"/hubs/crm/resources/sections\",\"idField\":\"id\",\"pageSize\":100,\"datesConfiguration\":{\"updatedDateField\":\"updated_at\",\"updatedDateFormat\":\"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\":\"created_at\",\"createdDateFormat\":\"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"contacts\": {\"url\": \"/hubs/crm/contacts\",\"idField\": \"id\",\"pageSize\": 100,\"datesConfiguration\": {\"updatedDateField\": \"updated_at\",\"updatedDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\": \"created_at\",\"createdDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"userFields\": {\"url\": \"/hubs/crm/fields/user-field\",\"idField\": \"id\",\"pageSize\": 100,\"datesConfiguration\": {\"updatedDateField\": \"updated_at\",\"updatedDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\": \"created_at\",\"createdDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"incident-types\": {\"url\": \"/hubs/crm/incident-types\",\"idField\": \"id\",\"pageSize\": 100,\"datesConfiguration\": {\"updatedDateField\": \"updated_at\",\"updatedDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\": \"created_at\",\"createdDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"incidents\": {\"url\": \"/hubs/crm/incidents\",\"idField\": \"id\",\"pageSize\": 100,\"datesConfiguration\": {\"updatedDateField\": \"updated_at\",\"updatedDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\": \"created_at\",\"createdDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"priorities\": {\"url\": \"/hubs/crm/priorities\",\"idField\": \"id\",\"pageSize\": 100,\"datesConfiguration\": {\"updatedDateField\": \"updated_at\",\"updatedDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\": \"created_at\",\"createdDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"statuses\": {\"url\": \"/hubs/crm/statuses\",\"idField\": \"id\",\"pageSize\": 100,\"datesConfiguration\": {\"updatedDateField\": \"updated_at\",\"updatedDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\": \"created_at\",\"createdDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\"}},\"users\": {\"url\": \"/hubs/crm/users\",\"idField\": \"id\",\"pageSize\": 100,\"datesConfiguration\": {\"updatedDateField\": \"updated_at\",\"updatedDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\",\"createdDateField\": \"created_at\",\"createdDateFormat\": \"yyyy-MM-dd'T'HH:mm:ss'Z'\"}}}"
            },
            "tags": [
                    "test"],
            "name": "new-instance-temp-name"
        };

        var options = {
            url: CloudElementsConfiguration.apiBaseURL + '/instances',
            headers: {
                'Authorization': 'User ' + CloudElementsConfiguration.userSecret + ', Organization ' + CloudElementsConfiguration.organizationSecret,
                'Content-Type': 'application/json'
            },
            json: true,
            body: createInstanceData //JSON.stringify(createInstanceData)
        };
        request.post(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else
            {
                if (error) {
                    reject(error);
                }
                else {
                    reject(new Error("cloudElements--createInstance-Error statusCode=" + response.statusCode));
                }                    
            };
        });
    });
}

export function getUserOfElementByToken (elementToken) {
    return new Promise((resolve, reject) => {
        var request = require('request');
        var options = {
            url: CloudElementsConfiguration.apiBaseURL + '/hubs/crm/UserAppInfo',
            headers: {
                'Authorization': 'User ' + CloudElementsConfiguration.userSecret + ', Organization ' + CloudElementsConfiguration.organizationSecret + ', Element ' + elementToken,
                'Content-Type': 'application/json'
            },
            json: true            
        };             
        request.get(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else
            {
                if (error) {
                    reject(error);
                }
                else {
                    reject(new Error("cloudElements--getUserIdWithElementToken-Error statusCode=" + response.statusCode));
                }                    
            };
        });
    });
}

export function GetElementObjectPageWhere (elementToken, elementObjectName, page, where) {
    return new Promise((resolve, reject) => {
        let request = require('request');
        let options = {
            url: CloudElementsConfiguration.apiBaseURL + '/hubs/crm/' + elementObjectName + '?where=' + where + '&pageSize=' + CloudElementsConfiguration.defaultPageSize + '&page=' + page,
            headers: {
                'Authorization': 'User ' + CloudElementsConfiguration.userSecret + ', Organization ' + CloudElementsConfiguration.organizationSecret + ', Element ' + elementToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            json: true            
        };
        request.get(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                        resolve(body);
                }
                else
                {
                    if (error) {
                        reject(error);
                    }
                    else {
                        reject(new Error("cloudElements--GetElementObjectPageWhere-Error, elementObjectName=" + elementObjectName + ", statusCode=" + response.statusCode));
                    } 
                };
        });
    });
}

export function GetElementObjectPage (elementToken, elementObjectName, page) {
    return new Promise((resolve, reject) => {
        let request = require('request');
        let options = {
            url: CloudElementsConfiguration.apiBaseURL + '/hubs/crm/' + elementObjectName + '?pageSize=' + CloudElementsConfiguration.defaultPageSize + '&page=' + page,
            headers: {
                'Authorization': 'User ' + CloudElementsConfiguration.userSecret + ', Organization ' + CloudElementsConfiguration.organizationSecret + ', Element ' + elementToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            json: true            
        };
        request.get(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                        resolve(body);
                }
                else
                {
                    if (error) {
                        reject(error);
                    }
                    else {
                        reject(new Error("cloudElements--GetElementObjectPage-Error, elementObjectName=" + elementObjectName + ", statusCode=" + response.statusCode));
                    } 
                };
        });
    });
}

export function GetElementObject (elementToken, elementObjectName) {
    return new Promise((resolve, reject) => {
        let request = require('request');
        let options = {
            url: CloudElementsConfiguration.apiBaseURL + '/hubs/crm/' + elementObjectName,
            headers: {
                'Authorization': 'User ' + CloudElementsConfiguration.userSecret + ', Organization ' + CloudElementsConfiguration.organizationSecret + ', Element ' + elementToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            json: true            
        };
        request.get(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                        resolve(body);
                }
                else
                {
                    if (error) {
                        reject(error);
                    }
                    else {
                        reject(new Error("cloudElements--GetElementObject-Error statusCode=" + response.statusCode));
                    }
                };
        });
    });
}

//not used yet
export function getElementObjectsList (element) {
    let resArray: Array<String> = [];

    for (let iIndex = 0;iIndex<element.defaultTransformations.length ; iIndex++){
        resArray.push(element.defaultTransformations[iIndex].name);
    }
    return resArray;        
}
//not used yet
export function PostElementObject (elementToken, elementObjectName, elementToPost, returnCallback) {        
    let request = require('request');
    let options = {
        url: CloudElementsConfiguration.apiBaseURL + '/hubs/crm/' + elementObjectName,
        headers: {
            'Authorization': 'User ' + CloudElementsConfiguration.userSecret + ', Organization ' + CloudElementsConfiguration.organizationSecret + ', Element ' + elementToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: elementToPost,
        json: true            
    };
    request.post(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                    returnCallback(null,body);
            }
            else
            {
                console.log("************cloudElements-GetElementObject - something wrong error " + response.statusCode + " options:" + options);
                returnCallback(error,null);
            };
    });
}