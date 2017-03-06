"use strict";
const C_DATAOBJECTNAME = "solution";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_SOLUTION";
var cloudElements = require("../../cloudElements/cloudElements");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, IsDeleted: null, SolutionNumber: null, SolutionName: null, IsPublished: null,
                    IsPublishedInPublicKb: null, Status: null, IsReviewed: null, SolutionNote: null, OwnerId: null, CreatedDate: null,
                    CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, TimesUsed: null, LastViewedDate: null,
                    LastReferencedDate: null, IsHtml: null };
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                newItem.SolutionNumber = item.SolutionNumber;
                newItem.SolutionName = item.SolutionName;
                newItem.IsPublished = item.IsPublished;
                newItem.IsPublishedInPublicKb = item.IsPublishedInPublicKb;
                newItem.Status = item.Status;
                newItem.IsReviewed = item.IsReviewed;
                newItem.SolutionNote = item.SolutionNote;
                newItem.OwnerId = accountData.identifier + ";" + item.OwnerId;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.TimesUsed = item.TimesUsed;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.IsHtml = item.IsHtml;
                newArray.push(newItem);
            });
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray });
        }
    });
}
exports.transform = transform;
function mapAll(QContent, accountData, currentPage) {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, "/" + C_DATAOBJECTNAME, currentPage).then((elementsReturned) => {
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
//# sourceMappingURL=solution.js.map