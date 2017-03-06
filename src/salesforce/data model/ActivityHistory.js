"use strict";
const C_DATAOBJECTNAME = "activityhistory";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_ACTIVITYHISTORY";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, AccountID: null, WhoId: null, WhatId: null, Subject: null, IsTask: null, ActivityDate: null,
                    OwnerId: null, Status: null, Priority: null, IsHighPriority: null, ActivityType: null, IsClosed: null, IsAllDayEvent: null,
                    IsVisibleInSelfService: null, DurationInMinutes: null, Location: null, Description: null, IsDeleted: null, CreatedDate: null,
                    CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, CallDurationInSeconds: null,
                    CallType: null, CallDisposition: null, CallObject: null, ReminderDateTime: null, IsReminderSet: null, EndDateTime: null,
                    StartDateTime: null, PrimaryWhoId: null, PrimaryAccountId: null, ActivitySubtype: null, AlternateDetailId: null };
                newItem["_id"] = accountData.identifier + "." + item.Id;
                newItem.Id = item.Id;
                newItem.AccountID = accountData.identifier + "." + item.AccountID;
                newItem.WhoId = accountData.identifier + "." + item.WhoId;
                newItem.WhatId = accountData.identifier + "." + item.WhatId;
                newItem.Subject = item.Subject;
                newItem.IsTask = item.IsTask;
                newItem.ActivityDate = item.ActivityDate;
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;
                newItem.Status = item.Status;
                newItem.Priority = item.Priority;
                newItem.IsHighPriority = item.IsHighPriority;
                newItem.ActivityType = item.ActivityType;
                newItem.IsClosed = item.IsClosed;
                newItem.IsAllDayEvent = item.IsAllDayEvent;
                newItem.IsVisibleInSelfService = item.IsVisibleInSelfService;
                newItem.DurationInMinutes = item.DurationInMinutes;
                newItem.Location = item.Location;
                newItem.Description = item.Description;
                newItem.IsDeleted = item.IsDeleted;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.CallDurationInSeconds = item.CallDurationInSeconds;
                newItem.CallType = item.CallType;
                newItem.CallDisposition = item.CallDisposition;
                newItem.CallObject = item.CallObject;
                newItem.ReminderDateTime = item.ReminderDateTime;
                newItem.IsReminderSet = item.IsReminderSet;
                newItem.EndDateTime = item.EndDateTime;
                newItem.StartDateTime = item.StartDateTime;
                newItem.PrimaryWhoId = accountData.identifier + "." + item.PrimaryWhoId;
                newItem.PrimaryAccountId = accountData.identifier + "." + item.PrimaryAccountId;
                newItem.ActivitySubtype = item.ActivitySubtype;
                newItem.AlternateDetailId = item.AlternateDetailId;
                newArray.push(newItem);
            });
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray });
        }
    });
}
exports.transform = transform;
function mapAll(QContent, accountData, currentPage) {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPageWhere(accountData.CEelementInstanceToken, "/" + C_DATAOBJECTNAME, currentPage).then((elementsReturned) => {
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
//# sourceMappingURL=ActivityHistory.js.map