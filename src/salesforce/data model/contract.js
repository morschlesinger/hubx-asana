"use strict";
const C_DATAOBJECTNAME = "contract";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CONTRACT";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, AccountId: null, Pricebook2Id: null, OwnerExpirationNotice: null, StartDate: null,
                    EndDate: null, BillingStreet: null, BillingCity: null, BillingState: null, BillingPostalCode: null, BillingCountry: null,
                    BillingLatitude: null, BillingLongitude: null, BillingGeocodeAccuracy: null, ShippingStreet: null, ShippingCity: null,
                    ShippingState: null, ShippingPostalCode: null, ShippingCountry: null, ShippingLatitude: null, ShippingLongitude: null,
                    ShippingGeocodeAccuracy: null, ContractTerm: null, OwnerId: null, Status: null, CompanySignedId: null, CompanySignedDate: null,
                    CustomerSignedId: null, CustomerSignedTitle: null, CustomerSignedDate: null, SpecialTerms: null, ActivatedById: null,
                    ActivatedDate: null, StatusCode: null, Description: null, IsDeleted: null, ContractNumber: null, LastApprovedDate: null,
                    CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    LastActivityDate: null, LastViewedDate: null, LastReferencedDate: null };
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id = item.Id;
                newItem.AccountId = accountData.identifier + ";" + item.AccountId;
                newItem.Pricebook2Id = item.Pricebook2Id;
                newItem.OwnerExpirationNotice = item.OwnerExpirationNotice;
                newItem.StartDate = item.StartDate;
                newItem.EndDate = item.EndDate;
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
                newItem.ContractTerm = item.ContractTerm;
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                newItem.Status = item.Status;
                newItem.CompanySignedId = accountData.identifier + ";" + item.CompanySignedId;
                newItem.CompanySignedDate = item.CompanySignedDate;
                newItem.CustomerSignedId = accountData.identifier + ";" + item.CustomerSignedId;
                newItem.CustomerSignedTitle = item.CustomerSignedTitle;
                newItem.CustomerSignedDate = item.CustomerSignedDate;
                newItem.SpecialTerms = item.SpecialTerms;
                newItem.ActivatedById = accountData.identifier + ";" + item.ActivatedById;
                newItem.ActivatedDate = item.ActivatedDate;
                newItem.StatusCode = item.StatusCode;
                newItem.Description = item.Description;
                newItem.IsDeleted = item.IsDeleted;
                newItem.ContractNumber = item.ContractNumber;
                newItem.LastApprovedDate = item.LastApprovedDate;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.LastActivityDate = item.LastActivityDate;
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
//# sourceMappingURL=contract.js.map