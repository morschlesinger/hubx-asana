const C_DATAOBJECTNAME = "solution";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_SOLUTION";
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
                let newItem = {Id: null, IsDeleted: null, SolutionNumber: null, SolutionName: null, IsPublished: null,
                    IsPublishedInPublicKb: null, Status: null, IsReviewed: null, SolutionNote: null, OwnerId: null, CreatedDate: null,
                    CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, TimesUsed: null, LastViewedDate: null, 
                    LastReferencedDate: null, IsHtml: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;       // Solution ID, string
                newItem.IsDeleted = item.IsDeleted;     // Deleted, boolean
                newItem.SolutionNumber = item.SolutionNumber;       // string
                newItem.SolutionName = item.SolutionName;       // string
                newItem.IsPublished = item.IsPublished;       // Public, boolean
                newItem.IsPublishedInPublicKb = item.IsPublishedInPublicKb;       // Visible in Public Knowledge Base, boolean
                newItem.Status = item.Status;       // string
                newItem.IsReviewed = item.IsReviewed;       // Reviewed, boolean
                newItem.SolutionNote = item.SolutionNote;       // Description, string
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;       // string
                newItem.CreatedDate = item.CreatedDate;       // date
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;       // string
                newItem.LastModifiedDate = item.LastModifiedDate;     // date
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;       // string
                newItem.SystemModstamp = item.SystemModstamp;       // date
                newItem.TimesUsed = item.TimesUsed;       // Num Related Cases, number
                newItem.LastViewedDate = item.LastViewedDate;       // date
                newItem.LastReferencedDate = item.LastReferencedDate;     // date
                newItem.IsHtml = item.IsHtml;       // boolean
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