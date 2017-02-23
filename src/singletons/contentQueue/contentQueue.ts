var config = require("config");
var hubXConfiguration = config.get("Core");
var hubx2 = require("@startx/hubx-core")(hubXConfiguration);
import {EVENT_TYPES,nerveCenter} from "../../services/nerveCenter";

const contentionDelayms = 5000;

function Enum(obj){
    const keysByValue = new Map();
    const EnumLookup = value => keysByValue.get(value);

    for (const key of Object.keys(obj)){
        EnumLookup[key] = obj[key];
        keysByValue.set(EnumLookup[key], key);
    }
    return Object.freeze(EnumLookup);
}

const enumBMDOMapTo = Enum({0: "SALESFORCE_USER",1: "SALESFORCE_CATEGORY",2: "SALESFORCE_GROUP",3: "SALESFORCE_SECTION",4: "SALESFORCE_TICKET_RATING",5: "SALESFORCE_TICKET_COMMENT",6: "SALESFORCE_TICKET_AUDIT",7: "SALESFORCE_TICKET_AUDIT_EVENT", 8: "SALESFORCE_TICKET", 9: "SALESFORCE_ARTICLE"});
const enumBMDOMapFrom = Enum({"SALESFORCE_USER": 0, "SALESFORCE_CATEGORY": 1, "SALESFORCE_GROUP": 2, "SALESFORCE_SECTION": 3, "SALESFORCE_TICKET_RATING": 4, "SALESFORCE_TICKET_COMMENT": 5, "SALESFORCE_TICKET_AUDIT": 6, "SALESFORCE_TICKET_AUDIT_EVENT": 7, "SALESFORCE_TICKET": 8, "SALESFORCE_ARTICLE": 9});

export class contentQueue {    
    static Q: Array<any>;
    static NerveCenter: nerveCenter;
    constructor() {
        console.log("contentQueue constructed");
        contentQueue.Q = contentQueue.GetNewQueueArray();
        contentQueue.NerveCenter = new nerveCenter;
    }      

    private static GetNewQueueArray() {
        var result = [];

        for (var iIndex=0;iIndex<10;iIndex++) {
            var newArray = [];
            newArray['QentityName'] = enumBMDOMapFrom(iIndex);
            result.push(newArray)
        }
        return result;
    }

    public mapNameEntities(accountId, entityName, nameEntities) {
        console.log("queuing " + nameEntities.length + " entities...")
        var wantedDelay;
        return new Promise((resolve, reject) => {
            var _this=this;
            if (nameEntities.length==0) {
                resolve();                
            }

            if (!contentQueue.Q['createTimestamp']) {
                contentQueue.Q['createTimestamp'] = contentQueue.GetNowTimestampLong();
                wantedDelay=contentionDelayms;
            }
            else {
                wantedDelay=500;
            }

            nameEntities.forEach(function (nameEntity){
                var newQEntity = nameEntity;
                var foundUserAccountIndex=-1;
                foundUserAccountIndex = contentQueue.Q[enumBMDOMapTo(entityName)].findIndex(function (userAccounts){
                    if (userAccounts.QaccountId==accountId) {
                        return true;
                    }
                });
                if (foundUserAccountIndex>-1) {
                    var foundEntityIndex=-1;
                    foundEntityIndex = contentQueue.Q[enumBMDOMapTo(entityName)][foundUserAccountIndex].findIndex(function (userEntityToMap) {
                        if (userEntityToMap.id == nameEntity.id) {
                            return true;
                        }
                    });
                    if (foundEntityIndex>-1) {
                        contentQueue.Q[enumBMDOMapTo(entityName)][foundUserAccountIndex][foundEntityIndex] = newQEntity;
                    }
                    else {
                        contentQueue.Q[enumBMDOMapTo(entityName)][foundUserAccountIndex].push(newQEntity);
                    }
                }
                else {
                    var newUserAccountArray = [];
                    newUserAccountArray['QaccountId'] = accountId;
                    newUserAccountArray.push(newQEntity);
                    contentQueue.Q[enumBMDOMapTo(entityName)].push(newUserAccountArray);
                }
            });
            setTimeout(contentQueue.shouldProcessQueue,wantedDelay);
            resolve();        
        });
    }

    private static shouldProcessQueue() {
        var timeToWaitms = (contentQueue.GetNowTimestampLong() - (contentQueue.Q['createTimestamp']+contentionDelayms));
        if (timeToWaitms<0) {
            setTimeout(contentQueue.shouldProcessQueue,Math.abs(timeToWaitms)+10);
        } else {
            var queueToProcess = contentQueue.Q;
            contentQueue.Q = contentQueue.GetNewQueueArray();
            contentQueue.processQueue(queueToProcess);
        }        
    }

    private static processQueue(queueToProcess) {
        queueToProcess.forEach(function (EntitiesGroup) {
            EntitiesGroup.forEach(function (accountEntities) {
                console.log("creating difference Ids list...");
                var differenceItemsMap = {};
                var TempLimitCounter = 0;
                var BreakException = {};
                try {
                    accountEntities.forEach(function (itemToDiffer) {
                        TempLimitCounter++;
                        differenceItemsMap[itemToDiffer.id] = itemToDiffer;
                        if (TempLimitCounter==20) {
                            throw BreakException;
                        } 
                    });
                } catch (e) {
                    if (e !== BreakException) throw e;
                }
                console.log("checking difference...");
                hubx2.memory.findNameEntitiesDifference(EntitiesGroup.QentityName,accountEntities.QaccountId,differenceItemsMap).then((resultDifference) => {
                    console.log("mapping to memory...");
                    hubx2.memory.mapNameEntities(hubXConfiguration.accountType , accountEntities.QaccountId, EntitiesGroup.QentityName, accountEntities).then((result) => {
                        console.log("mapped to memory, notifying Nerve Center..." + result);
                        let resultDifferenceItem;
                        for (resultDifferenceItem in resultDifference) {
                            if (Object.keys(resultDifference[resultDifferenceItem]).length>0) {
                                contentQueue.NerveCenter.notifyOne(EVENT_TYPES.ENTITY_UPDATED, EntitiesGroup.QentityName, accountEntities.QaccountId, accountEntities.QaccountId + "." + resultDifferenceItem , resultDifference[resultDifferenceItem])
                            }
                        }
                        //returnCallback(null,true);                    
                    }).catch(exception => {
                        console.log("error");
                        console.dir(exception);
                        //returnCallback(exception,null);
                    });
                }).catch(exception => {
                    console.log("findNameEntitiesDifference-error");
                    console.dir(exception);
                    //returnCallback(exception,null);
                });
            });            
        });        
    }

    private static GetNowTimestampLong(): number {
        return Math.floor(new Date().valueOf());
    };    
}