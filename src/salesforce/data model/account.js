"use strict";
const C_DATAOBJECTNAME = "Account";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_ACCOUNT";
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
                let newItem = { Id: null, IsDeleted: null, MasterRecordId: null, Name: null, Type: null,
                    ParentId: null, BillingStreet: null, BillingCity: null, BillingState: null, BillingPostalCode: null, BillingCountry: null,
                    BillingLatitude: null, BillingLongitude: null, BillingGeocodeAccuracy: null, ShippingStreet: null, ShippingCity: null,
                    ShippingState: null, ShippingPostalCode: null, ShippingCountry: null, ShippingLatitude: null, ShippingLongitude: null,
                    ShippingGeocodeAccuracy: null, Phone: null, Website: null, PhotoUrl: null, Industry: null, NumberOfEmployees: null,
                    Description: null, OwnerId: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null,
                    SystemModstamp: null, LastActivityDate: null, LastViewedDate: null, LastReferenceDate: null, Jigsaw: null,
                    JigsawCompanyID: null, AccountSource: null, DunsNumber: null, Tradestyle: null, NaicsCode: null, NaicsDesc: null,
                    YearStarted: null, SicDesc: null };
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier, item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                if (item.MasterRecordId) {
                    newItem.MasterRecordId = accountData.identifier + ";" + item.MasterRecordId;
                }
                else
                    newItem.MasterRecordId = null;
                newItem.Name = item.Name;
                newItem.Type = item.Type;
                newItem.ParentId = item.ParentId;
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
                newItem.Phone = item.Phone;
                newItem.Website = item.Website;
                newItem.PhotoUrl = item.PhotoUrl;
                newItem.Industry = item.Industry;
                newItem.NumberOfEmployees = item.NumberOfEmployees;
                newItem.Description = item.Description;
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.LastActivityDate = item.LastActivityDate;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferenceDate = item.LastReferenceDate;
                newItem.Jigsaw = item.Jigsaw;
                newItem.JigsawCompanyID = item.JigsawCompanyID;
                newItem.AccountSource = item.AccountSource;
                newItem.DunsNumber = item.DunsNumber;
                newItem.Tradestyle = item.Tradestyle;
                newItem.NaicsCode = item.NaicsCode;
                newItem.NaicsDesc = item.NaicsDesc;
                newItem.YearStarted = item.YearStarted;
                newItem.SicDesc = item.SicDesc;
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
