const C_DATAOBJECTNAME = "lead";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_LEAD";
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
                let newItem = {Id: null, IsDeleted: null, MasterRecordId: null, LastName: null, FirstName: null, Salutation: null,
                    MiddleName: null, Suffix: null, Name: null, Title: null, Company: null, Street: null, City: null, State: null,
                    PostalCode: null, Country: null, Latitude: null, Longitude: null, GeocodeAccuracy: null, Phone: null, MobilePhone: null,
                    Email: null, Website: null, PhotoUrl: null, LeadSource: null, Status: null, Industry: null, Rating: null, 
                    NumberOfEmployees: null, OwnerId: null, IsConverted: null, ConvertedDate: null, ConvertedAccountId: null,
                    ConvertedContactId: null, ConvertedOpportunityId: null, IsUnreadByOwner: null, CreatedDate: null, CreatedById: null,
                    LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, LastActivityDate: null, LastViewedDate: null, 
                    LastReferencedDate: null, Jigsaw: null, JigsawContactId: null, CompanyDunsNumber: null, EmailBouncedReason: null, 
                    EmailBouncedDate: null};
                newItem["_id"] = accountData.identifier + ";" + item.Id;
                newItem.Id=item.Id;     // Lead ID, string
                newItem.IsDeleted=item.IsDeleted;       // boolean
                if (item.MasterRecordId) {
                    newItem.MasterRecordId=accountData.identifier + ";" + item.MasterRecordId;     // Parent Case ID, string
                } else newItem.MasterRecordId=null;                
                newItem.LastName=item.LastName;     // string
                newItem.FirstName=item.FirstName;     // string
                newItem.Salutation=item.Salutation;     // string
                newItem.MiddleName=item.MiddleName;       // string
                newItem.Suffix=item.Suffix;       // string
                newItem.Name= item.Name; //item.FirstName + " " + item.MiddleName + " " + item.LastName;     // Full name, string
                newItem.Title=item.Title;     // string     
                newItem.Company=item.Company;     // string
                newItem.Street=item.Street;       // string
                newItem.City=item.City;     // string       
                newItem.State=item.State;     // State/Province, string
                newItem.PostalCode=item.PostalCode;     // Zip/Postal Code, string
                newItem.Country=item.Country;     // string
                newItem.Latitude=item.Latitude;       // number
                newItem.Longitude=item.Longitude;     // number
                newItem.GeocodeAccuracy=item.GeocodeAccuracy;       // string
                newItem.Phone=item.Phone;     // string
                newItem.MobilePhone=item.MobilePhone;       // string
                newItem.Email=item.Email;       // string
                newItem.Website=item.Website;       // string
                newItem.PhotoUrl=item.PhotoUrl;       // string
                newItem.LeadSource=item.LeadSource;     // string
                newItem.Status=item.Status;     // string
                newItem.Industry=item.Industry;       // string
                newItem.Rating=item.Rating;       // string
                newItem.NumberOfEmployees=item.NumberOfEmployees;       // Number of Employees, number
                newItem.OwnerId=accountData.identifier + ";" + item.OwnerId;       // string
                newItem.IsConverted=item.IsConverted;       // Converted, boolean
                newItem.ConvertedDate=item.ConvertedDate;     // date
                newItem.ConvertedAccountId=item.ConvertedAccountId;     // string
                newItem.ConvertedContactId=item.ConvertedContactId;     // string
                newItem.ConvertedOpportunityId=item.ConvertedOpportunityId;     // string
                newItem.IsUnreadByOwner=item.IsUnreadByOwner;     // Unread By Owner, boolean
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=accountData.identifier + ";" + item.CreatedById;     // string
                newItem.LastModifiedDate=item.LastModifiedDate;       // date
                newItem.LastModifiedById=accountData.identifier + ";" + item.LastModifiedById;       // string
                newItem.SystemModstamp=item.SystemModstamp;     // date
                newItem.LastActivityDate=item.LastActivityDate;     // date
                newItem.LastViewedDate=item.LastViewedDate;       // date
                newItem.LastReferencedDate=item.LastReferencedDate;       // date
                newItem.Jigsaw=item.Jigsaw;       // Date.com Key, string
                newItem.JigsawContactId=item.JigsawContactId;       // Jigsaw Contact ID, string
                newItem.CompanyDunsNumber=item.CompanyDunsNumber;       // Company D-U-N-S Number, string
                newItem.EmailBouncedReason=item.EmailBouncedReason;       // Email Bounced Reason, string
                newItem.EmailBouncedDate=item.EmailBouncedDate;       // Email Bounced Date, date
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