const C_DATAOBJECTNAME = "asset";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_ASSET";
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
                let newItem = {Id: null, ContactId: null, AccountId: null, ParentId: null, RootAssetId: null, 
                    Product2Id: null, IsCompetitorProduct: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null,
                    LastModifiedById: null, SystemModstamp: null, IsDeleted: null, Name: null, SerialNumber: null, InstallDate: null,
                    PurchaseDate: null, UsageEndDate: null, Status: null, Price: null, Quantity: null, Description: null, OwnerId: null,
                    LastViewedDate: null, LastReferenceDate: null, VendorUrl: ''};
                newItem.Id = item.Id;       // asset id, string
                newItem.ContactId = item.ContactId;     // string
                newItem.AccountId = item.AccountId;     // string
                newItem.ParentId = item.ParentId;       // string
                newItem.RootAssetId = item.RootAssetId; // string
                newItem.Product2Id = item.Product2Id;   // string               
                newItem.IsCompetitorProduct = item.IsCompetitorProduct;     // boolean
                newItem.CreatedDate = item.CreatedDate;     // date
                newItem.CreatedById = item.CreatedById;     // string
                newItem.LastModifiedDate = item.LastModifiedDate;       // date
                newItem.LastModifiedById = item.LastModifiedById;       // string
                newItem.SystemModstamp = item.SystemModstamp;       // date
                newItem.IsDeleted = item.IsDeleted;     // boolean
                newItem.Name = item.Name;       // string
                newItem.SerialNumber = item.SerialNumber;       // string
                newItem.InstallDate = item.InstallDate;     // date
                newItem.PurchaseDate = item.PurchaseDate;       // date
                newItem.UsageEndDate = item.UsageEndDate;       // date
                newItem.Status = item.Status;       // string
                newItem.Price = item.Price;     // number
                newItem.Quantity = item.Quantity;       // number
                newItem.Description = item.Description;     // string
                newItem.OwnerId = item.OwnerId;     // string
                newItem.LastViewedDate = item.LastViewedDate;       // date
                newItem.LastReferenceDate = item.LastReferenceDate;     // date
                newItem.VendorUrl = "https://console.cloud-elements.com/elements/api-v2/hubs/crm/objects/asset";
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