import { Component } from '@angular/core';
import {NavController, NavParams, ToastController, AlertController, Platform} from 'ionic-angular';
import { Database } from '../../providers/database';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';

//pages

// import {ListContactsPagePage} from "../list-contacts-page/list-contacts-page";
import { AddInnercirclePagePage } from "../add-innercircle-page/add-innercircle-page";

declare let Connection: any;
declare let navigator: any;

@Component({
  selector: 'page-inner-circle-page',
  templateUrl: 'inner-circle-page.html'
})
export class InnerCirclePagePage {
  public contactDetails;
  public contactList: Array<Object>;
  public contactname;
  public count;

  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              public toastCtrl: ToastController,
              public alertCtrl:AlertController,
              public database:Database,
              public platform:Platform,
              public http:HTTP,
              private network: Network) {
    this.contactDetails = this.navParams.get('object');
    this.contactname = this.navParams.get('name');

  }
  ionViewWillEnter()
  {
    console.log('ionViewWillEnter AllContactsPagePage');
    this.displayInnerCirlce();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad InnerCirclePagePage');
    let toast = this.toastCtrl.create({
      message: 'Slide to delete',
      duration: 2500,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  openEdit(v)
  {
    this.navCtrl.push(AddInnercirclePagePage,{object:v,from:"Edit Inner circle",contact:this.contactDetails});
  }
  openAddContacts()
  {
    this.navCtrl.push(AddInnercirclePagePage,{object:this.contactDetails,from:"Add Inner circle"});
  }
  displayInnerCirlce()
  {
    this.contactList = [];
    this.database.getAllInnerCircle(this.contactDetails['contactid']).then((result) => {
      this.contactList = <Array<Object>> result;
      this.count = this.contactList.length;
      if(this.count === 0)
      {
        this.count = "0 Member";
      }else if(this.count === 1)
      {
        this.count = "1 Member";
      }else if(this.count > 1)
      {
        this.count = this.count + " Members";
      }

    }, (error) => {
      console.log("ERROR: ", error);
    });
  }
  deleteInnerCircle(v)
  {
    this.http.get("", {}, {})
      .then(datafrmapi => {
      });
    let alert = this.alertCtrl.create({
    title: 'Confirm Delete',
    message: 'Do you want to delete this inner circle?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Delete',
        handler: () => {
          this.platform.ready().then(() => {
      let networkState = this.network.type;
      if (networkState === Connection.NONE) {
        let id = v['id'];
        this.database.deleteInnerCirlceContact(id).then((result)=>{
          this.database.saveInnerCircleToDeleteInOffline(v['InnerCircleIdExt']);
          this.displayInnerCirlce();
        },(error)=>{
        });
      }
      else {
        let id = v['id'];
        let idExt = v['InnerCircleIdExt'];

        let url = this.database.apiUrl+"innercircle/delete?InnerCircleId=" + idExt;

        let encodedUrl = encodeURI(url);
        console.log(encodedUrl);
        this.http.get(encodedUrl, {}, {})
            .then(datafrmapi => {
              console.log("Innercircle deleted using http api");
              if(this.database.development == true)
              {
                let alert1 = this.alertCtrl.create({
                  title: "Inner circle deleted through api.",
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
            })
            .catch(error => {
              console.log(error.status);
              console.log(error.error); // error message as string
              console.log(error.headers);
            });
        this.database.deleteInnerCirlceContact(id).then((result)=>{
          this.displayInnerCirlce();
        },(error)=>{
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
