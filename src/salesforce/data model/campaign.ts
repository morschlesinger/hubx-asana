const C_DATAOBJECTNAME = "campaign";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CAMPAIGN";
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
                let newItem = {Id: null, IsDeleted: null, Name: null, ParentId: null, Type: null, 
                    Status: null, StartDate: null, EndDate: null, ExpectedRevenue: null, BudgetedCost: null, ActualCost: null, 
                    ExpectedResponse: null, NumberSent: null, IsActive: null, Description: null, NumberOfLeads: null, NumberOfConvertedLeads: null, 
                    NumberOfContacts: null, NumberOfResponses: null, NumberOfOpportunities: null, NumberOfWonOpportunities: null, 
                    AmountAllOpportunities: null, AmountWonOpportunities: null, OwnerId: null, CreatedDate: null, CreatedById: null,
                    LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, LastActivityDate: null, LastViewedDate: null,
                    LastReferencedDate: null, CampaignMemberRecordTypeId: null};
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id=item.Id;     // Campaign ID, string
                newItem.IsDeleted=item.IsDeleted;       // boolean
                newItem.Name=item.Name;     // string
                newItem.ParentId=accountData.identifier + ";" + item.ParentId;     // Parent Campaign ID, string
                newItem.Type=item.Type;     // string
                newItem.Status=item.Status;     // string
                newItem.StartDate=item.StartDate;       // date
                newItem.EndDate=item.EndDate;       // date
                newItem.ExpectedRevenue=item.ExpectedRevenue;       // Expected Revenue in Campaign, number
                newItem.BudgetedCost=item.BudgetedCost;     // Budgeted Cost in Campaign, number     
                newItem.ActualCost=item.ActualCost;     // Actual Cost in Campaign, number
                newItem.ExpectedResponse=item.ExpectedResponse;     // Expected Response (%), number
                newItem.NumberSent=item.NumberSent;     // Num Sent In Campaign, number           
                newItem.IsActive=item.IsActive;     // boolean
                newItem.Description=item.Description;       // string
                newItem.NumberOfLeads=item.NumberOfLeads;       // Leads in Campaign, number
                newItem.NumberOfConvertedLeads=item.NumberOfConvertedLeads;     // Converted Leads in Campaign, number
                newItem.NumberOfContacts=item.NumberOfContacts;     // Contacts in Campaign, number
                newItem.NumberOfResponses=item.NumberOfResponses;       // Responses in Campaign, number
                newItem.NumberOfOpportunities=item.NumberOfOpportunities;       // Opportunities in Campaign, number
                newItem.NumberOfWonOpportunities=item.NumberOfWonOpportunities;     // Won Opportunities in Campaign, number
                newItem.AmountAllOpportunities=item.AmountWonOpportunities;     // Value Won Opportunities in Campaign, number
                newItem.OwnerId=accountData.identifier + ";" + item.OwnerId;       // string
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=accountData.identifier + ";" + item.CreatedById;       // string
                newItem.LastModifiedDate=item.LastModifiedDate;     // date
                newItem.LastModifiedById=accountData.identifier + ";" + item.LastModifiedById;     // string
                newItem.SystemModstamp=item.SystemModstamp;     // date
                newItem.LastActivityDate=item.LastActivityDate;     // date
                newItem.LastViewedDate=item.LastViewedDate;     // date
                newItem.LastReferencedDate=item.LastReferencedDate;     // Last Referenced Date, date
                newItem.CampaignMemberRecordTypeId=accountData.identifier + ";" + item.CampaignMemberRecordTypeId;     // Record Type ID, string
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