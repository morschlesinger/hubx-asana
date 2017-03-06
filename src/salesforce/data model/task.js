"use strict";
const C_DATAOBJECTNAME = "task";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_TASK";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, WhoId: null, WhatId: null, WhoCount: null, WhatCount: null, Subject: null, ActivityDate: null,
                    Status: null, Priority: null, IsHighPriority: null, OwnerId: null, Description: null, IsDeleted: null, AccountId: null,
                    IsClosed: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    IsArchived: null, CallDurationInSeconds: null, CallType: null, CallDisposition: null, CallObject: null,
                    ReminderDateTime: null, IsReminderSet: null, RecurrenceActivityId: null, IsRecurrence: null, RecurrenceStartDateOnly: null,
                    RecurrenceEndDateOnly: null, RecurrenceTimeZoneSidKey: null, RecurrenceType: null, RecurrenceInterval: null,
                    RecurrenceDayOfWeekMask: null, RecurrenceDayOfMonth: null, RecurrenceInstance: null, RecurrenceMonthOfYear: null,
                    RecurrenceRegeneratedType: null, TaskSubtype: null };
                newItem["_id"] = accountData.identifier + "." + item.Id;
                newItem.Id = item.Id;
                newItem.WhoId = accountData.identifier + "." + item.WhoId;
                newItem.WhatId = accountData.identifier + "." + item.WhatId;
                newItem.WhoCount = item.WhoCount;
                newItem.WhatCount = item.WhatCount;
                newItem.Subject = item.Subject;
                newItem.ActivityDate = item.ActivityDate;
                newItem.Status = item.Status;
                newItem.Priority = item.Priority;
                newItem.IsHighPriority = item.IsHighPriority;
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;
                newItem.Description = item.Description;
                newItem.IsDeleted = item.IsDeleted;
                newItem.AccountId = accountData.identifier + "." + item.AccountId;
                newItem.IsClosed = item.IsClosed;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.IsArchived = item.IsArchived;
                newItem.CallDurationInSeconds = item.CallDurationInSeconds;
                newItem.CallType = item.CallType;
                newItem.CallDisposition = item.CallDisposition;
                newItem.CallObject = item.CallObject;
                newItem.ReminderDateTime = item.ReminderDateTime;
                newItem.IsReminderSet = item.IsReminderSet;
                newItem.RecurrenceActivityId = accountData.identifier + "." + item.RecurrenceActivityId;
                newItem.IsRecurrence = item.IsRecurrence;
                newItem.RecurrenceStartDateOnly = item.RecurrenceStartDateOnly;
                newItem.RecurrenceEndDateOnly = item.RecurrenceEndDateOnly;
                newItem.RecurrenceTimeZoneSidKey = item.RecurrenceTimeZoneSidKey;
                newItem.RecurrenceType = item.RecurrenceType;
                newItem.RecurrenceInterval = item.RecurrenceInterval;
                newItem.RecurrenceDayOfWeekMask = item.RecurrenceDayOfWeekMask;
                newItem.RecurrenceDayOfMonth = item.RecurrenceDayOfMonth;
                newItem.RecurrenceInstance = item.RecurrenceInstance;
                newItem.RecurrenceMonthOfYear = item.RecurrenceMonthOfYear;
                newItem.ReminderDateTime = item.ReminderDateTime;
                newItem.RecurrenceRegeneratedType = item.RecurrenceRegeneratedType;
                newItem.TaskSubtype = item.TaskSubtype;
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
