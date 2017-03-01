const C_DATAOBJECTNAME = "user";
const C_DATAOBJECTENTITYNAME = "SALESFORCE_USER";
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
                let newItem = {Id: null, Username: null, LastName: null, FirstName: null, MiddleName: null, Suffix: null, Name: null, 
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
                    IsProfilePhotoActive: null};
                newItem.Id=item.Id;     // User ID, string
                newItem.Username=item.Username;       // string
                newItem.LastName=item.LastName;       // string
                newItem.FirstName=item.FirstName;       // string
                newItem.MiddleName=item.MiddleName;       // string
                newItem.Suffix=item.Suffix;       // string
                newItem.Name= item.FirstName + " " + item.MiddleName + " " + item.LastName;     // Full name, string
                newItem.CompanyName=item.CompanyName;       // string
                newItem.Division=item.Division;       // string
                newItem.Department=item.Department;       // string
                newItem.Title=item.Title;       // string
                newItem.Street=item.Street;       // string
                newItem.City=item.City;       // string
                newItem.State=item.State;       // State/Province, string
                newItem.PostalCode=item.PostalCode;       // Zip/Postal Code, string
                newItem.Country=item.Country;       // string
                newItem.Latitude=item.Latitude;       // number
                newItem.Longitude=item.Longitude;       // number
                newItem.GeocodeAccuracy=item.GeocodeAccuracy;       // string
                newItem.Email=item.Email;       // string
                newItem.EmailPreferencesAutoBcc=item.EmailPreferencesAutoBcc;       // AutoBcc, boolean
                newItem.EmailPreferencesAutoBccStayInTouch=item.EmailPreferencesAutoBccStayInTouch;       // AutoBccStayInTouch, boolean
                newItem.EmailPreferencesStayInTouchReminder=item.EmailPreferencesStayInTouchReminder;       // StayInTouchReminder, boolean
                newItem.SenderEmail=item.SenderEmail;       // EmailSender Address, string
                newItem.SenderName=item.SenderName;       // Email Sender Name, string
                newItem.Signature=item.Signature;       // Email Signature, string
                newItem.StayInTouchSubject=item.StayInTouchSubject;       // Stay-In-Touch Email Subject, string
                newItem.StayInTouchSignature=item.StayInTouchSignature;       // Stay-In-Touch Email Signature, string
                newItem.StayInTouchNote=item.StayInTouchNote;       // Stay-In-Touch Email Note, string
                newItem.Phone=item.Phone;       // string
                newItem.Fax=item.Fax;       // string
                newItem.MobilePhone=item.MobilePhone;       // Cell, string
                newItem.Alias=item.Alias;       // string
                newItem.CommunityNickname=item.CommunityNickname;       // Nickname, string
                newItem.BadgeText=item.BadgeText;       // User Photo Badge Text Overlay, string
                newItem.IsActive=item.IsActive;       // Active, boolean
                newItem.TimeZoneSidKey=item.TimeZoneSidKey;       // Time Zone, string
                newItem.UserRoleId=item.UserRoleId;       // Role ID, string
                newItem.LocaleSidKey=item.LocaleSidKey;       // Locale, string
                newItem.ReceivesInfoEmails=item.ReceivesInfoEmails;       // Info Emails, boolean
                newItem.ReceivesAdminInfoEmails=item.ReceivesAdminInfoEmails;       // Admin Info Emails, boolean
                newItem.EmailEncodingKey=item.EmailEncodingKey;       // Email Encoding, string
                newItem.ProfileId=item.ProfileId;       // string
                newItem.UserType=item.UserType;       // string
                newItem.LanguageLocaleKey=item.LanguageLocaleKey;       // Language, string
                newItem.EmployeeNumber=item.EmployeeNumber;       // string
                newItem.ManagerId=item.ManagerId;       // string
                newItem.LastLoginDate=item.LastLoginDate;       // Last Login, Date
                newItem.LastPasswordChangeDate=item.LastPasswordChangeDate;       // Last Password Change or Reset, date
                newItem.CreatedDate=item.CreatedDate;       // date
                newItem.CreatedById=item.CreatedById;       // string
                newItem.LastModifiedDate=item.LastModifiedDate;       // date
                newItem.LastModifiedById=item.LastModifiedById;       // string
                newItem.SystemModstamp=item.SystemModstamp;       // date
                newItem.OfflineTrialExpirationDate=item.OfflineTrialExpirationDate;       // Offline Edition Trial Expiration Date, date
                newItem.OfflinePdaTrialExpirationDate=item.OfflinePdaTrialExpirationDate;       // Sales Anywhere Trial Expiration Date, date
                newItem.UserPermissionsMarketingUser=item.UserPermissionsMarketingUser;       // Marketing User, boolean
                newItem.UserPermissionsOfflineUser=item.UserPermissionsOfflineUser;       // Offline User, boolean
                newItem.UserPermissionsAvantgoUser=item.UserPermissionsAvantgoUser;       // AvantGo User, boolean
                newItem.UserPermissionsCallCenterAutoLogin=item.UserPermissionsCallCenterAutoLogin;       // Auto-Login to Call Center, boolean
                newItem.UserPermissionsMobileUser=item.UserPermissionsMobileUser;       // Apex Mobile User, boolean
                newItem.UserPermissionsSFContentUser=item.UserPermissionsSFContentUser;       // Salesforce CRM Content User, boolean
                newItem.UserPermissionsSupportUser=item.UserPermissionsSupportUser;       // Service Cloud User, boolean
                newItem.ForecastEnabled=item.ForecastEnabled;       // Allow Forecasting, boolean
                newItem.UserPreferencesActivityRemindersPopup=item.UserPreferencesActivityRemindersPopup;       // ActivityReminderPopup, boolea
                newItem.UserPreferencesEventRemindersCheckboxDefault=item.UserPreferencesEventRemindersCheckboxDefault; // EventReminderCheckboxDefault, booleann
                newItem.UserPreferencesTaskRemindersCheckboxDefault=item.UserPreferencesTaskRemindersCheckboxDefault; // TaskRemindersCheckboxDefault, boolean
                newItem.UserPreferencesReminderSoundOff=item.UserPreferencesReminderSoundOff;       // ReminderSoundOff, boolean
                newItem.UserPreferencesDisableAllFeedsEmail=item.UserPreferencesDisableAllFeedsEmail;  // DisableAllFeedsEmail, boolean
                newItem.UserPreferencesDisableFollowersEmail=item.UserPreferencesDisableFollowersEmail; // DisableFollowersEmail, boolean
                newItem.UserPreferencesDisableProfilePostEmail=item.UserPreferencesDisableProfilePostEmail; // DisableProfilePostEmail, boolean
                newItem.UserPreferencesDisableChangeCommentEmail=item.UserPreferencesDisableChangeCommentEmail;// DisableChangeCommentEmail, boolean
                newItem.UserPreferencesDisableLaterCommentEmail=item.UserPreferencesDisableLaterCommentEmail; // DisableLaterCommentEmail, boolean
                newItem.UserPreferencesDisProfPostCommentEmail=item.UserPreferencesDisProfPostCommentEmail; // DisProfPostCommentEmail, boolean
                newItem.UserPreferencesApexPagesDeveloperMode=item.UserPreferencesApexPagesDeveloperMode;  // ApexPagesDeveloperMode, boolean
                newItem.UserPreferencesHideCSNGetChatterMobileTask=item.UserPreferencesHideCSNGetChatterMobileTask; // HideCSNGetChatterMobileTask, boolean
                newItem.UserPreferencesDisableMentionsPostEmail=item.UserPreferencesDisableMentionsPostEmail; // DisableMentionsPostEmail, boolean
                newItem.UserPreferencesDisMentionsCommentEmail=item.UserPreferencesDisMentionsCommentEmail; // DisMentionsCommentEmail, boolean
                newItem.UserPreferencesHideCSNDesktopTask=item.UserPreferencesHideCSNDesktopTask; // HideCSNDesktopTask, boolean
                newItem.UserPreferencesHideChatterOnboardingSplash=item.UserPreferencesHideChatterOnboardingSplash; // HideChatterOnboardingSplash, boolean
                newItem.UserPreferencesHideSecondChatterOnboardingSplash=item.UserPreferencesHideSecondChatterOnboardingSplash; // HideSecondChatterOnboardingSplash, boolean
                newItem.UserPreferencesDisCommentAfterLikeEmail=item.UserPreferencesDisCommentAfterLikeEmail; // DisCommentAfterLikeEmail, boolean
                newItem.UserPreferencesDisableLikeEmail=item.UserPreferencesDisableLikeEmail; // DisableLikeEmail, boolean
                newItem.UserPreferencesSortFeedByComment=item.UserPreferencesSortFeedByComment; // SortFeedByComment, boolean
                newItem.UserPreferencesDisableMessageEmail=item.UserPreferencesDisableMessageEmail; // DisableMessageEmail, boolean
                newItem.UserPreferencesDisableBookmarkEmail=item.UserPreferencesDisableBookmarkEmail; // DisableBookmarkEmail, boolean
                newItem.UserPreferencesDisableSharePostEmail=item.UserPreferencesDisableSharePostEmail; // DisableSharePortEmail, boolean
                newItem.UserPreferencesEnableAutoSubForFeeds=item.UserPreferencesEnableAutoSubForFeeds;  // EnableAutoSubForFeeds, boolean
                newItem.UserPreferencesDisableFileShareNotificationsForApi=item.UserPreferencesDisableFileShareNotificationsForApi; // DisableFileShareNotificationsForApi, boolean
                newItem.UserPreferencesShowTitleToExternalUsers=item.UserPreferencesShowTitleToExternalUsers; // ShowTitleToExternalUsers, boolean
                newItem.UserPreferencesShowManagerToExternalUsers=item.UserPreferencesShowManagerToExternalUsers; // ShowManagerToExternalUsers, boolean
                newItem.UserPreferencesShowEmailToExternalUsers=item.UserPreferencesShowEmailToExternalUsers;  // ShowEmailToExternalUsers, boolean
                newItem.UserPreferencesShowWorkPhoneToExternalUsers=item.UserPreferencesShowWorkPhoneToExternalUsers; // ShowWorkPhoneToExternalUsers, boolean
                newItem.UserPreferencesShowMobilePhoneToExternalUsers=item.UserPreferencesShowMobilePhoneToExternalUsers;  // ShowMobilePhoneToExternalUsers, boolean
                newItem.UserPreferencesShowFaxToExternalUsers=item.UserPreferencesShowFaxToExternalUsers; // ShowFaxToExternalUsers, boolean
                newItem.UserPreferencesShowStreetAddressToExternalUsers=item.UserPreferencesShowStreetAddressToExternalUsers; // ShowStreetAddressToExternalUsers, boolean
                newItem.UserPreferencesShowCityToExternalUsers=item.UserPreferencesShowCityToExternalUsers; // ShowCityToExternalUsers, boolean
                newItem.UserPreferencesShowStateToExternalUsers=item.UserPreferencesShowStateToExternalUsers;  // ShowStateToExternalUsers, boolean
                newItem.UserPreferencesShowPostalCodeToExternalUsers=item.UserPreferencesShowPostalCodeToExternalUsers; // ShowPostalCodeToExternalUsers, boolean
                newItem.UserPreferencesShowCountryToExternalUsers=item.UserPreferencesShowCountryToExternalUsers; // ShowCountryToExternalUsers, boolean
                newItem.UserPreferencesShowProfilePicToGuestUsers=item.UserPreferencesShowProfilePicToGuestUsers; // ShowProfilePicToGuestUsers, boolean
                newItem.UserPreferencesShowTitleToGuestUsers=item.UserPreferencesShowTitleToGuestUsers; // ShowTitleToGuestUsers, boolean
                newItem.UserPreferencesShowCityToGuestUsers=item.UserPreferencesShowCityToGuestUsers;  // ShowCityToGuestUsers, boolean
                newItem.UserPreferencesShowStateToGuestUsers=item.UserPreferencesShowStateToGuestUsers;  // ShowStateToGuestUsers, boolean
                newItem.UserPreferencesShowPostalCodeToGuestUsers=item.UserPreferencesShowPostalCodeToGuestUsers; // ShowPostalCodeToGuestUsers, boolean
                newItem.UserPreferencesShowCountryToGuestUsers=item.UserPreferencesShowCountryToGuestUsers; // ShowCountryToGuestUsers, boolean
                newItem.UserPreferencesHideS1BrowserUI=item.UserPreferencesHideS1BrowserUI; // HideS1BrowserUI, boolean
                newItem.UserPreferencesDisableEndorsementEmail=item.UserPreferencesDisableEndorsementEmail;  // DisableEndorsementEmail, boolean
                newItem.UserPreferencesPathAssistantCollapsed=item.UserPreferencesPathAssistantCollapsed;  // PathAssistantCollapsed, boolean
                newItem.UserPreferencesShowEmailToGuestUsers=item.UserPreferencesShowEmailToGuestUsers;  // ShowEmailToGuestUsers, boolean
                newItem.UserPreferencesShowManagerToGuestUsers=item.UserPreferencesShowManagerToGuestUsers; // ShowManagerToGuestUsers, boolean
                newItem.UserPreferencesShowWorkPhoneToGuestUsers=item.UserPreferencesShowWorkPhoneToGuestUsers; // ShowWorkPhoneToGuestUsers, boolean
                newItem.UserPreferencesShowMobilePhoneToGuestUsers=item.UserPreferencesShowMobilePhoneToGuestUsers;  // ShowMobilePhoneToGuestUsers, boolean
                newItem.UserPreferencesShowFaxToGuestUsers=item.UserPreferencesShowFaxToGuestUsers;  // ShowFaxToGuestUsers, boolean
                newItem.UserPreferencesShowStreetAddressToGuestUsers=item.UserPreferencesShowStreetAddressToGuestUsers; // ShowStreetAddressToGuestUsers, boolean
                newItem.UserPreferencesLightningExperiencePreferred=item.UserPreferencesLightningExperiencePreferred;  // LightningExperiencePreferred, boolean
                newItem.UserPreferencesPreviewLightning=item.UserPreferencesPreviewLightning;      // PreviewLightning, boolean
                newItem.UserPreferencesHideEndUserOnboardingAssistantModal=item.UserPreferencesHideEndUserOnboardingAssistantModal; // HideEndUserOnboardingAssistantModal, boolean
                newItem.UserPreferencesHideLightningMigrationModal=item.UserPreferencesHideLightningMigrationModal; // HideLightningMigrationModal, boolean
                newItem.UserPreferencesHideSfxWelcomeMat=item.UserPreferencesHideSfxWelcomeMat; // HideSfxWelcomeMat, boolean
                newItem.UserPreferencesHideBiggerPhotoCallout=item.UserPreferencesHideBiggerPhotoCallout; // HideBiggerPhotoCallout, boolean
                newItem.UserPreferencesGlobalNavBarWTShown=item.UserPreferencesGlobalNavBarWTShown; // GlobalNavBarWTShown, boolean
                newItem.UserPreferencesGlobalNavGridMenuWTShown=item.UserPreferencesGlobalNavGridMenuWTShown;  // GlobalNavGridMenuWTShown, boolean
                newItem.UserPreferencesCreateLEXAppsWTShown=item.UserPreferencesCreateLEXAppsWTShown; // CreateLEXAppsWTShown, boolean
                newItem.UserPreferencesFavoritesWTShown=item.UserPreferencesFavoritesWTShown;       // FavoritesWTShown, boolean
                newItem.ContactId=item.ContactId;       // string
                newItem.AccountId=item.AccountId;       // string
                newItem.CallCenterId=item.CallCenterId;       // string
                newItem.Extension=item.Extension;       // string
                newItem.FederationIdentifier=item.FederationIdentifier;       // SAML Federation ID, string
                newItem.AboutMe=item.AboutMe;       // string
                newItem.FullPhotoUrl=item.FullPhotoUrl;       // URL For Full-Sized Photo, string
                newItem.SmallPhotoUrl=item.SmallPhotoUrl;       // Photo, string
                newItem.MediumPhotoUrl=item.MediumPhotoUrl;       // URL For Medium Profile Photo, string
                newItem.DigestFrequency=item.DigestFrequency;       // Chatter Email Highlights Frequency, string
                newItem.DefaultGroupNotificationFrequency=item.DefaultGroupNotificationFrequency;  // Default Notification Frequency When Joining Groups, string
                newItem.LastViewedDate=item.LastViewedDate;       // date
                newItem.LastReferencedDate=item.LastReferencedDate;       // date
                newItem.BannerPhotoUrl=item.BannerPhotoUrl;       // URL For Banner Photo, string
                newItem.SmallBannerPhotoUrl=item.SmallBannerPhotoUrl;       // URL For IOS Banner Photo, string
                newItem.MediumBannerPhotoUrl=item.MediumBannerPhotoUrl;       // URL For Android Banner Photo, string
                newItem.IsProfilePhotoActive=item.IsProfilePhotoActive;       // Has Profile Photo, boolean
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