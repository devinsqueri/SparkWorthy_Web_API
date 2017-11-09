import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, Platform,LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Database } from '../../providers/database';
import * as _ from "lodash";
import { ModalController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

declare var Connection: any;
declare var navigator: any;

//pages
import { InterestNewsPagePage } from '../interest-news-page/interest-news-page'
// import { EditInnerCirclePagePage } from '../edit-inner-circle-page/edit-inner-circle-page';
import { AddInterestPage } from '../add-interest/add-interest'
@Component({
  selector: 'page-interest-page',
  templateUrl: 'interest-page.html'
})
export class InterestPagePage {

  contactDetails: any;
  public interestList: Array<Object>;
  getInterest: any;
  contactId: any;
  testCheckboxResult: any;
  getContactInterest: any;
  interestCount:any;
  public loader:any;
  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public platform: Platform,
              public database: Database,
              public http:HTTP,
              public modalCtrl: ModalController,
              private network: Network) {
    this.contactDetails = navParams.get('object');
   // this.database.saveWholeInterestList();

    //let contactId = this.contactDetails.contactid
  }
  presentModal() {
      let profileModal = this.modalCtrl.create(AddInterestPage, {});
      profileModal.onDidDismiss(data => {
          console.log(data);
      });
      profileModal.present();
  }
  ionViewWillEnter() {
    this.loader = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.loader.present();
    this.displayInterest();
    this.getInterestValue();
  }
  ionViewDidLoad() {
    // let toast = this.toastCtrl.create({
    //   message: 'Slide interest to delete',
    //   duration: 2500,
    //   position: 'bottom'
    // });
    // toast.onDidDismiss(() => {
    // });
    //
    // toast.present();
  }

  addInterest() {
    //alert("Work in progress");
    this.navCtrl.push(AddInterestPage,{ object: this.contactDetails});

    //this.showCheckbox();
  }
  openInterestFeed() {
    this.checkNetwork();
    this.navCtrl.push(InterestNewsPagePage);
  }
  checkNetwork() {
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    this.platform.ready().then(() => {
      var networkState = this.network.type;
      if (networkState === Connection.NONE) {
      }
      else {
      }
    });
  }
  public displayInterest() {
    this.interestList = [];
    this.database.getAllInterest(this.contactDetails['contactid']).then((result) => {
      this.interestList = <Array<Object>>result;

    }, (error) => {
      console.log("ERROR: ", error);
    });
  }
  deleteInterest(v) {
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    var networkState = this.network.type;
    if (networkState === Connection.NONE) {
      this.database.deleteInterest(v['id']).then((result) => {
        this.getInterestValue();
      }, (error) => {
        console.log("ERROR: ", error);
      });
      this.database.addInterestToDeleteTable(this.contactDetails['contactidext'],v['InterestedId']);
    }
    else {

      let url = this.database.apiUrl+"interest/deleteContactInterest?Id="+v['InterestedId'];

      let encodedUrl = encodeURI(url);

      this.http.get(encodedUrl, {}, {})
        .then(data => {
        })
        .catch(error => {
        });
      this.database.deleteInterest(v['id']).then((result) => {
        this.getInterestValue();

      }, (error) => {
        console.log("ERROR: ", error);
      });
    }
  }
  showCheckbox() {
    let loader = this.loadingCtrl.create({
      content: 'Fetching Details...',
    });
    loader.present();
    // let url = this.database.apiUrl + "interest/getInterest?GetType=0&Id=0";
    //
    // HTTP.get(url, {}, {})
    //   .then(data => {
    //     this.getInterest = JSON.parse(data.data);
    //     console.log("getInterest", this.getInterest);
    //   })
    //   .catch(error => {
    //   });
    let alertIn = this.alertCtrl.create();
    alertIn.setTitle('Select Interest');
    if (this.getInterest.length == this.getContactInterest.length)
    {
          alertIn.setTitle('No more interest available');
    }else
    {
    let bool : boolean;
    for (let entry of this.getInterest) {
      // if (this.getContactInterest.length > 0)
      // {
        bool = false;
        for(let n of this.getContactInterest)
        {
          if (n.InterestIdExt == entry.InterestId)
          {
            bool = true;
          }
        }
        if (bool == false)
        {
          alertIn.addInput({
            type: 'checkbox',
            label: entry.InterestName,
            value: entry.InterestId,
            checked: false
          });
          bool = false;
        }

      //}
      // else
      // {
      //   alertIn.addInput({
      //     type: 'checkbox',
      //     label: entry.InterestName,
      //     value: entry.InterestId,
      //     checked: false
      //   });
      // }
    }

    }
    alertIn.addButton('Cancel');
    alertIn.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxResult = data;
        console.log("this.testCheckboxResult", this.testCheckboxResult);
        this.addInterestValue();
      }
    });
    alertIn.present().then((result)=>{
    },(errr)=>{
    });
      loader.dismissAll();
  }
  //Get the contacts interest value from server 
  public getInterestValue() {
    this.database.getInterestForContact(this.contactDetails.contactid).then((result) => {
      this.getContactInterest = <Array<Object>> result;
      this.interestCount = this.getContactInterest.length ;
      console.log("count"+this.getContactInterest.length);
      switch(this.interestCount)
      {
        case 0:
                this.interestCount = "0 Interest";
                break;
        case 1:
                this.interestCount = "1 Interest";
                break;
        default:
                this.interestCount = this.getContactInterest.length+ " Interests";
                break;
      }
      // alert(JSON.stringify(this.interestCount));
      this.getInterestList();
    }, (error) => {
      this.getInterestList();
    });
  }
  //Add the contacts interest value to server 
  public addInterestValue() {
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    let networkState = this.network.type;
    if (networkState === Connection.NONE) {
      for (let val of this.testCheckboxResult)
      {
        this.database.addInterestToContact(this.contactDetails.contactid,this.contactDetails.contactidext,val).then((result)=>{
          this.getInterestValue();
        },(error)=>{
        });
      }
    }
    else {
      for (let val of this.testCheckboxResult) {
        let url = this.database.apiUrl + "interest/save?ContactId=" + this.contactDetails.contactid + "&InterestListId=" + val;
        let encodedUrl = encodeURI(url);
        this.http.get(encodedUrl, {}, {})
            .then(data => {
              let dataApi = JSON.parse(data.data);
                this.database.addInterestToContactWhenOnline(this.contactDetails.contactid, this.contactDetails.contactidext, val, dataApi).then((result) => {
                  this.getInterestValue();
                }, (error) => {
                  this.database.addInterestToContact(this.contactDetails.contactid,this.contactDetails.contactidext,val).then((result)=>{
                    this.getInterestValue();
                  },(error)=>{
                  });

                });
            })
            .catch(error => {
            });
      }
    }
  }
  public getInterestList() {
      this.loader.dismissAll();
    // this.database.getWholeInterestList().then((result) => {
    //   this.getInterest = <Array<Object>>result;
    //   this.transform(this.getInterest,"InterestName");
    //            this.loader.dismissAll();
    //
    // }, (error) => {
    //            this.loader.dismissAll();
    //
    //   //console.log("ERROR: ", error);
    // });
  }
  transform(array, args) {
    this.getInterest = [];
    let sortedList = _.sortBy(array, args);
    this.getInterest = sortedList;
    // let currentLetter = false;
    // let currentContacts:Array<Object> = [];
  }
}
