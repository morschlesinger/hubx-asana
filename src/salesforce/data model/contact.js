"use strict";
const C_DATAOBJECTNAME = "contact";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CONTACT";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, IsDeleted: null, MasterRecordId: null, AccountId: null, LastName: null, FirstName: null,
                    Salutation: null, MiddleName: null, Suffix: null, Name: null, MailingStreet: null, MailingCity: null, MailingState: null,
                    MailingPostalCode: null, MailingCountry: null, MailingLatitude: null, MailingLongitude: null, MailingGeocodeAccuracy: null,
                    Phone: null, Fax: null, MobilePhone: null, ReportsToId: null, Email: null, Title: null, Department: null, OwnerId: null,
                    CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    LastActivityDate: null, LastCURequestDate: null, LastCUUpdateDate: null, LastViewedDate: null, LastReferencedDate: null,
                    EmailBouncedReason: null, EmailBouncedDate: null, IsEmailBounced: null, PhotoUrl: null, Jigsaw: null, JigsawContactId: null };
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                if (item.MasterRecordId) {
                    newItem.MasterRecordId = accountData.identifier + ";" + item.MasterRecordId;
                }
                else
                    newItem.MasterRecordId = null;
                newItem.AccountId = item.AccountId;
                newItem.LastName = item.LastName;
                newItem.FirstName = item.FirstName;
                newItem.Salutation = item.Salutation;
                newItem.MiddleName = item.MiddleName;
                newItem.Suffix = item.Suffix;
                newItem.Name = item.Name;
                newItem.MailingStreet = item.MailingStreet;
                newItem.MailingCity = item.MailingCity;
                newItem.MailingState = item.MailingState;
                newItem.MailingPostalCode = item.MailingPostalCode;
                newItem.MailingCountry = item.MailingCountry;
                newItem.MailingLatitude = item.MailingLatitude;
                newItem.MailingLongitude = item.MailingLongitude;
                newItem.MailingGeocodeAccuracy = item.MailingGeocodeAccuracy;
                newItem.Phone = item.Phone;
                newItem.Fax = item.Fax;
                newItem.MobilePhone = item.MobilePhone;
                newItem.ReportsToId = accountData.identifier + ";" + item.ReportsToId;
                newItem.Email = item.Email;
                newItem.Title = item.Title;
                newItem.Department = item.Department;
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.LastActivityDate = item.LastActivityDate;
                newItem.LastCURequestDate = item.LastCURequestDate;
                newItem.LastCUUpdateDate = item.LastCUUpdateDate;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.EmailBouncedReason = item.EmailBouncedReason;
                newItem.EmailBouncedDate = item.EmailBouncedDate;
                newItem.IsEmailBounced = item.IsEmailBounced;
                newItem.PhotoUrl = item.PhotoUrl;
                newItem.Jigsaw = item.Jigsaw;
                newItem.JigsawContactId = item.JigsawContactId;
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
