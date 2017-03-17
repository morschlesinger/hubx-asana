const C_DATAOBJECTNAME = "document";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_DOCUMENT";
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
                let newItem = {Id: null, FolderId: null, IsDeleted: null, Name: null, DeveloperName: null, NamespacePrefix: null, ContentType: null, 
                    Type: null, IsPublic: null, BodyLength: null, Body: null, Url: null, Description: null, Keywords: null, IsInternalUseOnly: null,
                    AuthorId: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, 
                    IsBodySearchable: null, LastViewedDate: null, LastReferencedDate: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;       // Document ID, string
                newItem.FolderId = accountData.identifier + "." + item.FolderId;     // string
                newItem.IsDeleted = item.IsDeleted;       // boolean
                newItem.Name = item.Name; // Document Name, string
                newItem.DeveloperName = item.DeveloperName;   // Document Unique Name, string               
                newItem.NamespacePrefix = item.NamespacePrefix;     // Namespace Prefix, string
                newItem.ContentType = item.ContentType;     // MIME Type, string
                newItem.Type = item.Type;     // File Extension, string
                newItem.IsPublic = item.IsPublic;       // Externally Available, boolean
                newItem.BodyLength = item.BodyLength;       // Body Length, number
                newItem.Body = item.Body;       // Body, Unknown
                newItem.Url = item.Url;     // string
                newItem.Description = item.Description;       // string
                newItem.Keywords = item.Keywords;       // string
                newItem.IsInternalUseOnly = item.IsInternalUseOnly;     // Internal Use Only, boolean
                newItem.AuthorId = accountData.identifier + "." + item.AuthorId;       // string
                newItem.CreatedDate = item.CreatedDate;       // date
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;       // string
                newItem.LastModifiedDate = item.LastModifiedDate;     // date
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;       // string
                newItem.SystemModstamp = item.SystemModstamp;     // date
                newItem.IsBodySearchable = item.IsBodySearchable;     // Document Content Searchable, boolean
                newItem.LastViewedDate = item.LastViewedDate;       // date
                newItem.LastReferencedDate = item.LastReferencedDate;     // date
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