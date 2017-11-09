import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { TagInputModule } from 'ng2-tag-input';
import { SQLite } from '@ionic-native/sqlite';
import { HTTP } from '@ionic-native/http';
import { FilePath } from '@ionic-native/file-path';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';

import { File } from '@ionic-native/file';//pages
import { Transfer } from '@ionic-native/transfer';
import { Contacts} from '@ionic-native/contacts';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
//pages
import { SignInPagePage } from '../pages/sign-in-page/sign-in-page';
import { CreateAccountPagePage } from '../pages/create-account-page/create-account-page';
import { AddAccountPagePage } from '../pages/add-account-page/add-account-page';
import { HomeTabPage } from '../pages/home-tab/home-tab';
import { HomePagePage } from '../pages/home-page/home-page';
import { AllContactsPagePage } from '../pages/all-contacts-page/all-contacts-page';
import { TrendingPagePage } from '../pages/trending-page/trending-page';
import { SettingsPagePage } from '../pages/settings-page/settings-page';
import { EditContactPagePage } from '../pages/edit-contact-page/edit-contact-page';
import { InterestPagePage } from '../pages/interest-page/interest-page';
import { InnerCirclePagePage } from '../pages/inner-circle-page/inner-circle-page';
import { RemainderPagePage } from '../pages/remainder-page/remainder-page';
import { EditInnerCirclePagePage } from '../pages/edit-inner-circle-page/edit-inner-circle-page';
import { AddContactsPagePage } from '../pages/add-contacts-page/add-contacts-page';
import { AddGroupPagePage } from '../pages/add-group-page/add-group-page';
import { LocationNewsFeedPagePage } from '../pages/location-news-feed-page/location-news-feed-page';
import { CompanyNewsFeedPagePage } from '../pages/company-news-feed-page/company-news-feed-page';
import { GroupEditPagePage } from '../pages/group-edit-page/group-edit-page';
import { ListContactsPagePage } from '../pages/list-contacts-page/list-contacts-page';
import { InterestNewsPagePage } from '../pages/interest-news-page/interest-news-page';
import { RemainderAddUpdatePage } from '../pages/remainder-add-update/remainder-add-update';
import { AddInnercirclePagePage } from '../pages/add-innercircle-page/add-innercircle-page';
import { AddInterestPage } from '../pages/add-interest/add-interest';
//3rd party module
import { Ionic2RatingModule } from 'ionic2-rating';
// import { Select2Module } from 'ng2-select2';
import { ControlMessagesComponent } from './control-messages.component';
import { ValidationService } from './validation.service';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';


import { LazyImgComponent }   from '../global/components/';

import { LazyLoadDirective }   from '../global/directives/';

import { ImgcacheService }    from '../global/services/';
import {Autosize} from 'ionic2-autosize';
import {AutosizeModule} from 'ionic2-autosize';
import {SettingsModelPage} from "../pages/settings-model/settings-model";


@NgModule({
  declarations: [
    ControlMessagesComponent,
    MyApp,
    SignInPagePage,
    CreateAccountPagePage,
    AddAccountPagePage,
    HomeTabPage,
    HomePagePage,
    AllContactsPagePage,
    TrendingPagePage,
    SettingsPagePage,
    EditContactPagePage,
    InterestPagePage,
    InnerCirclePagePage,
    RemainderPagePage,
    EditInnerCirclePagePage,
    AddContactsPagePage,
    AddGroupPagePage,
    LocationNewsFeedPagePage,
    CompanyNewsFeedPagePage,
    GroupEditPagePage,
    ListContactsPagePage,
    InterestNewsPagePage,
    RemainderAddUpdatePage,
    AddInnercirclePagePage,
    AddInterestPage,
    LazyImgComponent,
    LazyLoadDirective,
    SettingsModelPage,
  ],
  imports: [
    
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    Ionic2RatingModule,
    TagInputModule,
    AutosizeModule,
    // Autosize,
    // Select2Module,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPagePage,
    CreateAccountPagePage,
    AddAccountPagePage,
    HomeTabPage,
    HomePagePage,
    AllContactsPagePage,
    TrendingPagePage,
    SettingsPagePage,
    EditContactPagePage,
    InterestPagePage,
    InnerCirclePagePage,
    RemainderPagePage,
    EditInnerCirclePagePage,
    AddContactsPagePage,
    AddGroupPagePage,
    LocationNewsFeedPagePage,
    CompanyNewsFeedPagePage,
    GroupEditPagePage,
    ListContactsPagePage,
    InterestNewsPagePage,
    RemainderAddUpdatePage,
    AddInnercirclePagePage,
    AddInterestPage,
    LazyImgComponent,
    SettingsModelPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, ImgcacheService,
  ValidationService,Storage,DatePicker,Network,SQLitePorter,LocalNotifications,Toast,SQLite,HTTP,FilePath,Diagnostic,File,Transfer,Contacts,Camera,SocialSharing,Geolocation]
})
export class AppModule { }
