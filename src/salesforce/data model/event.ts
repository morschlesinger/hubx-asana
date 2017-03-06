const C_DATAOBJECTNAME = "event";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_EVENT";
var cloudElements = require("../../cloudElements/cloudElements");
import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";

export function transform(accountData, items) : Promise<Object[]> {
    return new Promise ((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]:[]});
        }
        else {
            items.forEach(function (item) {
                let newItem = {Id: null, WhoId: null, WhatId: null, WhoCount: null, WhatCount: null, Subject: null, Location: null, 
                    IsAllDayEvent: null, ActivityDateTime: null, ActivityDate: null, DurationInMinutes: null, StartDateTime: null, 
                    EndDateTime: null, Description: null, AccountId: null, OwnerId: null, Type: null, IsPrivate: null, 
                    ShowAs: null, IsDeleted: null, IsChild: null, IsGroupEvent: null, GroupEventType: null, CreatedDate: null, 
                    CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, IsArchived: null, 
                    RecurrenceActivityId: null, IsRecurrence: null, RecurrenceStartDateTime: null, RecurrenceEndDateOnly: null,
                    RecurrenceTimeZoneSidKey: null, RecurrenceType: null, RecurrenceInterval: null, RecurrenceDayOfWeekMask: null,
                    RecurrenceDayOfMonth: null, RecurrenceInstance: null, RecurrenceMonthOfYear: null, ReminderDateTime: null,
                    IsReminderSet: null, EventSubtype: null};
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id=item.Id;     // Activity ID, string
                newItem.WhoId=accountData.identifier + ";" + item.WhoId;       // Name ID, string
                newItem.WhatId=accountData.identifier + ";" + item.WhatId;     // Related to ID, string
                newItem.WhoCount=item.WhoCount;     // Relation Count, number
                newItem.WhatCount=item.WhatCount;     // Related to Count, number
                newItem.Subject=item.Subject;     // unknown
                newItem.Location=item.Location;       // string
                newItem.IsAllDayEvent=item.IsAllDayEvent;       // All-Day Event, boolean
                newItem.ActivityDateTime=item.ActivityDateTime;     // Due Date Time, date
                newItem.ActivityDate=item.ActivityDate;     // Due Date Only, date     
                newItem.DurationInMinutes=item.DurationInMinutes;     // Duration, number
                newItem.StartDateTime=item.StartDateTime;       // date
                newItem.EndDateTime=item.EndDateTime;     // date      
                newItem.Description=item.Description;     // string
                newItem.AccountId=accountData.identifier + ";" + item.AccountId;     // string
                newItem.OwnerId=accountData.identifier + ";" + item.OwnerId;     // Assigned to ID, string
                newItem.Type=item.Type;       // string
                newItem.IsPrivate=item.IsPrivate;     // Private, boolean
                newItem.ShowAs=item.ShowAs;       // Show Time As, string
                newItem.IsDeleted=item.IsDeleted;     // boolean
                newItem.IsChild=item.IsChild;       // boolean
                newItem.IsGroupEvent=item.IsGroupEvent;       // boolean
                newItem.GroupEventType=item.GroupEventType;       // string
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=accountData.identifier + ";" + item.CreatedById;     // string
                newItem.LastModifiedDate=item.LastModifiedDate;     // date
                newItem.LastModifiedById=accountData.identifier + ";" + item.LastModifiedById;       // string
                newItem.SystemModstamp=item.SystemModstamp;       // date
                newItem.IsArchived=item.IsArchived;       // Archived, boolean
                newItem.RecurrenceActivityId=item.RecurrenceActivityId;       // string
                newItem.IsRecurrence=item.IsRecurrence;       // Create Recurring Series of Events, boolean
                newItem.RecurrenceStartDateTime=item.RecurrenceStartDateTime;     // date
                newItem.RecurrenceEndDateOnly=item.RecurrenceEndDateOnly;     // Recurrence End, date
                newItem.RecurrenceTimeZoneSidKey=item.RecurrenceTimeZoneSidKey;     // string
                newItem.RecurrenceType=item.RecurrenceType;     // string
                newItem.RecurrenceInterval=item.RecurrenceInterval;     // number
                newItem.RecurrenceDayOfWeekMask=item.RecurrenceDayOfWeekMask;     // number
                newItem.RecurrenceDayOfMonth=item.RecurrenceDayOfMonth;     // number
                newItem.RecurrenceInstance=item.RecurrenceInstance;     // string
                newItem.RecurrenceMonthOfYear=item.RecurrenceMonthOfYear;     // string
                newItem.ReminderDateTime=item.ReminderDateTime;     // Reminder Date/Time, date
                newItem.IsReminderSet=item.IsReminderSet;     // boolean
                newItem.EventSubtype=item.EventSubtype;     // string
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