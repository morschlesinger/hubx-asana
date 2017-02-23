const C_DATAOBJECTNAME = "categories";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CATEGORY";
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
                let newItem = {outdated: null, created_at: null, description: '', id: '', position: null, locale: '', source_locale: '', name: '', updated_at: null, vendorUrl: ''};
                newItem.updated_at = item.updated_at;
                newItem.outdated = item.outdated;
                newItem.vendorUrl = item.html_url;
                newItem.name = item.name;
                newItem.created_at = item.created_at;
                newItem.description = item.description;
                newItem.id = item.id;
                newItem.position = item.position;
                newItem.locale = item.locale;
                newItem.source_locale = item.source_locale;
                newArray.push(newItem);
            });
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray});
        }   
    });        
}

export function mapAll(QContent: contentQueue, accountData, currentPage: number): Promise<boolean> {        
    return new Promise((resolve, reject) => { 
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, "resources/" + C_DATAOBJECTNAME, currentPage).then((elementsReturned: any) => {
            if (!elementsReturned || !elementsReturned.length) {
                resolve(true);
            }
            else {
                transform(accountData, elementsReturned).then ((finalItemsToWrite: any) => {
                    QContent.mapNameEntities(accountData.identifier, C_DATAOBJECTENTITYNAME, finalItemsToWrite[finalItemsToWrite.mainEntityName]).then((result) => {
                        mapAll(QContent, accountData, currentPage+1).then((finished)=>{if (finished) resolve(true);}).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }
        }).catch(reject);           
    });
}