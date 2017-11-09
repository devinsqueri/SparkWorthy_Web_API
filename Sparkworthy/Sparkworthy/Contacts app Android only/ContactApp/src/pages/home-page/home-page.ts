import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Database } from '../../providers/database';
import { LoadingController,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import * as _ from "lodash";
import { Geolocation } from '@ionic-native/geolocation';
import * as moment from 'moment';
import { Network } from '@ionic-native/network';

declare let Connection: any;
declare let navigator: any;
declare let cordova: any;

//page
import { EditContactPagePage } from '../edit-contact-page/edit-contact-page';
import { CompanyNewsFeedPagePage } from '../company-news-feed-page/company-news-feed-page';
import { LocationNewsFeedPagePage } from '../location-news-feed-page/location-news-feed-page';
// import { SettingsPagePage } from '../settings-page/settings-page';
import {RemainderAddUpdatePage} from '../remainder-add-update/remainder-add-update';
import {LocalNotifications} from "@ionic-native/local-notifications";

@Component({
  selector: 'page-home-page',
  templateUrl: 'home-page.html'
})
export class HomePagePage {

  public contactList: Array<Object>;
  userName: any;
  userCompany: any;
  userCity: any;
  userImage: any;
    image:any;
  getDetailsUser: any;
  localStorageEmail: any;
  localStoragePassword: any;
  userImageprofile: any;
  noreminder:boolean = true;
  nofav:boolean = true;
  bool:boolean;
  backButtonPressedOnceToExit:any;
  allRemainderofContact: any;
  date: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public alertCtrl: AlertController,
              public database: Database,
              public storage: Storage,
              public loading: LoadingController,
              public toastCtrl:ToastController,
              public http:HTTP,
              private geolocation: Geolocation,
              private network: Network,
              private localNotifications: LocalNotifications,
  ) {
    localStorage.setItem('launched', 'false');
    this.database.userIdFromDB = localStorage.getItem("userid");
      this.database.userEmail = localStorage.getItem("email");


      let aa : Date = new Date();
      console.log(aa.getDate());
     // console.log(aa.get());

      this.platform.ready().then(() => {
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if(!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
          console.log("iOS file directory",cordova.file.documentsDirectory);
        this.database.storageDirectory = cordova.file.documentsDirectory;
      }
      else if(this.platform.is('android')) {
        this.database.storageDirectory = cordova.file.dataDirectory;
      }
      else {
          console.log("iOS file directory",cordova.file.documentsDirectory);

          // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });
  }

  ionViewWillEnter() {
      this.image =   localStorage.getItem("image");


    this.displayContacts();
      this.getAllRemainderOfAllContact();
      this.getUserDetails();
     this.transformRemain(this.allRemainderofContact,"time");
  }
  transformRemain(array, args) {
    this.allRemainderofContact = [];

    let sortedList = _.sortBy(array, args).reverse();
    this.allRemainderofContact = sortedList;
      if (this.allRemainderofContact.length == 0)
      {
          this.noreminder = true;
      }else
      {
          this.noreminder = false;
      }
    
  }
  ionViewDidEnter() {
          this.platform.registerBackButtonAction(() => {
          console.log("sdhbfbsdf");
          if (this.backButtonPressedOnceToExit) {
              this.platform.exitApp();
            } else if (this.navCtrl.canGoBack()) {
              this.navCtrl.pop({});
            } else {
              this.showToast();
              this.backButtonPressedOnceToExit = true;
              setTimeout(() => {

                this.backButtonPressedOnceToExit = false;
              },2000)
            }
      });
  }
 ionViewWillLeave() {
       this.platform.registerBackButtonAction(() => {
       console.log("sdhbfbsdf leave");
       this.navCtrl.pop();
       });
  }
  showToast() {
        let toast = this.toastCtrl.create({
          message: 'Press again to exit',
          duration: 2000,
          position: 'bottom'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      }
  ionViewDidLoad() {

  }
  openEditPage(v) {
    this.navCtrl.push(EditContactPagePage, { object: v });
  }
  openCompanyNewsPage() {
    this.checkNetwork();
    this.navCtrl.push(CompanyNewsFeedPagePage);
  }
  openLocationNewsFeedPage() {
    this.checkNetwork();
    this.navCtrl.push(LocationNewsFeedPagePage);
  }
  transform(array, args) {
    this.contactList = [];

    let sortedList = _.sortBy(array, args).reverse();
    this.contactList = sortedList;
    // let currentLetter = false;
    // let currentContacts = [];
  }
    transformDate(array, args) {

        let sortedList = _.sortBy(array, args).reverse();
        this.allRemainderofContact = sortedList;

        // let currentLetter = false;
        // let currentContacts = [];
    }


  getUserDetails() {
    let loader = this.loading.create({
      content: 'Loading...',
    });
    loader.present();
    //Description: Get the user details from the local storage
    

      this.database.getUser().then((result) => {
        this.userCompany = result[0].Company;
        this.userName = result[0].Name;
        this.userCity = result[0].City;

      }, (error) => {
        console.log("ERROR: ", error);
      });

      loader.dismissAll();
  }
  checkNetwork() {
      this.http.get("", {}, {})
          .then(datafrmapi => {
          });
    this.platform.ready().then(() => {
      let networkState = this.network.type;
      if (networkState === Connection.NONE) {
      }
      else {
      }
    });
  }
  displayContacts() {
    this.database.getAllFavContacts().then((result) => {
      this.contactList = <Array<Object>>result;
      if (this.contactList.length == 0)
      {
        this.nofav = false;
      }else
      {
                this.nofav = true;

      }
      this.transform(this.contactList,"favorites");
    }, (error) => {
      console.log("ERROR: ", error);
    });
  }
  openRemainderPage(remain)
  {
        this.navCtrl.push(RemainderAddUpdatePage,{role:"Update Reminder",objectContact:remain,objectRemainder:remain,objectView:true});

  }
    cancelNotification(v)
    {
        this.localNotifications.isScheduled(v).then((res)=>{
            console.log("Notifation found"+res);
            this.localNotifications.clear(v);
        },(err)=>{
            console.log("Notification not found");
            console.log(err);
        });
    }
  public getAllRemainderOfAllContact() {
    this.allRemainderofContact = [];
    this.database.getAllRemainderForAllContactHome().then((result) => {
      this.allRemainderofContact = <Array<Object>>result;

      console.log("this.allRemainderofContact" , this.allRemainderofContact.length);
      console.log(this.allRemainderofContact);

      this.gettimeAllContacts();

      // this.date = new Date(this.allRemainderofContact[0].SetTime);
      //this.gettimeAllContacts();
      console.log("From DateTime" +this.database.timeNow);

  }, (error) => {
        this.noreminder = false;

        console.log("ERROR: ", error);
    });
  }

  public switchRoot()
  {
    this.navCtrl.parent.select(3);
  }
  public goToLocation()
  {
      if(this.userCity == null || this.userCity == "")
      {
          let alertPopup = this.alertCtrl.create({
              title: 'Warning',
              message: 'Please enter your location in settings page',
              buttons: [{
                  text: 'cancel',
                  handler: () => {
                      alertPopup.dismiss().then(() => {

                      });
                  }
              },
                  {
                      text: 'Go to settings',
                      handler: () => {
                          this.navCtrl.parent.select(3);
                          // need to do something if the user stays?
                      }
                  }]
          });

          // Show the alert
          alertPopup.present();
      }else
      {
          this.navCtrl.push(LocationNewsFeedPagePage);
      }
  }
  
   public gettimeAllContacts()
  {
    for(let i of this.allRemainderofContact)
    {
      let date:String = i['Time'];
      i['timehr'] = this.getHrFormat(date);
        if(i['IsActive']==1)
        {
            i['active'] = false;
        }else
        {
            i['active'] = true;
        }
    }
  }
   public getHrFormat(time)
  {
      time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

   deleteRemainder(v)
  {
      this.http.get("", {}, {})
          .then(datafrmapi => {
          });
            let alert = this.alertCtrl.create({
          title: "Confirm Delete",
          subTitle: "Do you want to delete this reminder",
          buttons: [
                      {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
            
                  }
                },
            {
              text: 'Delete',
              handler: data => {
      this.platform.ready().then(() => {
          this.cancelNotification(v['RemainderId']);
      let networkState = this.network.type;
      if (networkState === Connection.NONE) {
        this.database.deleteRemainder(v['RemainderId']).then((result) => {
          //this.addRemainderToRemainderDeleteTable(v['RemainderIdFrmExt']);
          this.getAllRemainderOfAllContact();
          //this.getAllRemainderOfAllContact();
        }, (error) => {
          console.log("ERROR: ", error);
        });
      }
      else {
        if (v['RemainderIdFrmExt'] != null)
        {
            let url = this.database.apiUrl+"Reminder/delete?ReminderId="+v['RemainderIdFrmExt'];
            let encodedUrl = encodeURI(url);
          this.http.get(encodedUrl, {}, {})
              .then(datafrmapi => {
                  console.log("Result from server",datafrmapi);
                  console.log("Reminder deleted through http api");
                  if(this.database.development == true)
                  {
                      let alert1 = this.alertCtrl.create({
                          title: "Reminder deleted through api.",
                          subTitle:"Result returned :"+JSON.stringify(datafrmapi),
                          buttons: [
                              {
                                  text: 'Ok',
                                  handler: data => {
                                      this.navCtrl.pop();
                                  }
                              }
                          ]
                      });
                      alert1.present();

                  }
                // update contactidext and ifsync
                // let aa = JSON.parse(datafrmapi.data);
              })
              .catch(error => {
                console.log(error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);
              });
        }
        this.database.deleteRemainder(v['RemainderId']).then((result) => {
          this.getAllRemainderOfAllContact();
          //this.getAllRemainderOfAllContact();
        }, (error) => {
          console.log("ERROR: ", error);
        });
      }
    });
              }
            }
          ]
        });
        alert.present();
  }

}
