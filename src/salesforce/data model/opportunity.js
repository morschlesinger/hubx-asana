"use strict";
const C_DATAOBJECTNAME = "opportunity";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_OPPORTUNITY";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, IsDeleted: null, AccountId: null, Name: null, Description: null, StageName: null, Amount: null,
                    Probability: null, CloseDate: null, Type: null, NextStep: null, LeadSource: null, IsClosed: null, IsWon: null,
                    ForecastCategory: null, ForecastCategoryName: null, CampaignId: null, HasOpportunityLineItem: null, Pricebook2Id: null,
                    OwnerId: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    LastActivityDate: null, FiscalQuarter: null, FiscalYear: null, Fiscal: null, LastViewedDate: null, LastReferencedDate: null,
                    SyncedQuoteId: null, HasOpenActivity: null, HasOverdueTask: null, Budget_Confirmed__c: null, Discovery_Completed__c: null,
                    ROI_Analysis_Completed__c: null, Loss_Reason__c: null };
                newItem["_id"] = accountData.identifier + "." + item.Id;
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                newItem.AccountId = accountData.identifier + "." + item.AccountId;
                newItem.Name = item.Name;
                newItem.Description = item.Description;
                newItem.StageName = item.StageName;
                newItem.Amount = item.Amount;
                newItem.Probability = item.Probability;
                newItem.CloseDate = item.CloseDate;
                newItem.Type = item.Type;
                newItem.NextStep = item.NextStep;
                newItem.LeadSource = item.LeadSource;
                newItem.IsClosed = item.IsClosed;
                newItem.IsWon = item.IsWon;
                newItem.ForecastCategory = item.ForecastCategory;
                newItem.ForecastCategoryName = item.ForecastCategoryName;
                newItem.CampaignId = accountData.identifier + "." + item.CampaignId;
                newItem.HasOpportunityLineItem = item.HasOpportunityLineItem;
                newItem.Pricebook2Id = item.Pricebook2Id;
                newItem.OwnerId = accountData.identifier + "." + item.OwnerId;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.LastActivityDate = item.LastActivityDate;
                newItem.FiscalQuarter = item.FiscalQuarter;
                newItem.FiscalYear = item.FiscalYear;
                newItem.Fiscal = item.Fiscal;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.SyncedQuoteId = item.SyncedQuoteId;
                newItem.HasOpenActivity = item.HasOpenActivity;
                newItem.HasOverdueTask = item.HasOverdueTask;
                newItem.Budget_Confirmed__c = item.Budget_Confirmed__c;
                newItem.Discovery_Completed__c = item.Discovery_Completed__c;
                newItem.ROI_Analysis_Completed__c = item.ROI_Analysis_Completed__c;
                newItem.Loss_Reason__c = item.Loss_Reason__c;
                newArray.push(newItem);
            });
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray });
        }
    });
}
exports.transform = transform;
function mapAll(QContent, accountData, currentPage) {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, C_DATAOBJECTNAME, currentPage).then((elementsReturned) => {
            if (!elementsReturned || !elementsReturned.length) {
                resolve(true);
            }
            else {
                transform(accountData, elementsReturned).then((finalItemsToWrite) => {
                    QContent.mapNameEntities(accountData.identifier, C_DATAOBJECTENTITYNAME, finalItemsToWrite[finalItemsToWrite.mainEntityName]).then((result) => {
                        mapAll(QContent, accountData, currentPage + 1).then((finished) => { if (finished)
                            resolve(true); }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }
        }).catch(reject);
    });
}
exports.mapAll = mapAll;
//# sourceMappingURL=opportunity.js.map