const C_DATAOBJECTNAME = "user";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_USER";
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
                let newItem = {active: null, created_at: null, email: null, id: '', last_login_at: null, locale: '', moderator: null, name: '', notes: '', phone: '', photo: '', restricted_agent: null, role: '', suspended: null, tags: null, ticket_restriction: null, time_zone: '', updated_at: null, verified: null, VendorUrl: null};
                newItem.active=item.active;
                newItem.created_at=item.created_at;
                newItem.email=item.email;
                newItem.id=item.id;
                newItem.last_login_at=item.last_login_at;
                newItem.locale=item.locale;
                newItem.moderator=item.moderator;
                newItem.name=item.name;
                newItem.notes=item.notes;
                newItem.time_zone=item.time_zone;
                newItem.updated_at=item.updated_at;
                newItem.verified=item.verified;
                newItem.VendorUrl='https://console.cloud-elements.com/elements/api-v2/hubs/crm/objects/user';
                newArray.push(newItem);
            });
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray});
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