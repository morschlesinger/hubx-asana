"use strict";
const C_DATAOBJECTNAME = "document";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_DOCUMENT";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, FolderId: null, IsDeleted: null, Name: null, DeveloperName: null, NamespacePrefix: null, ContentType: null,
                    Type: null, IsPublic: null, BodyLength: null, Body: null, Url: null, Description: null, Keywords: null, IsInternalUseOnly: null,
                    AuthorId: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    IsBodySearchable: null, LastViewedDate: null, LastReferencedDate: null };
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id = item.Id;
                newItem.FolderId = accountData.identifier + ";" + item.FolderId;
                newItem.IsDeleted = item.IsDeleted;
                newItem.Name = item.Name;
                newItem.DeveloperName = item.DeveloperName;
                newItem.NamespacePrefix = item.NamespacePrefix;
                newItem.ContentType = item.ContentType;
                newItem.Type = item.Type;
                newItem.IsPublic = item.IsPublic;
                newItem.BodyLength = item.BodyLength;
                newItem.Body = item.Body;
                newItem.Url = item.Url;
                newItem.Description = item.Description;
                newItem.Keywords = item.Keywords;
                newItem.IsInternalUseOnly = item.IsInternalUseOnly;
                newItem.AuthorId = accountData.identifier + ";" + item.AuthorId;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.IsBodySearchable = item.IsBodySearchable;
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
