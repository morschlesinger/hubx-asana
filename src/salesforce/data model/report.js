"use strict";
const C_DATAOBJECTNAME = "report";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_REPORT";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, OwnerId: null, FolderName: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null,
                    LastModifiedById: null, IsDeleted: null, Name: null, Description: null, DeveloperName: null, NamespacePrefix: null,
                    LastRunDate: null, SystemModstamp: null, Format: null, LastViewedDate: null, LastReferencedDate: null };
                newItem["_id"] = accountData.identifier + "." + item.Id;
                newItem.Id = item.Id;
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;
                newItem.FolderName = item.FolderName;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.IsDeleted = item.IsDeleted;
                newItem.Name = item.Name;
                newItem.Description = item.Description;
                newItem.DeveloperName = item.DeveloperName;
                newItem.NamespacePrefix = item.NamespacePrefix;
                newItem.LastRunDate = item.LastRunDate;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.Format = item.Format;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
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
//# sourceMappingURL=report.js.map