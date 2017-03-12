const C_DATAOBJECTNAME = "order";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_ORDER";
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
                let newItem = {Id: null, OwnerId: null, ContractId: null, AccountId: null, Pricebook2Id: null, EffectiveDate: null, 
                    EndDate: null, Status: null, Description: null, CustomerAuthorizedById: null, CompanyAuthorizedById: null, 
                    Type: null, BillingStreet: null, BillingCity: null, BillingState: null, BillingPostalCode: null, BillingCountry: null, 
                    BillingLatitude: null, BillingLongitude: null, BillingGeocodeAccuracy: null, ShippingStreet: null, ShippingCity: null, 
                    ShippingState: null, ShippingPostalCode: null, ShippingCountry: null, ShippingLatitude: null, ShippingLongitude: null,
                    ShippingGeocodeAccuracy: null, ActivatedDate: null, ActivatedById: null, StatusCode: null, OrderNumber: null,
                    TotalAmount: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null, IsDeleted: null,
                    SystemModstamp: null, LastViewedDate: null, LastReferencedDate: null};
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier,item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id=item.Id;     // Order ID, string
                newItem.OwnerId=accountData.identifier + ";" + item.OwnerId;       // string
                newItem.ContractId=accountData.identifier + ";" + item.ContractId;     // string
                newItem.AccountId=accountData.identifier + ";" + item.AccountId;     // string
                newItem.Pricebook2Id=item.Pricebook2Id;     // Price Book ID, string
                newItem.EffectiveDate=item.EffectiveDate;     // Order Start Date, date
                newItem.EndDate=item.EndDate;     // Order End Date, date
                newItem.Status=item.Status;     // string
                newItem.Description=item.Description;     // string
                newItem.CustomerAuthorizedById=accountData.identifier + ";" + item.CustomerAuthorizedById;     // string
                newItem.CompanyAuthorizedById=accountData.identifier + ";" + item.CompanyAuthorizedById;     // string
                newItem.Type=item.Type;     // Order Type, string
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
                newItem.ActivatedDate=item.ActivatedDate;       // date
                newItem.ActivatedById=accountData.identifier + ";" + item.ActivatedById;       // string
                newItem.StatusCode=item.StatusCode;     // Status Category, string
                newItem.OrderNumber=item.OrderNumber;     // string
                newItem.TotalAmount=item.TotalAmount;       // Order Amount, number
                newItem.CreatedDate=item.CreatedDate;       // Created Date, date
                newItem.CreatedById=accountData.identifier + ";" + item.CreatedById;       // string
                newItem.LastModifiedDate=item.LastModifiedDate;     // date
                newItem.LastModifiedById=accountData.identifier + ";" + item.LastModifiedById;     // string
                newItem.IsDeleted=item.IsDeleted;     // Deleted, boolean
                newItem.SystemModstamp=item.SystemModstamp;     // date
                newItem.LastViewedDate=item.LastViewedDate;     // date
                newItem.LastReferencedDate=item.LastReferencedDate;       // Last Referenced Date, date
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