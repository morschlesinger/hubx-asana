const C_DATAOBJECTNAME = "contract";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_CONTRACT";
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
                let newItem = {Id: null, AccountId: null, Pricebook2Id: null, OwnerExpirationNotice: null, StartDate: null, 
                    EndDate: null, BillingStreet: null, BillingCity: null, BillingState: null, BillingPostalCode: null, BillingCountry: null, 
                    BillingLatitude: null, BillingLongitude: null, BillingGeocodeAccuracy: null, ShippingStreet: null, ShippingCity: null, 
                    ShippingState: null, ShippingPostalCode: null, ShippingCountry: null, ShippingLatitude: null, ShippingLongitude: null,
                    ShippingGeocodeAccuracy: null, ContractTerm: null, OwnerId: null, Status: null, CompanySignedId: null, CompanySignedDate: null,
                    CustomerSignedId: null, CustomerSignedTitle: null, CustomerSignedDate: null, SpecialTerms: null, ActivatedById: null, 
                    ActivatedDate: null, StatusCode: null, Description: null, IsDeleted: null, ContractNumber: null, LastApprovedDate: null, 
                    CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, SystemModstamp: null, 
                    LastActivityDate: null, LastViewedDate: null, LastReferencedDate: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id=item.Id;     // Contract ID, string
                newItem.AccountId=accountData.identifier + ";" + item.AccountId;       // string
                newItem.Pricebook2Id=item.Pricebook2Id;     // Price Book ID, string
                newItem.OwnerExpirationNotice=item.OwnerExpirationNotice;     // string
                newItem.StartDate=item.StartDate;     // date
                newItem.EndDate=item.EndDate;     // date
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
                newItem.ContractTerm=item.ContractTerm;       // number
                newItem.OwnerId=accountData.identifier + ";" + item.OwnerId;       // string
                newItem.Status=item.Status;     // string
                newItem.CompanySignedId=accountData.identifier + ";" + item.CompanySignedId;     // Company Signed by ID, string
                newItem.CompanySignedDate=item.CompanySignedDate;       // date
                newItem.CustomerSignedId=accountData.identifier + ";" + item.CustomerSignedId;       // Customer Signed By ID, string
                newItem.CustomerSignedTitle=item.CustomerSignedTitle;       //string
                newItem.CustomerSignedDate=item.CustomerSignedDate;       // date
                newItem.SpecialTerms=item.SpecialTerms;       // string
                newItem.ActivatedById=accountData.identifier + ";" + item.ActivatedById;     // string
                newItem.ActivatedDate=item.ActivatedDate;     // date
                newItem.StatusCode=item.StatusCode;     // Status Category, string
                newItem.Description=item.Description;     // string
                newItem.IsDeleted=item.IsDeleted;     // boolean
                newItem.ContractNumber=item.ContractNumber;       // string
                newItem.LastApprovedDate=item.LastApprovedDate;     // date
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=accountData.identifier + ";" + item.CreatedById;       // string
                newItem.LastModifiedDate=item.LastModifiedDate;     // date
                newItem.LastModifiedById=accountData.identifier + ";" + item.LastModifiedById;     // string
                newItem.SystemModstamp=item.SystemModstamp;       // date
                newItem.LastActivityDate=item.LastActivityDate;       // date
                newItem.LastViewedDate=item.LastViewedDate;       // date
                newItem.LastReferencedDate=item.LastReferencedDate;       // date
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