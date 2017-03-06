"use strict";
const C_DATAOBJECTNAME = "asset";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_ASSET";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, ContactId: null, AccountId: null, ParentId: null, RootAssetId: null,
                    Product2Id: null, IsCompetitorProduct: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null,
                    LastModifiedById: null, SystemModstamp: null, IsDeleted: null, Name: null, SerialNumber: null, InstallDate: null,
                    PurchaseDate: null, UsageEndDate: null, Status: null, Price: null, Quantity: null, Description: null, OwnerId: null,
                    LastViewedDate: null, LastReferenceDate: null };
                newItem["_id"] = accountData.identifier + "." + item.Id;
                newItem.Id = item.Id;
                newItem.ContactId = accountData.identifier + "." + item.ContactId;
                newItem.AccountId = accountData.identifier + "." + item.AccountId;
                newItem.ParentId = accountData.identifier + "." + item.ParentId;
                newItem.RootAssetId = accountData.identifier + "." + item.RootAssetId;
                newItem.Product2Id = accountData.identifier + "." + item.Product2Id;
                newItem.IsCompetitorProduct = item.IsCompetitorProduct;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.IsDeleted = item.IsDeleted;
                newItem.Name = item.Name;
                newItem.SerialNumber = item.SerialNumber;
                newItem.InstallDate = item.InstallDate;
                newItem.PurchaseDate = item.PurchaseDate;
                newItem.UsageEndDate = item.UsageEndDate;
                newItem.Status = item.Status;
                newItem.Price = item.Price;
                newItem.Quantity = item.Quantity;
                newItem.Description = item.Description;
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferenceDate = item.LastReferenceDate;
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
//# sourceMappingURL=asset.js.map