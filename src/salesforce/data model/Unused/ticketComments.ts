const C_DATAOBJECTNAME = "comments";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_COMMENT";
var cloudElements = require("../../cloudElements/cloudElements");
//import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";

export function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]:[]});
        }
        else {
            items.forEach(function (item) {
                let newItem = {id: null, ticket_id: null, plain_body: '', type: '', public: false, author_id: null, created_at: null, vendorUrl: ''};
                newItem.id=item.id;
                newItem.ticket_id=item.ticket_id;
                newItem.plain_body=item.plain_body;
                newItem.type = item.type;
                newItem.public=item.public;
                if (!(item.author_id==-1)) {
                    newItem.author_id=accountData.identifier + ';' + item.author_id;
                } else newItem.author_id=null;
                newItem.created_at=item.created_at;
                newItem.vendorUrl='https://' + accountData.siteAddress + '.salesforce.com/tickets/' + item.ticket_id;
                newArray.push(newItem);
            });
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray});
        }  
    });        
}

    /*public map(accountData, currentPage: number, categoriesIDs: any[]) {
        let _this=this;
        return new Promise((resolve, reject) => {            
            cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, "resources/" + C_DATAOBJECTNAME, currentPage).then((elementsReturned: any) => {
                if (!elementsReturned || !elementsReturned.length) {
                    resolve(categoriesIDs);
                }
                else {
                    _this.transform(accountData, elementsReturned).then ((finalItemsToWrite: any[]) => {
                        finalItemsToWrite.forEach(function (catItem) {
                            categoriesIDs.push(catItem.id);
                        });
                        _this.QContent.mapNameEntities(accountData.identifier, C_DATAOBJECTENTITYNAME, finalItemsToWrite).then((result) => {
                            _this.map(accountData, currentPage+1, categoriesIDs).then((categoriesIDs)=>{if (categoriesIDs) resolve(categoriesIDs);}).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }
            }).catch(reject);           
        });
    }*/

export function getTicketsComments(accountData, ticketsIdsArray) {
    return new Promise((resolve, reject) => {
        let allCommentsArray = [];
        let itemsProcessed = 0;

        ticketsIdsArray.forEach((item, index, array) => {
            cloudElements.GetElementObject(accountData.CEelementInstanceToken, "incidents/" + item + "/comments").then((elementsReturned: any) => {
                itemsProcessed++;
                if (elementsReturned.length>0) {
                    elementsReturned.forEach(function (ChildItem) {
                        ChildItem.ticket_id = item;
                        allCommentsArray.push(ChildItem);
                    });
                }
                if(itemsProcessed == ticketsIdsArray.length) {
                    resolve(allCommentsArray);
                }
            }).catch(reject);
        });
    });        
}
