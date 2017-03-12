"use strict";
const C_DATAOBJECTNAME = "group";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_GROUP";
var cloudElements = require("../../cloudElements/cloudElements");
const utils = require("../../utils/utils");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, Name: null, DeveloperName: null, RelatedId: null, Type: null, Email: null, OwnerId: null,
                    DoesSendEmailToMembers: null, DoesIncludeBosses: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null,
                    LastModifiedById: null, SystemModstamp: null };
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier, item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;
                if (!item.Name) {
                    if (item.DeveloperName) {
                        newItem.Name = item.DeveloperName;
                    }
                }
                else {
                    newItem.Name = item.Name;
                }
                newItem.DeveloperName = item.DeveloperName;
                if (item.RelatedId) {
                    newItem.RelatedId = accountData.identifier + ";" + item.RelatedId;
                }
                else
                    newItem.RelatedId = null;
                newItem.Type = item.Type;
                newItem.Email = item.Email;
                if (item.OwnerId) {
                    newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                }
                else
                    newItem.OwnerId = null;
                newItem.DoesSendEmailToMembers = item.DoesSendEmailToMembers;
                newItem.DoesIncludeBosses = item.DoesIncludeBosses;
                newItem.CreatedDate = item.CreatedDate;
                if (item.CreatedById) {
                    newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                }
                else
                    newItem.CreatedById = null;
                newItem.LastModifiedDate = item.LastModifiedDate;
                if (item.LastModifiedById) {
                    newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                }
                else
                    newItem.LastModifiedById = null;
                newItem.SystemModstamp = item.SystemModstamp;
                newArray.push(newItem);
            });
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray });
        }
    });
}
exports.transform = transform;
function mapAll(QContent, accountData, currentPage) {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, C_DATAOBJECTNAME, currentPage).then((elementsReturned) => {
            if (!elementsReturned || !elementsReturned.length) {
                resolve(true);
            }
            else {
                transform(accountData, elementsReturned).then((finalItemsToWrite) => {
                    QContent.mapNameEntities(accountData.identifier, C_DATAOBJECTENTITYNAME, finalItemsToWrite[finalItemsToWrite.mainEntityName]).then((result) => {
                        mapAll(QContent, accountData, currentPage + 1).then((finished) => { if (finished)
                            resolve(true); }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }
        }).catch(reject);
    });
}
exports.mapAll = mapAll;
