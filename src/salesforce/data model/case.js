"use strict";
const C_DATAOBJECTNAME = "case";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CASE";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, IsDeleted: null, CaseNumber: null, ContactId: null, AccountId: null,
                    ParentId: null, SuppliedName: null, SuppliedEmail: null, SuppliedPhone: null, SuppliedCompany: null, Type: null,
                    Status: null, Reason: null, Origin: null, Subject: null, Priority: null, Description: null, IsClosed: null,
                    ClosedDate: null, IsEscalated: null, OwnerId: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null,
                    LastModifiedById: null, SystemModstamp: null, ContactPhone: null, ContactMobile: null, ContactEmail: null,
                    ContactFax: null, LastViewedDate: null, LastReferencedDate: null };
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                newItem.CaseNumber = item.CaseNumber;
                newItem.ContactId = accountData.identifier + ";" + item.ContactId;
                newItem.AccountId = accountData.identifier + ";" + item.AccountId;
                if (item.ParentId) {
                    newItem.ParentId = accountData.identifier + ";" + item.ParentId;
                }
                else
                    newItem.ParentId = null;
                newItem.SuppliedName = item.SuppliedName;
                newItem.SuppliedEmail = item.SuppliedEmail;
                newItem.SuppliedPhone = item.SuppliedPhone;
                newItem.SuppliedCompany = item.SuppliedCompany;
                newItem.Type = item.Type;
                newItem.Status = item.Status;
                newItem.Reason = item.Reason;
                newItem.Origin = item.Origin;
                newItem.Subject = item.Subject;
                newItem.Priority = item.Priority;
                newItem.Description = item.Description;
                newItem.IsClosed = item.IsClosed;
                newItem.ClosedDate = item.ClosedDate;
                newItem.IsEscalated = item.IsEscalated;
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.ContactPhone = item.ContactPhone;
                newItem.ContactMobile = item.ContactMobile;
                newItem.ContactEmail = item.ContactEmail;
                newItem.ContactFax = item.ContactFax;
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
