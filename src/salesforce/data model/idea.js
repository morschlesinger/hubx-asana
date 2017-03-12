"use strict";
const C_DATAOBJECTNAME = "idea";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_IDEA";
var cloudElements = require("../../cloudElements/cloudElements");
const utils = require("../../utils/utils");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: [] });
        }
        else {
            items.forEach(function (item) {
                let newItem = { Id: null, IsDeleted: null, Title: null, RecordTypeId: null, CreatedDate: null, CreatedById: null,
                    LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, LastViewedDate: null, LastReferencedDate: null,
                    CommunityId: null, Body: null, NumComments: null, VoteScore: null, VoteTotal: null, Categories: null, Status: null,
                    LastCommentDate: null, LastCommentId: null, ParentIdeaId: null, IsHtml: null, IsMerged: null, CreatorFullPhotoUrl: null,
                    CreatorSmallPhotoUrl: null, CreatorName: null };
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier, item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                newItem.Title = item.Title;
                newItem.RecordTypeId = item.RecordTypeId;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.CommunityId = item.CommunityId;
                newItem.Body = item.Body;
                newItem.NumComments = item.NumComments;
                newItem.VoteScore = item.VoteScore;
                newItem.VoteTotal = item.VoteTotal;
                newItem.Categories = item.Categories;
                newItem.Status = item.Status;
                newItem.LastCommentDate = item.LastCommentDate;
                newItem.LastCommentId = accountData.identifier + ";" + item.LastCommentId;
                newItem.ParentIdeaId = accountData.identifier + ";" + item.ParentIdeaId;
                newItem.IsHtml = item.IsHtml;
                newItem.IsMerged = item.IsMerged;
                newItem.CreatorFullPhotoUrl = item.CreatorFullPhotoUrl;
                newItem.CreatorSmallPhotoUrl = item.CreatorSmallPhotoUrl;
                newItem.CreatorName = item.CreatorName;
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
