"use strict";
const C_DATAOBJECTNAME = "macro";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_MACRO";
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
                let newItem = { Id: null, OwnerId: null, IsDeleted: null, Name: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null,
                    LastModifiedById: null, SystemModstamp: null, LastViewedDate: null, LastReferencedDate: null, Description: null };
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier, item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                newItem.IsDeleted = item.IsDeleted;
                newItem.Name = item.Name;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.Description = item.Description;
                newArray.push(newItem);
            });
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray });
        }
    });
}
exports.transform = transform;
function mapAll(QContent, accountData, currentPage) {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, "/" + C_DATAOBJECTNAME, currentPage).then((elementsReturned) => {
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
