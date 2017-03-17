const C_DATAOBJECTNAME = "task";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_TASK";
var cloudElements = require("../../cloudElements/cloudElements");
import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";
import * as utils from "../../utils/utils"

export function transform(accountData, items) : Promise<Object[]> {
    return new Promise ((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]:[]});
        }
        else {
            items.forEach(function (item) {
                let newItem = {Id: null, WhoId: null, WhatId: null, WhoCount: null, WhatCount: null, Subject: null, ActivityDate: null, 
                    Status: null, Priority: null, IsHighPriority: null, OwnerId: null, Description: null, IsDeleted: null, AccountId: null,
                    IsClosed: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, 
                    IsArchived: null, CallDurationInSeconds: null, CallType: null, CallDisposition: null, CallObject: null,
                    ReminderDateTime: null, IsReminderSet: null, RecurrenceActivityId: null, IsRecurrence: null, RecurrenceStartDateOnly: null,
                    RecurrenceEndDateOnly: null, RecurrenceTimeZoneSidKey: null, RecurrenceType: null, RecurrenceInterval: null,
                    RecurrenceDayOfWeekMask: null, RecurrenceDayOfMonth: null, RecurrenceInstance: null, RecurrenceMonthOfYear: null,
                    RecurrenceRegeneratedType: null, TaskSubtype: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id=item.Id;     // Activity ID, string
                newItem.WhoId=accountData.identifier + "." + item.WhoId;       // Name ID, string
                newItem.WhatId=accountData.identifier + "." + item.WhatId;     // Related to ID, string
                newItem.WhoCount=item.WhoCount;     // Relation Count, number
                newItem.WhatCount=item.WhatCount;     // Related to Count, number
                newItem.Subject=item.Subject;     // unknown
                newItem.ActivityDate=item.ActivityDate;     // Due Date Only, date     
                newItem.Status=item.Status;     // string
                newItem.Priority=item.Priority;     // string
                newItem.IsHighPriority=item.IsHighPriority;     // High Priority, boolean
                newItem.OwnerId=accountData.identifier + "." + item.OwnerId;     // Assigned to ID, string
                newItem.Description=item.Description;     // string
                newItem.IsDeleted=item.IsDeleted;     // boolean
                newItem.AccountId=accountData.identifier + "." + item.AccountId;     // string
                newItem.IsClosed=item.IsClosed;     // Closed, boolean
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=accountData.identifier + "." + item.CreatedById;     // string
                newItem.LastModifiedDate=item.LastModifiedDate;     // date
                newItem.LastModifiedById=accountData.identifier + "." + item.LastModifiedById;       // string
                newItem.SystemModstamp=item.SystemModstamp;       // date
                newItem.IsArchived=item.IsArchived;       // Archived, boolean
                newItem.CallDurationInSeconds=item.CallDurationInSeconds;     // Call Duration, number
                newItem.CallType=item.CallType;     // string
                newItem.CallDisposition=item.CallDisposition;     // Call Result, string
                newItem.CallObject=item.CallObject;     // Call Object Identifier, string
                newItem.ReminderDateTime=item.ReminderDateTime;     // Reminder Date/Time, date
                newItem.IsReminderSet=item.IsReminderSet;     // Reminder Set, boolean
                newItem.RecurrenceActivityId=accountData.identifier + "." + item.RecurrenceActivityId;       // string
                newItem.IsRecurrence=item.IsRecurrence;       // Create Recurring Series of Events, boolean
                newItem.RecurrenceStartDateOnly=item.RecurrenceStartDateOnly;     // Recurrence Start, date
                newItem.RecurrenceEndDateOnly=item.RecurrenceEndDateOnly;     // Recurrence End, date
                newItem.RecurrenceTimeZoneSidKey=item.RecurrenceTimeZoneSidKey;     // Recurrence Time Zone, string
                newItem.RecurrenceType=item.RecurrenceType;     // string
                newItem.RecurrenceInterval=item.RecurrenceInterval;     // number
                newItem.RecurrenceDayOfWeekMask=item.RecurrenceDayOfWeekMask;     // number
                newItem.RecurrenceDayOfMonth=item.RecurrenceDayOfMonth;     // number
                newItem.RecurrenceInstance=item.RecurrenceInstance;     // string
                newItem.RecurrenceMonthOfYear=item.RecurrenceMonthOfYear;     // string
                newItem.ReminderDateTime=item.ReminderDateTime;     // Reminder Date/Time, date
                newItem.RecurrenceRegeneratedType=item.RecurrenceRegeneratedType;     // Repeat This Task, string
                newItem.TaskSubtype=item.TaskSubtype;     // string
                newArray.push(newItem);
            });
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray});
        }
    });        
}

export function mapAll(QContent: contentQueue, accountData, currentPage): Promise<boolean> {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, C_DATAOBJECTNAME, currentPage).then((elementsReturned: any) => {
            if (!elementsReturned || !elementsReturned.length) {
                resolve(true);
            }
            else {
                transform(accountData, elementsReturned).then((finalItemsToWrite: any) => {
                    QContent.mapNameEntities(accountData.identifier, C_DATAOBJECTENTITYNAME, finalItemsToWrite[finalItemsToWrite.mainEntityName]).then((result) => {
                        mapAll(QContent, accountData, currentPage+1).then((finished)=>{if (finished) resolve(true);}).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }
        }).catch(reject);
    });
}