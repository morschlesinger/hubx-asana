const C_DATAOBJECTNAME = "folder";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_FOLDER";
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
                let newItem = {Id: null, Name: null, DeveloperName: null, AccessType: null, IsReadonly: null, 
                    Type: null, NamespacePrefix: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null,
                    LastModifiedById: null, SystemModstamp: null, VendorUrl: ''};
                newItem.Id = item.Id;       // Folder id, string
                newItem.Name = item.Name;     // string
                newItem.DeveloperName = item.DeveloperName;     // Folder Unique Name, string
                newItem.AccessType = item.AccessType;       // string
                newItem.IsReadonly = item.IsReadonly; // Read Only, boolean
                newItem.Type = item.Type;   // string               
                newItem.NamespacePrefix = item.NamespacePrefix;     // Namespace Prefix, string
                newItem.CreatedDate = item.CreatedDate;     // date
                newItem.CreatedById = item.CreatedById;     // string
                newItem.LastModifiedDate = item.LastModifiedDate;       // date
                newItem.LastModifiedById = item.LastModifiedById;       // string
                newItem.SystemModstamp = item.SystemModstamp;       // date
                newItem.VendorUrl = "https://console.cloud-elements.com/elements/api-v2/hubs/crm/objects/folder";
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