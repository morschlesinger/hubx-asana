const C_DATAOBJECTNAME = "product";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_PRODUCT";
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
                let newItem = {Id: null, Name: null, ProductCode: null, Description: null, IsActive: null, CreatedDate: null, 
                    CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, Family: null,
                    ExternalDataSourceId: null, ExternalId: null, DisplayUrl: null, QuantityUnitOfMeasure: null, IsDeleted: null,
                    LastViewedDate: null, LastReferencedDate: null};
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id=item.Id;     // Product ID, string
                newItem.Name=item.Name;       // Product Name, string
                newItem.ProductCode=item.ProductCode;     // string
                newItem.Description=item.Description;     // Product Description, string
                newItem.IsActive=item.IsActive;     // Active, boolean
                newItem.CreatedDate=item.CreatedDate;       // Created Date, date
                newItem.CreatedById=accountData.identifier + ";" + item.CreatedById;       // string
                newItem.LastModifiedDate=item.LastModifiedDate;     // date
                newItem.LastModifiedById=accountData.identifier + ";" + item.LastModifiedById;     // string
                newItem.SystemModstamp=item.SystemModstamp;     // date
                newItem.Family=item.Family;       // Product Family, string
                newItem.ExternalDataSourceId=item.ExternalDataSourceId;       // External Data Source ID, string
                newItem.ExternalId=item.ExternalId;       // string
                newItem.DisplayUrl=item.DisplayUrl;       // string
                newItem.QuantityUnitOfMeasure=item.QuantityUnitOfMeasure;       // Quantity Unit of Measure, string
                newItem.IsDeleted=item.IsDeleted;       // Deleted, boolean
                newItem.LastViewedDate=item.LastViewedDate;     // date
                newItem.LastReferencedDate=item.LastReferencedDate;       // Last Referenced Date, date
                newArray.push(newItem);
            });
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray});
        }
    });        
}

export function mapAll(QContent: contentQueue, accountData, currentPage): Promise<boolean> {
    return new Promise((resolve, reject) => {
        // the "2" in the next line is because for some reason they call the object product2 in the returned api
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, C_DATAOBJECTNAME + "2", currentPage).then((elementsReturned: any) => {
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