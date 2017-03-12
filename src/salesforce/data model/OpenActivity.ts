const C_DATAOBJECTNAME = "openactivity";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_OPENACTIVITY";
var cloudElements = require("../../cloudElements/cloudElements");
import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";
import * as utils from "../../utils/utils"

export function transform(accountData, items): Promise<Object[]> {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: []});
        }
        else {
            items.forEach(function (item) {                    
                let newItem = {Id: null, AccountID: null, WhoId: null, WhatId:null, Subject: null, IsTask: null, ActivityDate: null, 
                    OwnerId: null, Status: null, Priority: null, IsHighPriority: null, ActivityType: null, IsClosed: null, IsAllDayEvent: null,
                    IsVisibleInSelfService: null, DurationInMinutes: null, Location: null, Description: null, IsDeleted: null, CreatedDate: null,
                    CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, CallDurationInSeconds: null,
                    CallType: null, CallDisposition: null, CallObject: null, ReminderDateTime: null, IsReminderSet: null, EndDateTime: null,
                    StartDateTime: null, PrimaryWhoId: null, PrimaryAccountId: null, ActivitySubtype: null, AlternateDetailId: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;       // ActivityId, string
                newItem.AccountID = accountData.identifier + ";" + item.AccountID;     // string
                newItem.WhoId = accountData.identifier + ";" + item.WhoId;     // Name ID, string
                newItem.WhatId = accountData.identifier + ";" + item.WhatId;       // Related to ID, string
                newItem.Subject = item.Subject;     // unknown
                newItem.IsTask = item.IsTask;       // Task, boolean
                newItem.ActivityDate = item.ActivityDate;       // date
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;     // Assigned to ID, string
                newItem.Status = item.Status;       // string
                newItem.Priority = item.Priority;       // String
                newItem.IsHighPriority = item.IsHighPriority;       // High Priority, boolean
                newItem.ActivityType= item.ActivityType;        // string
                newItem.IsClosed = item.IsClosed;       // Closed, boolean
                newItem.IsAllDayEvent = item.IsAllDayEvent;         // All-Day Event, boolean 
                newItem.IsVisibleInSelfService = item.IsVisibleInSelfService;       // Public, boolean       
                newItem.DurationInMinutes = item.DurationInMinutes;     // Duration, number
                newItem.Location = item.Location;           // string    
                newItem.Description = item.Description;     // Comments, string
                newItem.IsDeleted = item.IsDeleted;     // Deleted, boolean
                newItem.CreatedDate = item.CreatedDate;     // date   
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;     // string
                newItem.LastModifiedDate = item.LastModifiedDate;       // date
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;      // string
                newItem.SystemModstamp = item.SystemModstamp;      // date
                newItem.CallDurationInSeconds = item.CallDurationInSeconds;     // number
                newItem.CallType = item.CallType;       // string
                newItem.CallDisposition = item.CallDisposition;     // Call Result, string
                newItem.CallObject = item.CallObject;       // Call Object Identifier, string
                newItem.ReminderDateTime = item.ReminderDateTime;       // Reminder Date/Time, date
                newItem.IsReminderSet = item.IsReminderSet;     // Reminder Set, boolean
                newItem.EndDateTime = item.EndDateTime;     // End, date
                newItem.StartDateTime = item.StartDateTime;     // Start, date
                newItem.PrimaryWhoId = accountData.identifier + ";" + item.PrimaryWhoId;       // Primary Name ID, string
                newItem.PrimaryAccountId = accountData.identifier + ";" + item.PrimaryAccountId;       // string
                newItem.ActivitySubtype = item.ActivitySubtype;     // string
                newItem.AlternateDetailId = item.AlternateDetailId;     // Email Message ID, string
       /*         newItem.section_id = accountData.identifier + ';' + item.section_id;
                newItem.locale = item.locale;
                newItem.vendorUrl=item.html_url;
                newItem.author_id = accountData.identifier + ';' + item.author_id;
                newItem.source_locale = item.source_locale;                    
                newItem.position = item.position;
                newItem.promoted = item.promoted;
                newItem.body = item.body;
                newItem.draft = item.draft;
                newItem.comments_disabled = item.comments_disabled;
                newItem.vote_count = item.vote_count;
                if (item.vote_sum)
                    newItem.vote_sum = item.vote_sum;

                 "outdated_locales": [], TODO
               */
                newArray.push(newItem);
            
            });
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray});
        }
    });        
}

export function mapAll(QContent: contentQueue, accountData, currentPage): Promise<boolean> {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, "/" + C_DATAOBJECTNAME, currentPage).then((elementsReturned: any) => {
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