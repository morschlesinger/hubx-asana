const C_DATAOBJECTNAME = "opportunity";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_OPPORTUNITY";
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
                let newItem = {Id: null, IsDeleted: null, AccountId: null, Name: null, Description: null, StageName: null, Amount: null,
                    Probability: null, CloseDate: null, Type: null, NextStep: null, LeadSource: null, IsClosed: null, IsWon: null,
                    ForecastCategory: null, ForecastCategoryName: null, CampaignId: null, HasOpportunityLineItem: null, Pricebook2Id: null,
                    OwnerId: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    LastActivityDate: null, FiscalQuarter: null, FiscalYear: null, Fiscal: null, LastViewedDate: null, LastReferencedDate: null,
                    SyncedQuoteId: null, HasOpenActivity: null, HasOverdueTask: null, Budget_Confirmed__c: null, Discovery_Completed__c: null,
                    ROI_Analysis_Completed__c: null, Loss_Reason__c: null, VendorUrl: ''};
                newItem.Id=item.Id;     // Opportunity ID, string
                newItem.IsDeleted=item.IsDeleted;       // boolean
                newItem.AccountId=item.AccountId;     // string
                newItem.Name=item.Name;     // string
                newItem.Description=item.Description;       // string
                newItem.StageName=item.StageName;     // Stage, string       
                newItem.Amount=item.Amount;     // number
                newItem.Probability=item.Probability;     // Probability(%), number
                newItem.CloseDate=item.CloseDate;     // date
                newItem.Type=item.Type;       // Opportunity Type, string
                newItem.NextStep=item.NextStep;     // Next Step, string
                newItem.LeadSource=item.LeadSource;       // Lead Source, string
                newItem.IsClosed=item.IsClosed;     // Closed, boolean
                newItem.IsWon=item.IsWon;     // Won, boolean
                newItem.ForecastCategory=item.ForecastCategory;       // string
                newItem.ForecastCategoryName=item.ForecastCategoryName;     // string
                newItem.CampaignId=item.CampaignId;       // string
                newItem.HasOpportunityLineItem=item.HasOpportunityLineItem;     // Has Line Item,boolean
                newItem.Pricebook2Id=item.Pricebook2Id;       // Price Book ID, string
                newItem.OwnerId=item.OwnerId;       // string
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=item.CreatedById;     // string
                newItem.LastModifiedDate=item.LastModifiedDate;       // date
                newItem.LastModifiedById=item.LastModifiedById;       // string
                newItem.SystemModstamp=item.SystemModstamp;     // date
                newItem.LastActivityDate=item.LastActivityDate;     // date
                newItem.FiscalQuarter=item.FiscalQuarter;     // Fiscal Quarter, number
                newItem.FiscalYear=item.FiscalYear;     // Fiscal Year, number
                newItem.Fiscal=item.Fiscal;     // Fiscal Period, string
                newItem.LastViewedDate=item.LastViewedDate;       // date
                newItem.LastReferencedDate=item.LastReferencedDate;       // date
                newItem.SyncedQuoteId=item.SyncedQuoteId;     // Quote ID, string
                newItem.HasOpenActivity=item.HasOpenActivity;     // boolean
                newItem.HasOverdueTask=item.HasOverdueTask;     // boolean
                newItem.Budget_Confirmed__c=item.Budget_Confirmed__c;     // Budget Confirmed, boolean
                newItem.Discovery_Completed__c=item.Discovery_Completed__c;     // Discovery Completed, boolean
                newItem.ROI_Analysis_Completed__c=item.ROI_Analysis_Completed__c;     // ROI Analysis Completed, boolean
                newItem.Loss_Reason__c=item.Loss_Reason__c;     // Loss Reason, string
                newItem.VendorUrl = 'https://console.cloud-elements.com/elements/api-v2/hubs/crm/objects/opportunity';
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