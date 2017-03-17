"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C_DATAOBJECTNAME = "event";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_EVENT";
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
                let newItem = { Id: null, WhoId: null, WhatId: null, WhoCount: null, WhatCount: null, Subject: null, Location: null,
                    IsAllDayEvent: null, ActivityDateTime: null, ActivityDate: null, DurationInMinutes: null, StartDateTime: null,
                    EndDateTime: null, Description: null, AccountId: null, OwnerId: null, Type: null, IsPrivate: null,
                    ShowAs: null, IsDeleted: null, IsChild: null, IsGroupEvent: null, GroupEventType: null, CreatedDate: null,
                    CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, IsArchived: null,
                    RecurrenceActivityId: null, IsRecurrence: null, RecurrenceStartDateTime: null, RecurrenceEndDateOnly: null,
                    RecurrenceTimeZoneSidKey: null, RecurrenceType: null, RecurrenceInterval: null, RecurrenceDayOfWeekMask: null,
                    RecurrenceDayOfMonth: null, RecurrenceInstance: null, RecurrenceMonthOfYear: null, ReminderDateTime: null,
                    IsReminderSet: null, EventSubtype: null };
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier, item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;
                newItem.WhoId = accountData.identifier + "." + item.WhoId;
                newItem.WhatId = accountData.identifier + "." + item.WhatId;
                newItem.WhoCount = item.WhoCount;
                newItem.WhatCount = item.WhatCount;
                newItem.Subject = item.Subject;
                newItem.Location = item.Location;
                newItem.IsAllDayEvent = item.IsAllDayEvent;
                newItem.ActivityDateTime = item.ActivityDateTime;
                newItem.ActivityDate = item.ActivityDate;
                newItem.DurationInMinutes = item.DurationInMinutes;
                newItem.StartDateTime = item.StartDateTime;
                newItem.EndDateTime = item.EndDateTime;
                newItem.Description = item.Description;
                newItem.AccountId = accountData.identifier + "." + item.AccountId;
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;
                newItem.Type = item.Type;
                newItem.IsPrivate = item.IsPrivate;
                newItem.ShowAs = item.ShowAs;
                newItem.IsDeleted = item.IsDeleted;
                newItem.IsChild = item.IsChild;
                newItem.IsGroupEvent = item.IsGroupEvent;
                newItem.GroupEventType = item.GroupEventType;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.IsArchived = item.IsArchived;
                newItem.RecurrenceActivityId = item.RecurrenceActivityId;
                newItem.IsRecurrence = item.IsRecurrence;
                newItem.RecurrenceStartDateTime = item.RecurrenceStartDateTime;
                newItem.RecurrenceEndDateOnly = item.RecurrenceEndDateOnly;
                newItem.RecurrenceTimeZoneSidKey = item.RecurrenceTimeZoneSidKey;
                newItem.RecurrenceType = item.RecurrenceType;
                newItem.RecurrenceInterval = item.RecurrenceInterval;
                newItem.RecurrenceDayOfWeekMask = item.RecurrenceDayOfWeekMask;
                newItem.RecurrenceDayOfMonth = item.RecurrenceDayOfMonth;
                newItem.RecurrenceInstance = item.RecurrenceInstance;
                newItem.RecurrenceMonthOfYear = item.RecurrenceMonthOfYear;
                newItem.ReminderDateTime = item.ReminderDateTime;
                newItem.IsReminderSet = item.IsReminderSet;
                newItem.EventSubtype = item.EventSubtype;
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
