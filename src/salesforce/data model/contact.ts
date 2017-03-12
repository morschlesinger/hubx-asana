const C_DATAOBJECTNAME = "contact";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CONTACT";
var cloudElements = require("../../cloudElements/cloudElements");
import {contentQueue} from "../../singletons/contentQueue/contentQueue";
import {EVENT_TYPES} from "../../services/nerveCenter";
import * as utils from "../../utils/utils"

export function transform(accountData, items) : Promise<Object[]> {
    return new Promise ((resolve, reject) => {
        var newArray = [];
        if (!items || !items.length) {
            resolve({mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]:[]});
        }
        else {
            items.forEach(function (item) {
                let newItem = {Id: null, IsDeleted: null, MasterRecordId: null, AccountId: null, LastName: null, FirstName: null, 
                    Salutation: null, MiddleName: null, Suffix: null, Name: null, MailingStreet: null, MailingCity: null, MailingState: null,
                    MailingPostalCode: null, MailingCountry: null, MailingLatitude: null, MailingLongitude: null, MailingGeocodeAccuracy: null, 
                    Phone: null, Fax: null,  MobilePhone: null, ReportsToId: null, Email: null, Title: null, Department: null, OwnerId: null, 
                    CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null,
                    LastActivityDate: null, LastCURequestDate: null, LastCUUpdateDate: null, LastViewedDate: null, LastReferencedDate: null,
                    EmailBouncedReason: null, EmailBouncedDate: null, IsEmailBounced: null, PhotoUrl: null, Jigsaw: null, JigsawContactId: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id=item.Id;     // Contact ID, string
                newItem.IsDeleted=item.IsDeleted;       // boolean
                if (item.MasterRecordId) {
                    newItem.MasterRecordId=accountData.identifier + ";" + item.MasterRecordId;     // Parent Case ID, string
                } else newItem.MasterRecordId=null;                
                newItem.AccountId=item.AccountId;     // string
                newItem.LastName=item.LastName;     // string
                newItem.FirstName=item.FirstName;     // string
                newItem.Salutation=item.Salutation;     // string
                newItem.MiddleName=item.MiddleName;       // string
                newItem.Suffix=item.Suffix;       // string
                newItem.Name = item.Name; //item.FirstName + " " + item.MiddleName + " " + item.LastName;     // Full name, string
                newItem.MailingStreet=item.MailingStreet;       // Mailing Street, string
                newItem.MailingCity=item.MailingCity;     // Mailing City, string       
                newItem.MailingState=item.MailingState;     // Mailing State/Province, string
                newItem.MailingPostalCode=item.MailingPostalCode;     // Mailing Zip/Postal Code, string
                newItem.MailingCountry=item.MailingCountry;     // Mailing Country, string
                newItem.MailingLatitude=item.MailingLatitude;       // Mailing Latitude, number
                newItem.MailingLongitude=item.MailingLongitude;     // Mailing Longitude, number
                newItem.MailingGeocodeAccuracy=item.MailingGeocodeAccuracy;       // Mailing Geocode Accuracy, string
                newItem.Phone=item.Phone;     // Business Phone, string
                newItem.Fax=item.Fax;     // Business Fax, string
                newItem.MobilePhone=item.MobilePhone;       // string
                newItem.ReportsToId=accountData.identifier + ";" + item.ReportsToId;     // Reports To ID, string
                newItem.Email=item.Email;       // string
                newItem.Title=item.Title;     // string
                newItem.Department=item.Department;       // string
                newItem.OwnerId=accountData.identifier + ";" + item.OwnerId;       // string
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=accountData.identifier + ";" + item.CreatedById;     // string
                newItem.LastModifiedDate=item.LastModifiedDate;       // date
                newItem.LastModifiedById=accountData.identifier + ";" + item.LastModifiedById;       // string
                newItem.SystemModstamp=item.SystemModstamp;     // date
                newItem.LastActivityDate=item.LastActivityDate;     // date
                newItem.LastCURequestDate=item.LastCURequestDate;     // Last Stay-In-Touch Request Date, date
                newItem.LastCUUpdateDate=item.LastCUUpdateDate;     // Last Stay-In-Touch Save Date, date
                newItem.LastViewedDate=item.LastViewedDate;       // date
                newItem.LastReferencedDate=item.LastReferencedDate;       // date
                newItem.EmailBouncedReason=item.EmailBouncedReason;       // Email Bounced Reason, string
                newItem.EmailBouncedDate=item.EmailBouncedDate;       // Email Bounced Date, date
                newItem.IsEmailBounced=item.IsEmailBounced;       // Is Email Bounced, boolean
                newItem.PhotoUrl=item.PhotoUrl;     // string
                newItem.Jigsaw=item.Jigsaw;       // Date.com Key, string
                newItem.JigsawContactId=item.JigsawContactId;       // Jigsaw Contact ID, string
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