const C_DATAOBJECTNAME = "macro";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_MACRO";
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
                let newItem = {Id: null, OwnerId: null, IsDeleted: null, Name: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, 
                    LastModifiedById: null, SystemModstamp: null, LastViewedDate: null, LastReferencedDate: null, Description: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;       // Macro ID, string
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;     // string
                newItem.IsDeleted = item.IsDeleted;       // boolean
                newItem.Name = item.Name; // Macro Name, string
                newItem.CreatedDate = item.CreatedDate;       // date
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;       // string
                newItem.LastModifiedDate = item.LastModifiedDate;     // date
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;       // string
                newItem.SystemModstamp = item.SystemModstamp;     // date
                newItem.LastViewedDate = item.LastViewedDate;       // date
                newItem.LastReferencedDate = item.LastReferencedDate;     // date
                newItem.Description = item.Description;       // string
           /*     newItem.body = item.body;
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