"use strict";
const C_DATAOBJECTNAME = "tickets";
const C_DATAOBJECTENTITYNAME = "ZENDESK_TICKET";
var config = require("config");
var cloudElements = require("../../cloudElements/cloudElements");
const ticketComments = require("./ticketComments");
const ticketAudits = require("./ticketAudits");
const ticketSatisfactionRatings = require("./ticketSatisfactionRatings");
const utils = require("../../utils/utils");
exports.ticketComments = ticketComments;
exports.ticketAudits = ticketAudits;
exports.ticketSatisfactionRatings = ticketSatisfactionRatings;
function transform(accountData, items) {
    return new Promise((resolve, reject) => {
        var newArray = [];
        var allSatisfactionRatingsToMap = [];
        if (!items || !items.length) {
            resolve({ mainEntityName: "finalTicketsToMap", finalTicketsToMap: [], ticketsIdsArray: [], ticketsSatisfactionRatingsToMap: [] });
        }
        items.forEach(function (item) {
            let ticketSatisfactionRatingsToMap = [];
            let newItem = { assignee_id: null, collaborator_ids: [], created_at: null, description: '', due_at: null, has_incidents: null, id: '', priority: '', comment: '', recipient: null, status: '', subject: null, submitter_id: null, tags: null, satisfaction_ratings: [], type: '', updated_at: null, vendorUrl: '' };
            if (item.assignee_id)
                newItem.assignee_id = accountData.identifier + '.' + item.assignee_id;
            if (item.collaborator_ids)
                if (item.collaborator_ids.length > 0) {
                    item.collaborator_ids.forEach(function (theitem) {
                        newItem.collaborator_ids.push(accountData.identifier + '.' + theitem);
                    });
                }
            newItem.created_at = item.created_at;
            newItem.description = item.description;
            newItem.due_at = item.due_at;
            newItem.has_incidents = item.has_incidents;
            newItem.id = item.id;
            newItem.priority = item.priority;
            newItem.comment = item.comment;
            newItem.recipient = item.recipient;
            newItem.status = item.status;
            newItem.subject = item.subject;
            if (item.submitter_id)
                newItem.submitter_id = accountData.identifier + '.' + item.submitter_id;
            if (item.tags) {
                if (item.tags.length > 0) {
                    newItem.tags = item.tags.join("|");
                }
            }
            if (item.satisfaction_ratings) {
                if (item.satisfaction_ratings.length > 0) {
                    item.satisfaction_ratings.forEach(function (rating) {
                        ticketSatisfactionRatingsToMap.push(rating);
                    });
                    allSatisfactionRatingsToMap = allSatisfactionRatingsToMap.concat(ticketSatisfactionRatingsToMap);
                    newItem.satisfaction_ratings = utils.getPointersStringArray(ticketSatisfactionRatingsToMap, "id", accountData.identifier + '.');
                }
                else
                    newItem.satisfaction_ratings = null;
            }
            else
                newItem.satisfaction_ratings = null;
            newItem.type = item.type;
            newItem.updated_at = item.updated_at;
            newItem.vendorUrl = 'https://' + accountData.siteAddress + '.zendesk.com/tickets/' + item.id;
            newArray.push(newItem);
        });
        resolve({ mainEntityName: "finalTicketsToMap", finalTicketsToMap: newArray, ticketsIdsArray: utils.getPointersStringArray(newArray, "id", ''), ticketsSatisfactionRatingsToMap: allSatisfactionRatingsToMap });
    });
}
exports.transform = transform;
function mapAll(QContent, accountData, currentPage) {
    return new Promise((resolve, reject) => {
        cloudElements.GetElementObjectPage(accountData.CEelementInstanceToken, C_DATAOBJECTNAME, currentPage).then((elementsReturned) => {
            if (!elementsReturned || !elementsReturned.length) {
                resolve(true);
            }
            else {
                transform(accountData, elementsReturned).then((args) => {
                    let finalTicketsToMap = args.finalTicketsToMap;
                    let ticketsIdsArray = args.ticketsIdsArray;
                    let ticketsSatisfactionRatingsToMap = args.ticketsSatisfactionRatingsToMap;
                    ticketSatisfactionRatings.transform(accountData, ticketsSatisfactionRatingsToMap).then((finalTicketsSatisfactionRatingsToMap) => {
                        ticketComments.getTicketsComments(accountData, ticketsIdsArray).then((commentsToWrite) => {
                            ticketComments.transform(accountData, commentsToWrite).then((finalTicketsCommentsToMap) => {
                                utils.SetObjectPointersByArrayAndField(accountData.identifier, finalTicketsToMap, finalTicketsCommentsToMap[finalTicketsCommentsToMap.mainEntityName], "comments", "id", "ticket_id", "id").then((finalTicketsToMap) => {
                                    let _finalTicketsToMap = finalTicketsToMap;
                                    ticketAudits.getTicketsAudits(accountData, ticketsIdsArray).then((auditsToWrite) => {
                                        ticketAudits.transform(accountData, auditsToWrite).then((audits) => {
                                            let finalTicketsAuditsToMap = audits.allTicketsAudits;
                                            let finalTicketsAuditsEventsToMap = audits.finalTicketsAuditsEventsToMap;
                                            utils.SetObjectPointersByArrayAndField(accountData.identifier, _finalTicketsToMap, finalTicketsAuditsToMap, "audits", "id", "ticket_id", "id").then((finalTicketsToMap) => {
                                                QContent.mapNameEntities(accountData.identifier, "ZENDESK_TICKET_COMMENT", finalTicketsCommentsToMap[finalTicketsCommentsToMap.mainEntityName]).then((result) => {
                                                    QContent.mapNameEntities(accountData.identifier, "ZENDESK_TICKET_RATING", finalTicketsSatisfactionRatingsToMap[finalTicketsSatisfactionRatingsToMap.mainEntityName]).then((result) => {
                                                        QContent.mapNameEntities(accountData.identifier, "ZENDESK_TICKET_AUDIT_EVENT", finalTicketsAuditsEventsToMap).then((result) => {
                                                            QContent.mapNameEntities(accountData.identifier, "ZENDESK_TICKET_AUDIT", finalTicketsAuditsToMap).then((result) => {
                                                                QContent.mapNameEntities(accountData.identifier, C_DATAOBJECTENTITYNAME, finalTicketsToMap).then((result) => {
                                                                    mapAll(QContent, accountData, currentPage + 1).then((finished) => { if (finished)
                                                                        resolve(true); }).catch(reject);
                                                                }).catch(reject);
                                                            }).catch(reject);
                                                        }).catch(reject);
                                                    }).catch(reject);
                                                }).catch(reject);
                                            }).catch(reject);
                                        }).catch(reject);
                                    }).catch(reject);
                                }).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    }).catch(reject);
                }).catch(reject);
            }
        }).catch(reject);
    });
}
exports.mapAll = mapAll;
function createTicket(subject, description, submitter_id, assignee_id, tags) {
    var newTicket = {
        "subject": subject,
        "description": description,
        "type": "problem",
        "via": {
            "channel": "hubx-zendesk",
        },
        "raw_subject": subject,
        "forum_topic_id": null,
        "allow_channelback": false,
        "submitter_id": submitter_id,
        "priority": "high",
        "assignee_id": assignee_id,
        "tags": tags,
        "recipient": "support@fastee.im",
        "requester_id": submitter_id
    };
}
exports.createTicket = createTicket;
//# sourceMappingURL=tickets.js.map