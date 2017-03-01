const C_DATAOBJECTNAME = "Account";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_ACCOUNT";
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
                let newItem = {Id: null, IsDeleted: null, MasterRecordId: null, Name: null, Type: null, 
                    ParentId: null, BillingStreet: null, BillingCity: null, BillingState: null, BillingPostalCode: null, BillingCountry: null, 
                    BillingLatitude: null, BillingLongitude: null, BillingGeocodeAccuracy: null, ShippingStreet: null, ShippingCity: null, 
                    ShippingState: null, ShippingPostalCode: null, ShippingCountry: null, ShippingLatitude: null, ShippingLongitude: null,
                    ShippingGeocodeAccuracy: null, Phone: null, Website: null, PhotoUrl: null, Industry: null, NumberOfEmployees: null,
                    Description: null, OwnerId: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null,
                    SystemModstamp: null, LastActivityDate: null, LastViewedDate: null, LastReferenceDate: null, Jigsaw: null, 
                    JigsawCompanyID: null, AccountSource: null, DunsNumber: null, Tradestyle: null, NaicsCode: null, NaicsDesc: null,
                    YearStarted: null, SicDesc: null};
                newItem.Id=item.Id;     // Account ID, string
                newItem.IsDeleted=item.IsDeleted;       // boolean
                newItem.MasterRecordId=item.MasterRecordId;     // string
                newItem.Name=item.Name;     // string
                newItem.Type=item.Type;     // Account Type, string
                newItem.ParentId=item.ParentId;     // Parent Account ID, string
                newItem.BillingStreet=item.BillingStreet;       // string
                newItem.BillingCity=item.BillingCity;       // string
                newItem.BillingState=item.BillingState;     // Billing State/Province, string
                newItem.BillingPostalCode=item.BillingPostalCode;     // Billing Zip/Postal Code, string     
                newItem.BillingCountry=item.BillingCountry;     // string
                newItem.BillingLatitude=item.BillingLatitude;       // number
                newItem.BillingLongitude=item.BillingLongitude;     // number       
                newItem.BillingGeocodeAccuracy=item.BillingGeocodeAccuracy;     // string
                newItem.ShippingStreet=item.ShippingStreet;     // string
                newItem.ShippingCity=item.ShippingCity;     // string
                newItem.ShippingState=item.ShippingState;       // Shipping State/Province, string
                newItem.ShippingPostalCode=item.ShippingPostalCode;     // Shipping Zip/Postal Code, string
                newItem.ShippingCountry=item.ShippingCountry;       // string
                newItem.ShippingLatitude=item.ShippingLatitude;     // number
                newItem.ShippingLongitude=item.ShippingLongitude;       // number
                newItem.ShippingGeocodeAccuracy=item.ShippingGeocodeAccuracy;       // string
                newItem.Phone=item.Phone;       // string
                newItem.Website=item.Website;       // string
                newItem.PhotoUrl=item.PhotoUrl;     // string
                newItem.Industry=item.Industry;     // string
                newItem.NumberOfEmployees=item.NumberOfEmployees;       // number
                newItem.Description=item.Description;       // Account Description, string
                newItem.OwnerId=item.OwnerId;       //string
                newItem.CreatedDate=item.CreatedDate;       // Created Date, date
                newItem.CreatedById=item.CreatedById;       // string
                newItem.LastModifiedDate=item.LastModifiedDate;     // date
                newItem.LastModifiedById=item.LastModifiedById;     // string
                newItem.SystemModstamp=item.SystemModstamp;     // date
                newItem.LastActivityDate=item.LastActivityDate;     // date
                newItem.LastViewedDate=item.LastViewedDate;     // date
                newItem.LastReferenceDate=item.LastReferenceDate;       // Last Referenced Date, date
                newItem.Jigsaw=item.Jigsaw;     // Data.com Key, string
                newItem.JigsawCompanyID=item.JigsawCompanyID;       // Jigsaw Company ID, string
                newItem.AccountSource=item.AccountSource;       // string
                newItem.DunsNumber=item.DunsNumber;     // D-U-N-S Number, string
                newItem.Tradestyle=item.Tradestyle;     // string
                newItem.NaicsCode=item.NaicsCode;       // NAICS Code, string
                newItem.NaicsDesc=item.NaicsDesc;       // NAICS Description, string
                newItem.YearStarted=item.YearStarted;       // string
                newItem.SicDesc=item.SicDesc;       // SIC Description, string
                
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