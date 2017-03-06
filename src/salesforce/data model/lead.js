"use strict";
const C_DATAOBJECTNAME = "lead";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_LEAD";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, IsDeleted: null, MasterRecordId: null, LastName: null, FirstName: null, Salutation: null,
                    MiddleName: null, Suffix: null, Name: null, Title: null, Company: null, Street: null, City: null, State: null,
                    PostalCode: null, Country: null, Latitude: null, Longitude: null, GeocodeAccuracy: null, Phone: null, MobilePhone: null,
                    Email: null, Website: null, PhotoUrl: null, LeadSource: null, Status: null, Industry: null, Rating: null,
                    NumberOfEmployees: null, OwnerId: null, IsConverted: null, ConvertedDate: null, ConvertedAccountId: null,
                    ConvertedContactId: null, ConvertedOpportunityId: null, IsUnreadByOwner: null, CreatedDate: null, CreatedById: null,
                    LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, LastActivityDate: null, LastViewedDate: null,
                    LastReferencedDate: null, Jigsaw: null, JigsawContactId: null, CompanyDunsNumber: null, EmailBouncedReason: null,
                    EmailBouncedDate: null };
                newItem["_id"] = accountData.identifier + "." + item.Id;
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                if (item.MasterRecordId) {
                    newItem.MasterRecordId = accountData.identifier + "." + item.MasterRecordId;
                }
                else
                    newItem.MasterRecordId = null;
                newItem.LastName = item.LastName;
                newItem.FirstName = item.FirstName;
                newItem.Salutation = item.Salutation;
                newItem.MiddleName = item.MiddleName;
                newItem.Suffix = item.Suffix;
                newItem.Name = item.Name;
                newItem.Title = item.Title;
                newItem.Company = item.Company;
                newItem.Street = item.Street;
                newItem.City = item.City;
                newItem.State = item.State;
                newItem.PostalCode = item.PostalCode;
                newItem.Country = item.Country;
                newItem.Latitude = item.Latitude;
                newItem.Longitude = item.Longitude;
                newItem.GeocodeAccuracy = item.GeocodeAccuracy;
                newItem.Phone = item.Phone;
                newItem.MobilePhone = item.MobilePhone;
                newItem.Email = item.Email;
                newItem.Website = item.Website;
                newItem.PhotoUrl = item.PhotoUrl;
                newItem.LeadSource = item.LeadSource;
                newItem.Status = item.Status;
                newItem.Industry = item.Industry;
                newItem.Rating = item.Rating;
                newItem.NumberOfEmployees = item.NumberOfEmployees;
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;
                newItem.IsConverted = item.IsConverted;
                newItem.ConvertedDate = item.ConvertedDate;
                newItem.ConvertedAccountId = item.ConvertedAccountId;
                newItem.ConvertedContactId = item.ConvertedContactId;
                newItem.ConvertedOpportunityId = item.ConvertedOpportunityId;
                newItem.IsUnreadByOwner = item.IsUnreadByOwner;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.LastActivityDate = item.LastActivityDate;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.Jigsaw = item.Jigsaw;
                newItem.JigsawContactId = item.JigsawContactId;
                newItem.CompanyDunsNumber = item.CompanyDunsNumber;
                newItem.EmailBouncedReason = item.EmailBouncedReason;
                newItem.EmailBouncedDate = item.EmailBouncedDate;
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
//# sourceMappingURL=lead.js.map