"use strict";
const C_DATAOBJECTNAME = "order";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_ORDER";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, OwnerId: null, ContractId: null, AccountId: null, Pricebook2Id: null, EffectiveDate: null,
                    EndDate: null, Status: null, Description: null, CustomerAuthorizedById: null, CompanyAuthorizedById: null,
                    Type: null, BillingStreet: null, BillingCity: null, BillingState: null, BillingPostalCode: null, BillingCountry: null,
                    BillingLatitude: null, BillingLongitude: null, BillingGeocodeAccuracy: null, ShippingStreet: null, ShippingCity: null,
                    ShippingState: null, ShippingPostalCode: null, ShippingCountry: null, ShippingLatitude: null, ShippingLongitude: null,
                    ShippingGeocodeAccuracy: null, ActivatedDate: null, ActivatedById: null, StatusCode: null, OrderNumber: null,
                    TotalAmount: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, IsDeleted: null,
                    SystemModstamp: null, LastViewedDate: null, LastReferencedDate: null };
                newItem["_id"] = accountData.identifier + "." + item.Id;
                newItem.Id = item.Id;
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;
                newItem.ContractId = accountData.identifier + "." + item.ContractId;
                newItem.AccountId = accountData.identifier + "." + item.AccountId;
                newItem.Pricebook2Id = item.Pricebook2Id;
                newItem.EffectiveDate = item.EffectiveDate;
                newItem.EndDate = item.EndDate;
                newItem.Status = item.Status;
                newItem.Description = item.Description;
                newItem.CustomerAuthorizedById = accountData.identifier + "." + item.CustomerAuthorizedById;
                newItem.CompanyAuthorizedById = accountData.identifier + "." + item.CompanyAuthorizedById;
                newItem.Type = item.Type;
                newItem.BillingStreet = item.BillingStreet;
                newItem.BillingCity = item.BillingCity;
                newItem.BillingState = item.BillingState;
                newItem.BillingPostalCode = item.BillingPostalCode;
                newItem.BillingCountry = item.BillingCountry;
                newItem.BillingLatitude = item.BillingLatitude;
                newItem.BillingLongitude = item.BillingLongitude;
                newItem.BillingGeocodeAccuracy = item.BillingGeocodeAccuracy;
                newItem.ShippingStreet = item.ShippingStreet;
                newItem.ShippingCity = item.ShippingCity;
                newItem.ShippingState = item.ShippingState;
                newItem.ShippingPostalCode = item.ShippingPostalCode;
                newItem.ShippingCountry = item.ShippingCountry;
                newItem.ShippingLatitude = item.ShippingLatitude;
                newItem.ShippingLongitude = item.ShippingLongitude;
                newItem.ShippingGeocodeAccuracy = item.ShippingGeocodeAccuracy;
                newItem.ActivatedDate = item.ActivatedDate;
                newItem.ActivatedById = accountData.identifier + "." + item.ActivatedById;
                newItem.StatusCode = item.StatusCode;
                newItem.OrderNumber = item.OrderNumber;
                newItem.TotalAmount = item.TotalAmount;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.IsDeleted = item.IsDeleted;
                newItem.SystemModstamp = item.SystemModstamp;
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
//# sourceMappingURL=order.js.map