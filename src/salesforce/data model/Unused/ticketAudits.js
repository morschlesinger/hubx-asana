"use strict";
const C_DATAOBJECTNAME = "audits";
const C_DATAOBJECTENTITYNAME = "ZENDESK_TICKET_AUDIT";
var cloudElements = require("../../cloudElements/cloudElements");
const utils = require("../../utils/utils");
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var allTicketsAudits = [];
        var finalTicketsAuditsEventsToMap = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: "allTicketsAudits", allTicketsAudits: [], finalTicketsAuditsEventsToMap: [] });
        }
        else {
            items.forEach(function (item) {
                let ticketAuditEventsToMap = [];
                let newItem = { id: null, ticket_id: null, metadata: '', via: null, author_id: null, created_at: null, events: null, vendorUrl: '' };
                newItem.id = item.id;
                newItem.ticket_id = item.ticket_id;
                newItem.metadata = item.metadata;
                if (item.events) {
                    if (item.events.length > 0) {
                        item.events.forEach(function (auditEvent) {
                            auditEvent.audit_id = accountData.identifier + '.' + item.id;
                            auditEvent.ticket_id = accountData.identifier + '.' + item.ticket_id;
                            auditEvent.type = item.type;
                            auditEvent.vendorUrl = 'https://' + accountData.siteAddress + '.zendesk.com/tickets/' + item.ticket_id + "/events";
                            if (auditEvent.author_id) {
                                if (!(auditEvent.author_id == -1)) {
                                    auditEvent.author_id = accountData.identifier + '.' + auditEvent.author_id;
                                }
                            }
                            if (auditEvent.recipients)
                                if (auditEvent.recipients.length)
                                    auditEvent.recipients.forEach((recipient, index) => {
                                        auditEvent.recipients[index] = accountData.identifier + '.' + auditEvent.recipients[index];
                                    });
                            ticketAuditEventsToMap.push(auditEvent);
                        });
                        finalTicketsAuditsEventsToMap = finalTicketsAuditsEventsToMap.concat(ticketAuditEventsToMap);
                        newItem.events = utils.getPointersStringArray(ticketAuditEventsToMap, "id", accountData.identifier + '.');
                    }
                    else
                        newItem.events = null;
                }
                else
                    newItem.events = null;
                if (!(item.author_id == -1)) {
                    newItem.author_id = accountData.identifier + '.' + item.author_id;
                }
                else
                    newItem.author_id = null;
                newItem.created_at = item.created_at;
                newItem.vendorUrl = 'https://' + accountData.siteAddress + '.zendesk.com/tickets/' + item.ticket_id;
                allTicketsAudits.push(newItem);
            });
            resolve({ mainEntityName: "allTicketsAudits", allTicketsAudits: allTicketsAudits, finalTicketsAuditsEventsToMap: finalTicketsAuditsEventsToMap });
        }
    });
}
exports.transform = transform;
function getTicketsAudits(accountData, ticketsIdsArray) {
    return new Promise((resolve, reject) => {
        let allAuditsArray = [];
        let itemsProcessed = 0;
        ticketsIdsArray.forEach((item, index, array) => {
            cloudElements.GetElementObject(accountData.CEelementInstanceToken, "incidents/" + item + "/history").then((elementsReturned) => {
                itemsProcessed++;
                if (!elementsReturned || !elementsReturned.length) {
                    resolve();
                }
                else {
                    if (elementsReturned.length > 0) {
                        elementsReturned.forEach(function (ChildItem) {
                            allAuditsArray.push(ChildItem);
                        });
                    }
                    if (itemsProcessed == ticketsIdsArray.length) {
                        resolve(allAuditsArray);
                    }
                }
            }).catch(reject);
        });
    });
}
exports.getTicketsAudits = getTicketsAudits;
//# sourceMappingURL=ticketAudits.js.map