const C_DATAOBJECTNAME = "note";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_NOTE";
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
                let newItem = {Id: null, IsDeleted: null, ParentId: null, Title: null, IsPrivate: null, Body: null, OwnerId: null,
                    CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;       // Note ID, string
                newItem.IsDeleted = item.IsDeleted;     // boolean
                newItem.ParentId = accountData.identifier + "." + item.ParentId;       // string
                newItem.Title = item.Title; // string
                newItem.IsPrivate = item.IsPrivate;       // Private, boolean
                newItem.Body = item.Body;       // string
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;     // string
                newItem.CreatedDate = item.CreatedDate;       // date
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;       // string
                newItem.LastModifiedDate = item.LastModifiedDate;       // date
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;       // string
                newItem.SystemModstamp = item.SystemModstamp;     // date
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