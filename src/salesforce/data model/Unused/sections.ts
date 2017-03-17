const C_DATAOBJECTNAME = "sections";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_SECTION";
var cloudElements = require("../../cloudElements/cloudElements");
import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";

export function transform(accountData, items): Promise<Object[]> {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]:[]});
        }
        else {
            items.forEach(function (item) {                    
                let newItem = {outdated: null, created_at: null, name: '', description: '', id: '', updated_at: null, category_id: null, locale: null, source_locale: null, position: null, vendorUrl: ''};
                newItem.created_at = item.created_at;
                newItem.outdated = item.outdated;
                newItem.description = item.description;
                newItem.id = item.id;
                newItem.updated_at = item.updated_at;
                newItem.category_id = accountData.identifier + '.' + item.category_id;
                newItem.locale = item.locale;
                newItem.vendorUrl=item.html_url;
                newItem.source_locale = item.source_locale;
                newItem.name = item.name;
                newItem.position = item.position;                    
                newArray.push(newItem);
            });
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]:newArray});
        }
    });        
}

export function mapAll(QContent: contentQueue, accountData, currentPage): Promise<boolean> {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, "resources/" + C_DATAOBJECTNAME, currentPage).then((elementsReturned: any) => {
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