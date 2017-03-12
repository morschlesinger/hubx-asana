"use strict";
const C_DATAOBJECTNAME = "user";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_USER";
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
                let newItem = { Id: null, Username: null, LastName: null, FirstName: null, MiddleName: null, Suffix: null, Name: null,
                    CompanyName: null, Division: null, Department: null, Title: null, Street: null, City: null, State: null, PostalCode: null,
                    Country: null, Latitude: null, Longitude: null, GeocodeAccuracy: null, Email: null, EmailPreferencesAutoBcc: null,
                    EmailPreferencesAutoBccStayInTouch: null, EmailPreferencesStayInTouchReminder: null, SenderEmail: null, SenderName: null,
                    Signature: null, StayInTouchSubject: null, StayInTouchSignature: null, StayInTouchNote: null, Phone: null, Fax: null,
                    MobilePhone: null, Alias: null, CommunityNickname: null, BadgeText: null, IsActive: null, TimeZoneSidKey: null,
                    UserRoleId: null, LocaleSidKey: null, ReceivesInfoEmails: null, ReceivesAdminInfoEmails: null, EmailEncodingKey: null,
                    ProfileId: null, UserType: null, LanguageLocaleKey: null, EmployeeNumber: null, ManagerId: null, LastLoginDate: null,
                    LastPasswordChangeDate: null, CreatedDate: null, CreatedById: null, LastModifiedDate: null, LastModifiedById: null,
                    SystemModstamp: null, OfflineTrialExpirationDate: null, OfflinePdaTrialExpirationDate: null, UserPermissionsMarketingUser: null,
                    UserPermissionsOfflineUser: null, UserPermissionsAvantgoUser: null, UserPermissionsCallCenterAutoLogin: null,
                    UserPermissionsMobileUser: null, UserPermissionsSFContentUser: null, UserPermissionsSupportUser: null, ForecastEnabled: null,
                    UserPreferencesActivityRemindersPopup: null, UserPreferencesEventRemindersCheckboxDefault: null,
                    UserPreferencesTaskRemindersCheckboxDefault: null, UserPreferencesReminderSoundOff: null,
                    UserPreferencesDisableAllFeedsEmail: null, UserPreferencesDisableFollowersEmail: null,
                    UserPreferencesDisableProfilePostEmail: null, UserPreferencesDisableChangeCommentEmail: null,
                    UserPreferencesDisableLaterCommentEmail: null, UserPreferencesDisProfPostCommentEmail: null,
                    UserPreferencesApexPagesDeveloperMode: null, UserPreferencesHideCSNGetChatterMobileTask: null,
                    UserPreferencesDisableMentionsPostEmail: null, UserPreferencesDisMentionsCommentEmail: null,
                    UserPreferencesHideCSNDesktopTask: null, UserPreferencesHideChatterOnboardingSplash: null,
                    UserPreferencesHideSecondChatterOnboardingSplash: null, UserPreferencesDisCommentAfterLikeEmail: null,
                    UserPreferencesDisableLikeEmail: null, UserPreferencesSortFeedByComment: null, UserPreferencesDisableMessageEmail: null,
                    UserPreferencesDisableBookmarkEmail: null, UserPreferencesDisableSharePostEmail: null,
                    UserPreferencesEnableAutoSubForFeeds: null, UserPreferencesDisableFileShareNotificationsForApi: null,
                    UserPreferencesShowTitleToExternalUsers: null, UserPreferencesShowManagerToExternalUsers: null,
                    UserPreferencesShowEmailToExternalUsers: null, UserPreferencesShowWorkPhoneToExternalUsers: null,
                    UserPreferencesShowMobilePhoneToExternalUsers: null, UserPreferencesShowFaxToExternalUsers: null,
                    UserPreferencesShowStreetAddressToExternalUsers: null, UserPreferencesShowCityToExternalUsers: null,
                    UserPreferencesShowStateToExternalUsers: null, UserPreferencesShowPostalCodeToExternalUsers: null,
                    UserPreferencesShowCountryToExternalUsers: null, UserPreferencesShowProfilePicToGuestUsers: null,
                    UserPreferencesShowTitleToGuestUsers: null, UserPreferencesShowCityToGuestUsers: null,
                    UserPreferencesShowStateToGuestUsers: null, UserPreferencesShowPostalCodeToGuestUsers: null,
                    UserPreferencesShowCountryToGuestUsers: null, UserPreferencesHideS1BrowserUI: null, UserPreferencesDisableEndorsementEmail: null,
                    UserPreferencesPathAssistantCollapsed: null, UserPreferencesShowEmailToGuestUsers: null,
                    UserPreferencesShowManagerToGuestUsers: null, UserPreferencesShowWorkPhoneToGuestUsers: null,
                    UserPreferencesShowMobilePhoneToGuestUsers: null, UserPreferencesShowFaxToGuestUsers: null,
                    UserPreferencesShowStreetAddressToGuestUsers: null, UserPreferencesLightningExperiencePreferred: null,
                    UserPreferencesPreviewLightning: null, UserPreferencesHideEndUserOnboardingAssistantModal: null,
                    UserPreferencesHideLightningMigrationModal: null, UserPreferencesHideSfxWelcomeMat: null,
                    UserPreferencesHideBiggerPhotoCallout: null, UserPreferencesGlobalNavBarWTShown: null,
                    UserPreferencesGlobalNavGridMenuWTShown: null, UserPreferencesCreateLEXAppsWTShown: null, UserPreferencesFavoritesWTShown: null,
                    ContactId: null, AccountId: null, CallCenterId: null, Extension: null, FederationIdentifier: null, AboutMe: null,
                    FullPhotoUrl: null, SmallPhotoUrl: null, MediumPhotoUrl: null, DigestFrequency: null, DefaultGroupNotificationFrequency: null,
                    LastViewedDate: null, LastReferencedDate: null, BannerPhotoUrl: null, SmallBannerPhotoUrl: null, MediumBannerPhotoUrl: null,
                    IsProfilePhotoActive: null };
                newItem["_id"] = utils.getPrimaryKey(accountData.identifier, item.Id);
                newItem["_dbtime"] = utils.GetNowTimestampLong();
                newItem.Id = item.Id;
                newItem.Username = item.Username;
                newItem.LastName = item.LastName;
                newItem.FirstName = item.FirstName;
                newItem.MiddleName = item.MiddleName;
                newItem.Suffix = item.Suffix;
                newItem.Name = item.Name;
                newItem.CompanyName = item.CompanyName;
                newItem.Division = item.Division;
                newItem.Department = item.Department;
                newItem.Title = item.Title;
                newItem.Street = item.Street;
                newItem.City = item.City;
                newItem.State = item.State;
                newItem.PostalCode = item.PostalCode;
                newItem.Country = item.Country;
                newItem.Latitude = item.Latitude;
                newItem.Longitude = item.Longitude;
                newItem.GeocodeAccuracy = item.GeocodeAccuracy;
                newItem.Email = item.Email;
                newItem.EmailPreferencesAutoBcc = item.EmailPreferencesAutoBcc;
                newItem.EmailPreferencesAutoBccStayInTouch = item.EmailPreferencesAutoBccStayInTouch;
                newItem.EmailPreferencesStayInTouchReminder = item.EmailPreferencesStayInTouchReminder;
                newItem.SenderEmail = item.SenderEmail;
                newItem.SenderName = item.SenderName;
                newItem.Signature = item.Signature;
                newItem.StayInTouchSubject = item.StayInTouchSubject;
                newItem.StayInTouchSignature = item.StayInTouchSignature;
                newItem.StayInTouchNote = item.StayInTouchNote;
                newItem.Phone = item.Phone;
                newItem.Fax = item.Fax;
                newItem.MobilePhone = item.MobilePhone;
                newItem.Alias = item.Alias;
                newItem.CommunityNickname = item.CommunityNickname;
                newItem.BadgeText = item.BadgeText;
                newItem.IsActive = item.IsActive;
                newItem.TimeZoneSidKey = item.TimeZoneSidKey;
                newItem.UserRoleId = item.UserRoleId;
                newItem.LocaleSidKey = item.LocaleSidKey;
                newItem.ReceivesInfoEmails = item.ReceivesInfoEmails;
                newItem.ReceivesAdminInfoEmails = item.ReceivesAdminInfoEmails;
                newItem.EmailEncodingKey = item.EmailEncodingKey;
                newItem.ProfileId = item.ProfileId;
                newItem.UserType = item.UserType;
                newItem.LanguageLocaleKey = item.LanguageLocaleKey;
                newItem.EmployeeNumber = item.EmployeeNumber;
                newItem.ManagerId = accountData.identifier + ";" + item.ManagerId;
                newItem.LastLoginDate = item.LastLoginDate;
                newItem.LastPasswordChangeDate = item.LastPasswordChangeDate;
                newItem.CreatedDate = item.CreatedDate;
                newItem.CreatedById = accountData.identifier + ";" + item.CreatedById;
                newItem.LastModifiedDate = item.LastModifiedDate;
                newItem.LastModifiedById = accountData.identifier + ";" + item.LastModifiedById;
                newItem.SystemModstamp = item.SystemModstamp;
                newItem.OfflineTrialExpirationDate = item.OfflineTrialExpirationDate;
                newItem.OfflinePdaTrialExpirationDate = item.OfflinePdaTrialExpirationDate;
                newItem.UserPermissionsMarketingUser = item.UserPermissionsMarketingUser;
                newItem.UserPermissionsOfflineUser = item.UserPermissionsOfflineUser;
                newItem.UserPermissionsAvantgoUser = item.UserPermissionsAvantgoUser;
                newItem.UserPermissionsCallCenterAutoLogin = item.UserPermissionsCallCenterAutoLogin;
                newItem.UserPermissionsMobileUser = item.UserPermissionsMobileUser;
                newItem.UserPermissionsSFContentUser = item.UserPermissionsSFContentUser;
                newItem.UserPermissionsSupportUser = item.UserPermissionsSupportUser;
                newItem.ForecastEnabled = item.ForecastEnabled;
                newItem.UserPreferencesActivityRemindersPopup = item.UserPreferencesActivityRemindersPopup;
                newItem.UserPreferencesEventRemindersCheckboxDefault = item.UserPreferencesEventRemindersCheckboxDefault;
                newItem.UserPreferencesTaskRemindersCheckboxDefault = item.UserPreferencesTaskRemindersCheckboxDefault;
                newItem.UserPreferencesReminderSoundOff = item.UserPreferencesReminderSoundOff;
                newItem.UserPreferencesDisableAllFeedsEmail = item.UserPreferencesDisableAllFeedsEmail;
                newItem.UserPreferencesDisableFollowersEmail = item.UserPreferencesDisableFollowersEmail;
                newItem.UserPreferencesDisableProfilePostEmail = item.UserPreferencesDisableProfilePostEmail;
                newItem.UserPreferencesDisableChangeCommentEmail = item.UserPreferencesDisableChangeCommentEmail;
                newItem.UserPreferencesDisableLaterCommentEmail = item.UserPreferencesDisableLaterCommentEmail;
                newItem.UserPreferencesDisProfPostCommentEmail = item.UserPreferencesDisProfPostCommentEmail;
                newItem.UserPreferencesApexPagesDeveloperMode = item.UserPreferencesApexPagesDeveloperMode;
                newItem.UserPreferencesHideCSNGetChatterMobileTask = item.UserPreferencesHideCSNGetChatterMobileTask;
                newItem.UserPreferencesDisableMentionsPostEmail = item.UserPreferencesDisableMentionsPostEmail;
                newItem.UserPreferencesDisMentionsCommentEmail = item.UserPreferencesDisMentionsCommentEmail;
                newItem.UserPreferencesHideCSNDesktopTask = item.UserPreferencesHideCSNDesktopTask;
                newItem.UserPreferencesHideChatterOnboardingSplash = item.UserPreferencesHideChatterOnboardingSplash;
                newItem.UserPreferencesHideSecondChatterOnboardingSplash = item.UserPreferencesHideSecondChatterOnboardingSplash;
                newItem.UserPreferencesDisCommentAfterLikeEmail = item.UserPreferencesDisCommentAfterLikeEmail;
                newItem.UserPreferencesDisableLikeEmail = item.UserPreferencesDisableLikeEmail;
                newItem.UserPreferencesSortFeedByComment = item.UserPreferencesSortFeedByComment;
                newItem.UserPreferencesDisableMessageEmail = item.UserPreferencesDisableMessageEmail;
                newItem.UserPreferencesDisableBookmarkEmail = item.UserPreferencesDisableBookmarkEmail;
                newItem.UserPreferencesDisableSharePostEmail = item.UserPreferencesDisableSharePostEmail;
                newItem.UserPreferencesEnableAutoSubForFeeds = item.UserPreferencesEnableAutoSubForFeeds;
                newItem.UserPreferencesDisableFileShareNotificationsForApi = item.UserPreferencesDisableFileShareNotificationsForApi;
                newItem.UserPreferencesShowTitleToExternalUsers = item.UserPreferencesShowTitleToExternalUsers;
                newItem.UserPreferencesShowManagerToExternalUsers = item.UserPreferencesShowManagerToExternalUsers;
                newItem.UserPreferencesShowEmailToExternalUsers = item.UserPreferencesShowEmailToExternalUsers;
                newItem.UserPreferencesShowWorkPhoneToExternalUsers = item.UserPreferencesShowWorkPhoneToExternalUsers;
                newItem.UserPreferencesShowMobilePhoneToExternalUsers = item.UserPreferencesShowMobilePhoneToExternalUsers;
                newItem.UserPreferencesShowFaxToExternalUsers = item.UserPreferencesShowFaxToExternalUsers;
                newItem.UserPreferencesShowStreetAddressToExternalUsers = item.UserPreferencesShowStreetAddressToExternalUsers;
                newItem.UserPreferencesShowCityToExternalUsers = item.UserPreferencesShowCityToExternalUsers;
                newItem.UserPreferencesShowStateToExternalUsers = item.UserPreferencesShowStateToExternalUsers;
                newItem.UserPreferencesShowPostalCodeToExternalUsers = item.UserPreferencesShowPostalCodeToExternalUsers;
                newItem.UserPreferencesShowCountryToExternalUsers = item.UserPreferencesShowCountryToExternalUsers;
                newItem.UserPreferencesShowProfilePicToGuestUsers = item.UserPreferencesShowProfilePicToGuestUsers;
                newItem.UserPreferencesShowTitleToGuestUsers = item.UserPreferencesShowTitleToGuestUsers;
                newItem.UserPreferencesShowCityToGuestUsers = item.UserPreferencesShowCityToGuestUsers;
                newItem.UserPreferencesShowStateToGuestUsers = item.UserPreferencesShowStateToGuestUsers;
                newItem.UserPreferencesShowPostalCodeToGuestUsers = item.UserPreferencesShowPostalCodeToGuestUsers;
                newItem.UserPreferencesShowCountryToGuestUsers = item.UserPreferencesShowCountryToGuestUsers;
                newItem.UserPreferencesHideS1BrowserUI = item.UserPreferencesHideS1BrowserUI;
                newItem.UserPreferencesDisableEndorsementEmail = item.UserPreferencesDisableEndorsementEmail;
                newItem.UserPreferencesPathAssistantCollapsed = item.UserPreferencesPathAssistantCollapsed;
                newItem.UserPreferencesShowEmailToGuestUsers = item.UserPreferencesShowEmailToGuestUsers;
                newItem.UserPreferencesShowManagerToGuestUsers = item.UserPreferencesShowManagerToGuestUsers;
                newItem.UserPreferencesShowWorkPhoneToGuestUsers = item.UserPreferencesShowWorkPhoneToGuestUsers;
                newItem.UserPreferencesShowMobilePhoneToGuestUsers = item.UserPreferencesShowMobilePhoneToGuestUsers;
                newItem.UserPreferencesShowFaxToGuestUsers = item.UserPreferencesShowFaxToGuestUsers;
                newItem.UserPreferencesShowStreetAddressToGuestUsers = item.UserPreferencesShowStreetAddressToGuestUsers;
                newItem.UserPreferencesLightningExperiencePreferred = item.UserPreferencesLightningExperiencePreferred;
                newItem.UserPreferencesPreviewLightning = item.UserPreferencesPreviewLightning;
                newItem.UserPreferencesHideEndUserOnboardingAssistantModal = item.UserPreferencesHideEndUserOnboardingAssistantModal;
                newItem.UserPreferencesHideLightningMigrationModal = item.UserPreferencesHideLightningMigrationModal;
                newItem.UserPreferencesHideSfxWelcomeMat = item.UserPreferencesHideSfxWelcomeMat;
                newItem.UserPreferencesHideBiggerPhotoCallout = item.UserPreferencesHideBiggerPhotoCallout;
                newItem.UserPreferencesGlobalNavBarWTShown = item.UserPreferencesGlobalNavBarWTShown;
                newItem.UserPreferencesGlobalNavGridMenuWTShown = item.UserPreferencesGlobalNavGridMenuWTShown;
                newItem.UserPreferencesCreateLEXAppsWTShown = item.UserPreferencesCreateLEXAppsWTShown;
                newItem.UserPreferencesFavoritesWTShown = item.UserPreferencesFavoritesWTShown;
                newItem.ContactId = accountData.identifier + ";" + item.ContactId;
                newItem.AccountId = accountData.identifier + ";" + item.AccountId;
                newItem.CallCenterId = item.CallCenterId;
                newItem.Extension = item.Extension;
                newItem.FederationIdentifier = item.FederationIdentifier;
                newItem.AboutMe = item.AboutMe;
                newItem.FullPhotoUrl = item.FullPhotoUrl;
                newItem.SmallPhotoUrl = item.SmallPhotoUrl;
                newItem.MediumPhotoUrl = item.MediumPhotoUrl;
                newItem.DigestFrequency = item.DigestFrequency;
                newItem.DefaultGroupNotificationFrequency = item.DefaultGroupNotificationFrequency;
                newItem.LastViewedDate = item.LastViewedDate;
                newItem.LastReferencedDate = item.LastReferencedDate;
                newItem.BannerPhotoUrl = item.BannerPhotoUrl;
                newItem.SmallBannerPhotoUrl = item.SmallBannerPhotoUrl;
                newItem.MediumBannerPhotoUrl = item.MediumBannerPhotoUrl;
                newItem.IsProfilePhotoActive = item.IsProfilePhotoActive;
                newArray.push(newItem);
            });
            resolve({ mainEntityName: C_DATAOBJECTNAME, [C_DATAOBJECTNAME]: newArray });
        }
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
