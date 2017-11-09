import { Component } from '@angular/core';
import { NavController, NavParams , AlertController , ToastController,Platform } from 'ionic-angular';
import { Database } from '../../providers/database';
import { RemainderAddUpdatePage } from '../remainder-add-update/remainder-add-update';
// import {LocalNotifications} from 'ionic-native';
import { HTTP } from '@ionic-native/http';

declare let Connection: any;
declare let navigator: any;
import { Network } from '@ionic-native/network';
import {LocalNotifications} from "@ionic-native/local-notifications";

@Component({
  selector: 'page-remainder-page',
  templateUrl: 'remainder-page.html'
})
export class RemainderPagePage {
  isConnectedToNet: boolean;
  contactDetails : any;
  bool : Boolean;
  public number:any = 0;
  public remainderofContact: Array<Object>;
  public allRemainderofContact: Array<Object>;

  date : any;
  time : any ;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public alertCtrl : AlertController ,
              public toastCtrl: ToastController ,
              public database :Database,
              public platform:Platform,
              public http:HTTP,
              private network: Network,
              private localNotifications: LocalNotifications,
  )
  {
      this.contactDetails = navParams.get('object');
  }
  ionViewWillEnter()
  {
    console.log('ionViewWillEnter AllContactsPagePage');
    this.getAllRemainderOfContact();
    //this.getAllRemainderOfAllContact();
   // this.checkNetwork();

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RemainderPagePage');
  }
  addRemainder()
  {
    this.navCtrl.push(RemainderAddUpdatePage,{role:"Add Reminder",objectContact:this.contactDetails,objectRemainder:null});
  }
  updateRemainder(remain)
  {
    this.navCtrl.push(RemainderAddUpdatePage,{role:"Update Reminder",objectContact:this.contactDetails,objectRemainder:remain,objectView:false});
  }
  viewRemainder(remain)
  {
    this.navCtrl.push(RemainderAddUpdatePage,{role:"Update Reminder",objectContact:this.contactDetails,objectRemainder:remain,objectView:true});
  }
  getAllRemainderOfContact()
  {
    this.remainderofContact = [];
    this.database.getAllRemainder(this.contactDetails['contactid']).then((result) => {
       this.remainderofContact = <Array<Object>> result;
       if (this.remainderofContact.length == 0)
       {
          this.bool = false;
       }else
       {
         //excecutes only one time
          if(this.number == 0)
          {
            this.number = this.number+1;
              let toast = this.toastCtrl.create({
              message: 'Slide right to left to update or delete your reminder',
              duration: 2500,
              position: 'bottom'
            });
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
            toast.present();
          }
        this.gettime();
         this.bool = true;
       }
       // this.gettime();
    }, (error) => {
      console.log("ERROR: ", error);
    });
  }
  public gettime()
  {
    for(let i of this.remainderofContact)
    {
      let date:String = i['Time'];
        console.log("Time"+i['Time']);

        i['timehr'] = this.getHrFormat(date);
      console.log("timehr"+i['timehr']);
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
            console.log("OFFLINE: Reminder deleted");
          this.addRemainderToRemainderDeleteTable(v['RemainderIdFrmExt']);
          this.getAllRemainderOfContact();
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
            console.log(encodedUrl);

            this.http.get(encodedUrl, {}, {})
              .then(datafrmapi => {
                  if(this.database.development == true)
                  {
                      let alert1 = this.alertCtrl.create({
                          title: "Reminder deleted through api.",
                          subTitle:"Result returned :"+JSON.stringify(datafrmapi),
                          buttons: [
                              {
                                  text: 'Ok',
                                  handler: data => {
                                  }
                              }
                          ]
                      });
                      alert1.present();

                  }
                  console.log("Reminder deleted through http api");
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
            console.log("OFFLINE: Reminder deleted");

            this.getAllRemainderOfContact();
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
  public scheduleNotification(obj)
  {
    // let aa = new Date(new Date().getTime() + 30000);
    // let local : Date = new Date(obj['SetTime']);
    // let aaa = local.toUTCString();
    // let sss = new Date(aaa);
    // let year = sss.getFullYear();
    // let month = sss.getMonth();
    // let day = sss.getDay();
    // let hour = sss.getHours();
    // let min = sss.getMinutes();
    // let sec = sss.getSeconds();
    // let utcDate = new Date(Date.UTC(year, month, day, hour, min, sec));
    //
    // LocalNotifications.schedule({
    //   id:obj['RemainderId'],
    //   title: obj['Description'],
    //   text: obj['ShortNote'],
    //   at: aaa,
    //   sound: null
    // });
  }
  public getAllRemainderOfAllContact()
  {
    this.allRemainderofContact = [];
    this.database.getAllRemainderForAllContact().then((result) => {
      this.allRemainderofContact = <Array<Object>> result;
     // this.gettimeAllContacts();
    }, (error) => {
      console.log("ERROR: ", error);
    });
  }
  // public gettimeAllContacts()
  // {
  //   for(let i of this.allRemainderofContact)
  //   {
  //     let date:String = i['SetTime'];
  //     let aa = date.substr(11,5);
  //     i['time'] = this.getHrFormat(aa);
  //   }
  // }
  public addRemainderToRemainderDeleteTable(v) {

  }
}
