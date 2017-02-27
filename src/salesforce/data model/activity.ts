const C_DATAOBJECTNAME = "activity";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_ACTIVITY";
var cloudElements = require("../../cloudElements/cloudElements");
import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";

export function transform(accountData, items): Promise<Object[]> {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: []});
        }
        else {
            items.forEach(function (item) {                    
                let newItem = {accountID: null, activityDate: null, activityDateTime: null, createdByID: null, createdDate: null, 
                    durationInMinutes: null, endDateTime: null, id: null, isAllDayEvent: null, isArchived: null, isChild: null, 
                    isDeleted: null, isGroupEvent: null, isPrivate: null, isRecurrence: null, isReminderSet: null, 
                    lastModifiedByID: null, lastModifiedDate: null, location: null, ownerID: null, showAs: null, 
                    startDateTime: null, systemModstamp: null, whoId: null, VendorUrl: ''};
                newItem.accountID = item.accountID;
                newItem.activityDate = item.activityDate;
                newItem.activityDateTime = item.activityDateTime;
                newItem.createdByID = accountData.identifier + '.' + item.createdByID;
                newItem.createdDate = item.createdDate;
                newItem.durationInMinutes = item.durationInMinutes;
                newItem.endDateTime = item.endDateTime;
                newItem.id = item.id;
                newItem.isAllDayEvent = item.isAllDayEvent;
                newItem.isArchived = item.isArchived;
                newItem.isChild = item.isChild;
                newItem.isDeleted = item.isDeleted;
                newItem.isGroupEvent = item.isGroupEvent;
                newItem.isPrivate = item.isPrivate;
                newItem.isRecurrence = item.isRecurrence;    
                newItem.isReminderSet = item.isReminderSet;         
                newItem.lastModifiedByID = accountData.identifier + '.' + item.lastModifiedByID;    
                newItem.lastModifiedDate = item.lastModifiedDate;
                newItem.location = item.location;        
                newItem.ownerID = accountData.identifier + '.' + item.ownerID;
                newItem.showAs = item.showAs;
                newItem.startDateTime = item.startDateTime;
                newItem.systemModstamp = item.systemModstamp;     
                newItem.whoId = item.whoId;   
                newItem.VendorUrl = "https://console.cloud-elements.com/elements/api-v2/hubs/crm/accounts/" +  accountData.identifier + "/activities";                 
                
       /*         newItem.section_id = accountData.identifier + '.' + item.section_id;
                newItem.locale = item.locale;
                newItem.vendorUrl=item.html_url;
                newItem.author_id = accountData.identifier + '.' + item.author_id;
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
        cloudElements.GetElementObjectPageWhere(accountData.CEelementInstanceToken, "resources/" + C_DATAOBJECTNAME, currentPage, "category IS NOT NULL").then((elementsReturned: any) => {
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