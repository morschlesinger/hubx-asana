"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const C_DATAOBJECTNAME = "dashboard";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_DASHBOARD";
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
                let newItem = { Id: null, IsDeleted: null, FolderId: null, FolderName: null, Title: null,
                    DeveloperName: null, NamespacePrefix: null, Description: null, LeftSize: null, MiddleSize: null,
                    RightSize: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    RunningUserId: null, TitleColor: null, TitleSize: null, TextColor: null, BackgroundStart: null, BackgroundEnd: null,
                    BackgroundDirection: null, Type: null, LastViewedDate: null, LastReferencedDate: null, DashboardResultRefreshedDate: null,
                    DashboardResultRunningUser: null };
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier, item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;
                newItem.IsDeleted = item.IsDeleted;
                newItem.FolderId = accountData.identifier + "." + item.FolderId;
                newItem.FolderName = item.FolderName;
                newItem.Title = item.Title;
                newItem.DeveloperName = item.DeveloperName;
                newItem.NamespacePrefix = item.NamespacePrefix;
                newItem.Description = item.Description;
                newItem.LeftSize = item.LeftSize;
                newItem.MiddleSize = item.MiddleSize;
                newItem.RightSize = item.RightSize;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + "." + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + "." + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.RunningUserId = accountData.identifier + "." + item.RunningUserId;
                newItem.TitleColor = item.TitleColor;
                newItem.TitleSize = item.TitleSize;
                newItem.TextColor = item.TextColor;
                newItem.BackgroundStart = item.BackgroundStart;
                newItem.BackgroundEnd = item.BackgroundEnd;
                newItem.BackgroundDirection = item.BackgroundDirection;
                newItem.Type = item.Type;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.DashboardResultRefreshedDate = item.DashboardResultRefreshedDate;
                newItem.DashboardResultRunningUser = item.DashboardResultRunningUser;
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
