const C_DATAOBJECTNAME = "dashboard";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_DASHBOARD";
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
                let newItem = {Id: null, IsDeleted: null, FolderId: null, FolderName: null, Title: null, 
                    DeveloperName: null, NamespacePrefix: null, Description: null, LeftSize: null, MiddleSize: null,
                    RightSize: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    RunningUserId: null, TitleColor: null, TitleSize: null, TextColor: null, BackgroundStart: null, BackgroundEnd: null, 
                    BackgroundDirection: null, Type: null, LastViewedDate: null, LastReferencedDate: null, DashboardResultRefreshedDate: null,
                    DashboardResultRunningUser: null};
                newItem.Id = item.Id;       // Dashboard ID, string
                newItem.IsDeleted = item.IsDeleted;     // boolean
                newItem.FolderId = item.FolderId;     // string
                newItem.FolderName = item.FolderName;       // string
                newItem.Title = item.Title; // string
                newItem.DeveloperName = item.DeveloperName;   // Dashboard Unique Name, string               
                newItem.NamespacePrefix = item.NamespacePrefix;     // Namespace Prefix, string
                newItem.Description = item.Description;     // string
                newItem.LeftSize = item.LeftSize;     // Left Size, string
                newItem.MiddleSize = item.MiddleSize;       // Middle Size, string
                newItem.RightSize = item.RightSize;       // Right Size, string
                newItem.CreatedDate = item.CreatedDate;       // date
                newItem.CreatedById = item.CreatedById;     // string
                newItem.LastModifiedDate = item.LastModifiedDate;       // date
                newItem.LastModifiedById = item.LastModifiedById;       // string
                newItem.SystemModstamp = item.SystemModstamp;     // date
                newItem.RunningUserId = item.RunningUserId;       // Running User ID, string
                newItem.TitleColor = item.TitleColor;       // Title Color, number
                newItem.TitleSize = item.TitleSize;       // Title Size, number
                newItem.TextColor = item.TextColor;     // Text Color, number
                newItem.BackgroundStart = item.BackgroundStart;       // Starting Color, number
                newItem.BackgroundEnd = item.BackgroundEnd;     // Ending Color, number
                newItem.BackgroundDirection = item.BackgroundDirection;     // Background Fade Direction, string
                newItem.Type = item.Type;       // Dashboard Running User, string
                newItem.LastViewedDate = item.LastViewedDate;     // date
                newItem.LastReferencedDate = item.LastReferencedDate;     // date
                newItem.DashboardResultRefreshedDate = item.DashboardResultRefreshedDate;     // Last Refreshed For This User, string
                newItem.DashboardResultRunningUser = item.DashboardResultRunningUser;     // Running As, string
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
        cloudElements.GetElementObjectPageWhere(accountData.CEelementInstanceToken, "resources/" + C_DATAOBJECTNAME, currentPage, "category IS NOT NULL").then((elementsReturned: any) => {
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