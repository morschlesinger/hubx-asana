const C_DATAOBJECTNAME = "idea";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_IDEA";
var cloudElements = require("../../cloudElements/cloudElements");
import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";

export function transform(accountData, items): Promise<Object[]> {
    return new Promise((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: []});
        }
        else {
            items.forEach(function (item) {                    
                let newItem = {Id: null, IsDeleted: null, Title: null, RecordTypeId: null, CreatedDate: null, CreatedById: null, 
                    LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, LastViewedDate: null, LastReferencedDate: null,
                    CommunityId: null, Body: null, NumComments: null, VoteScore: null, VoteTotal: null, Categories: null, Status: null,
                    LastCommentDate: null, LastCommentId: null, ParentIdeaId: null, IsHtml: null, IsMerged: null, CreatorFullPhotoUrl: null,
                    CreatorSmallPhotoUrl: null, CreatorName: null};
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id = item.Id;       // Idea id, string
                newItem.IsDeleted = item.IsDeleted;     // Deleted, boolean
                newItem.Title = item.Title;     // string
                newItem.RecordTypeId = item.RecordTypeId;       // Record Type ID, string
                newItem.CreatedDate = item.CreatedDate; // CreatedDate, date
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;   // Created By ID, string               
                newItem.LastModifiedDate = item.LastModifiedDate;     // date
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;     // string
                newItem.SystemModstamp = item.SystemModstamp;     // date
                newItem.LastViewedDate = item.LastViewedDate;       // date
                newItem.LastReferencedDate = item.LastReferencedDate;       // date
                newItem.CommunityId = item.CommunityId;       // Zone ID, string
                newItem.Body = item.Body;       // Idea Body, string
                newItem.NumComments = item.NumComments;       // Number of Comments, number
                newItem.VoteScore = item.VoteScore;       // Vote Score, number
                newItem.VoteTotal = item.VoteTotal;       // number
                newItem.Categories = item.Categories;       // unknown
                newItem.Status = item.Status;       // string
                newItem.LastCommentDate = item.LastCommentDate;       // Last Idea Comment Date, date
                newItem.LastCommentId = accountData.identifier + ";" + item.LastCommentId;       // string
                newItem.ParentIdeaId = accountData.identifier + ";" + item.ParentIdeaId;       // Idea ID, string
                newItem.IsHtml = item.IsHtml;       // boolean
                newItem.IsMerged = item.IsMerged;       // boolean
                newItem.CreatorFullPhotoUrl = item.CreatorFullPhotoUrl;       // URL of Creator's Profile Photo, string
                newItem.CreatorSmallPhotoUrl = item.CreatorSmallPhotoUrl;       // URL of Creator's Thumbnail Photo, string
                newItem.CreatorName = item.CreatorName;       // Name of Creator, string
           /*     newItem.body = item.body;
                newItem.draft = item.draft;
                newItem.comments_disabled = item.comments_disabled;
                newItem.vote_count = item.vote_count;
                if (item.vote_sum)
                    newItem.vote_sum = item.vote_sum;

                 "outdated_locales": [], TODO
                */
                newArray.push(newItem);
            });
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray});
        }
    });        
}

export function mapAll(QContent: contentQueue, accountData, currentPage): Promise<boolean> {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, "/" + C_DATAOBJECTNAME, currentPage).then((elementsReturned: any) => {
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