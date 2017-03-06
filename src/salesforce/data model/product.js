"use strict";
const C_DATAOBJECTNAME = "product";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_PRODUCT";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, Name: null, ProductCode: null, Description: null, IsActive: null, CreatedDate: null,
                    CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, Family: null,
                    ExternalDataSourceId: null, ExternalId: null, DisplayUrl: null, QuantityUnitOfMeasure: null, IsDeleted: null,
                    LastViewedDate: null, LastReferencedDate: null };
                newItem["_id"] = accountData.identifier + "." + item.Id;
                newItem.Id = item.Id;
                newItem.Name = item.Name;
                newItem.ProductCode = item.ProductCode;
                newItem.Description = item.Description;
                newItem.IsActive = item.IsActive;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.Family = item.Family;
                newItem.ExternalDataSourceId = item.ExternalDataSourceId;
                newItem.ExternalId = item.ExternalId;
                newItem.DisplayUrl = item.DisplayUrl;
                newItem.QuantityUnitOfMeasure = item.QuantityUnitOfMeasure;
                newItem.IsDeleted = item.IsDeleted;
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
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, C_DATAOBJECTNAME + "2", currentPage).then((elementsReturned) => {
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
