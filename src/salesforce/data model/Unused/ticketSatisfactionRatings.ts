const C_DATAOBJECTNAME = "ratings";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_TICKET_RATING";

var cloudElements = require("../../cloudElements/cloudElements");
import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";


//NOT IMPLEMENTED - TODO 

export function transform(accountData, items): Promise<Object[]> {
    return new Promise((resolve, reject) => {
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]:[]});
        }
        else {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: items});
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