"use strict";
const C_DATAOBJECTNAME = "campaign";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CAMPAIGN";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, IsDeleted: null, Name: null, ParentId: null, Type: null,
                    Status: null, StartDate: null, EndDate: null, ExpectedRevenue: null, BudgetedCost: null, ActualCost: null,
                    ExpectedResponse: null, NumberSent: null, IsActive: null, Description: null, NumberOfLeads: null, NumberOfConvertedLeads: null,
                    NumberOfContacts: null, NumberOfResponses: null, NumberOfOpportunities: null, NumberOfWonOpportunities: null,
                    AmountAllOpportunities: null, AmountWonOpportunities: null, OwnerId: null, CreatedDate: null, CreatedById: null,
                    LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, LastActivityDate: null, LastViewedDate: null,
                    LastReferencedDate: null, CampaignMemberRecordTypeId: null };
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                newItem.Name = item.Name;
                newItem.ParentId = accountData.identifier + ";" + item.ParentId;
                newItem.Type = item.Type;
                newItem.Status = item.Status;
                newItem.StartDate = item.StartDate;
                newItem.EndDate = item.EndDate;
                newItem.ExpectedRevenue = item.ExpectedRevenue;
                newItem.BudgetedCost = item.BudgetedCost;
                newItem.ActualCost = item.ActualCost;
                newItem.ExpectedResponse = item.ExpectedResponse;
                newItem.NumberSent = item.NumberSent;
                newItem.IsActive = item.IsActive;
                newItem.Description = item.Description;
                newItem.NumberOfLeads = item.NumberOfLeads;
                newItem.NumberOfConvertedLeads = item.NumberOfConvertedLeads;
                newItem.NumberOfContacts = item.NumberOfContacts;
                newItem.NumberOfResponses = item.NumberOfResponses;
                newItem.NumberOfOpportunities = item.NumberOfOpportunities;
                newItem.NumberOfWonOpportunities = item.NumberOfWonOpportunities;
                newItem.AmountAllOpportunities = item.AmountWonOpportunities;
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.LastActivityDate = item.LastActivityDate;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.CampaignMemberRecordTypeId = accountData.identifier + ";" + item.CampaignMemberRecordTypeId;
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
//# sourceMappingURL=campaign.js.map