const C_DATAOBJECTNAME = "group";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_GROUP";
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
                let newItem = {Id: null, Name: null, DeveloperName: null, RelatedId: null, Type: null, Email: null, OwnerId: null, 
                    DoesSendEmailToMembers: null, DoesIncludeBosses: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null,
                    LastModifiedById: null, SystemModstamp: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;       // Group ID, string
                if (!item.Name) {
                    if (item.DeveloperName) {
                        newItem.Name = item.DeveloperName;
                    }
                }
                else {
                    newItem.Name = item.Name;       // string
                }
                newItem.DeveloperName = item.DeveloperName;     // string
                if (item.RelatedId) { // string
                    newItem.RelatedId = accountData.identifier + ";" + item.RelatedId;
                } else newItem.RelatedId=null;
                newItem.Type = item.Type;       // string
                newItem.Email = item.Email;     // string
                if (item.OwnerId) { // string
                    newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                } else newItem.OwnerId=null;
                newItem.DoesSendEmailToMembers = item.DoesSendEmailToMembers;       // Send Email to Members, boolean
                newItem.DoesIncludeBosses = item.DoesIncludeBosses;     // Include Bosses, boolean
                newItem.CreatedDate = item.CreatedDate;     // date
                if (item.CreatedById) { // string
                    newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                } else newItem.CreatedById=null;
                newItem.LastModifiedDate = item.LastModifiedDate;       // date
                if (item.LastModifiedById) { // string
                    newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                } else newItem.LastModifiedById=null;
                newItem.SystemModstamp = item.SystemModstamp;       // date
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