const C_DATAOBJECTNAME = "case";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CASE";
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
                let newItem = {Id: null, IsDeleted: null, CaseNumber: null, ContactId: null, AccountId: null, 
                    ParentId: null, SuppliedName: null, SuppliedEmail: null, SuppliedPhone: null, SuppliedCompany: null, Type: null, 
                    Status: null, Reason: null, Origin: null, Subject: null, Priority: null, Description: null, IsClosed: null, 
                    ClosedDate: null, IsEscalated: null, OwnerId: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, 
                    LastModifiedById: null, SystemModstamp: null, ContactPhone: null, ContactMobile: null, ContactEmail: null, 
                    ContactFax: null, LastViewedDate: null, LastReferencedDate: null};
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id=item.Id;     // Case ID, string
                newItem.IsDeleted=item.IsDeleted;       // boolean
                newItem.CaseNumber=item.CaseNumber;     // string
                newItem.ContactId=accountData.identifier + ";" + item.ContactId;     // string
                newItem.AccountId=accountData.identifier + ";" + item.AccountId;     // string
                if (item.ParentId) {
                    newItem.ParentId=accountData.identifier + ";" + item.ParentId;     // Parent Case ID, string
                } else newItem.ParentId=null;
                newItem.SuppliedName=item.SuppliedName;       // string
                newItem.SuppliedEmail=item.SuppliedEmail;       // string
                newItem.SuppliedPhone=item.SuppliedPhone;     // string
                newItem.SuppliedCompany=item.SuppliedCompany;     // string     
                newItem.Type=item.Type;     // Case Type, string
                newItem.Status=item.Status;       // string
                newItem.Reason=item.Reason;     // Case Reason, string       
                newItem.Origin=item.Origin;     // Case Origin, string
                newItem.Subject=item.Subject;     // string
                newItem.Priority=item.Priority;     // string
                newItem.Description=item.Description;       // string
                newItem.IsClosed=item.IsClosed;     // boolean
                newItem.ClosedDate=item.ClosedDate;       // date
                newItem.IsEscalated=item.IsEscalated;     // boolean
                newItem.OwnerId=accountData.identifier + ";" + item.OwnerId;       // string
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=accountData.identifier + ";" + item.CreatedById;       // string
                newItem.LastModifiedDate=item.LastModifiedDate;       // date
                newItem.LastModifiedById=accountData.identifier + ";" + item.LastModifiedById;     // string
                newItem.SystemModstamp=item.SystemModstamp;     // date
                newItem.ContactPhone=item.ContactPhone;       // string
                newItem.ContactMobile=item.ContactMobile;       // string
                newItem.ContactEmail=item.ContactEmail;       // string
                newItem.ContactFax=item.ContactFax;       // string
                newItem.LastViewedDate=item.LastViewedDate;       // date
                newItem.LastReferencedDate=item.LastReferencedDate;     // date
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