import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';//pages
import { HTTP } from '@ionic-native/http';
import { FilePath } from '@ionic-native/file-path';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Database } from '../../providers/database';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';


declare var Connection: any;
declare var navigator: any;
declare var cordova: any;

//pages
import { CreateAccountPagePage } from '../create-account-page/create-account-page'
import { AddAccountPagePage } from '../add-account-page/add-account-page'
// import { errorHandler } from "@angular/platform-browser/src/browser";


@Component({
  selector: 'page-sign-in-page',
  templateUrl: 'sign-in-page.html'
})
export class SignInPagePage {
  username: any ;
  password: any;
  public people: any;
  public localStorage;
  //public fileURL;
  public propicName;
    onSign = false;
    timeOut;
    onTimeOut= true;
  storageDirectory: string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public alertCtrl: AlertController,
              public database: Database,
              public loading: LoadingController,
              public storage: Storage,
              public filepath :FilePath,
              public file : File,
              public http:HTTP,
              public transfer:Transfer,
              private geolocation: Geolocation,
              private network: Network) {
      this.platform.ready().then(() => {

      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if(!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });


  }
  ionViewDidLoad() {
    //console.log('ionViewDidLoad SignInPagePage');
  }
    ionViewWillEnter() {
        this.storage.set("signin", "true");

        this.database.isOpen = false;
        this.database.createDatabase();
    }
        openCreateAccount() {
    this.navCtrl.push(CreateAccountPagePage);
  }
  signIn() {
      // this.database.createDatabase();
      this.checkNetwork();
  }
  checkNetwork() {
      this.http.get("", {}, {})
          .then(datafrmapi => {
          });
    this.platform.ready().then(() => {
      var networkState = this.network.type;
      if (networkState === Connection.NONE) {
        let alert = this.alertCtrl.create({
          title: "No Internet Connection",
          subTitle: "Check your internet connection",
          buttons: [
            {
              text: 'Ok',
              handler: data => {
              }
            }
          ]
        });
        alert.present();
      }
      else {
        
        this.callSignInApi();
      }
    });
  }
  callSignInApi() {
      this.database.createDatabaseUser();
    let loader = this.loading.create({
      content: 'Signing In...',
    });
      this.database.load = true;

      loader.present();
    let url = this.database.apiUrl + "login/LoginUser?UserName=" + this.username + "&Password=" + this.password;
    let encodedUrl = encodeURI(url);
    this.http.get(encodedUrl, {}, {})
      .then(data => {
        this.people = data.data;
        let userDetails = JSON.parse(this.people);
        console.log(userDetails);
        if(userDetails[0].ProfilePicture == null ||userDetails[0].ProfilePicture == "" )
        {
            localStorage.setItem("image","assets/Images/profile.jpg");

        }else
        {
            // localStorage.setItem("image",userDetails[0].ProfilePicture);

            this.download(userDetails[0].ProfilePicture,userDetails[0].UserId)
        }
        if (userDetails[0].UserId != null) {
          this.database.userIdFromDB = userDetails[0].UserId;


        }
        this.storage.set('LocalStorageUserDetails', userDetails).then(() => {
          console.log('true set signin');
        });
      // this.download(userDetails[0].ProfilePicture,userDetails[0].UserId).then((data)=>{
      //    if (userDetails[0].UserId != null) {
      //
      //     this.database.userIdFromDB = userDetails[0].UserId;
      //     localStorage.setItem("userid", userDetails[0].UserId);
      //     localStorage.setItem("email",userDetails[0].Email);
      //     console.log(userDetails[0].Email);
      //     this.database.addToUserTable(userDetails[0].UserName, userDetails[0].PhoneNO, userDetails[0].Email,
      //       userDetails[0].CompanyName, userDetails[0].CompanyWebSiteFeed, userDetails[0].Position, userDetails[0].Country, userDetails[0].City, userDetails[0].State, userDetails[0].ZipCode,this.storageDirectory+this.propicName+".jpg").then((result) => {
      //       localStorage.setItem("imageuser", this.storageDirectory+this.propicName+".jpg");
      //
      //
      //         this.database.saveWholeInterestList();
      //         this.database.getallGroupFromApi();
      //         this.database.launchedFirst = 1;
      //         this.storage.set("signin", "false");
      //
      //         // this.database.getInterestForContactFrmApi().then((data)=>{
      //         //   loader.dismissAll();
      //         //   this.navCtrl.setRoot(AddAccountPagePage);
      //         //
      //         // },(error)=>{
      //         //   loader.dismissAll();
      //         //   this.navCtrl.setRoot(AddAccountPagePage);
      //         // });
      //         loader.dismissAll();
      //         this.navCtrl.setRoot(AddAccountPagePage);
      //
      //         //this.database.getInnerCircleFromApi();
      //         //this.storage.set("userid",userDetails[0].UserId);
      //         //this.database.getInnerCircleFromApi();
      //
      //       }, (error) => {
      //         console.log("ERROR: ", error);
      //       });
      //   }
      //
      // },(err)=>{
       if (userDetails[0].UserId != null) {
          this.database.userIdFromDB = userDetails[0].UserId;
          localStorage.setItem("userid", userDetails[0].UserId);
          this.database.addToUserTable(userDetails[0].UserName, userDetails[0].PhoneNO, userDetails[0].Email,
            userDetails[0].CompanyName, userDetails[0].CompanyWebSiteFeed, userDetails[0].Position, userDetails[0].Country, userDetails[0].City, userDetails[0].State, userDetails[0].ZipCode,userDetails[0].ProfilePicture).then((result) => {
              //this.database.addContactFrmExt();
              localStorage.setItem("imageuser", "assets/Images/profile.jpg");
              localStorage.setItem("email",userDetails[0].Email);

              //this.database.syncRemainder();
              // this.database.saveWholeInterestList();
              this.database.launchedFirst = 1;
              this.storage.set("signin", "false");
              
              // this.database.getInterestForContactFrmApi().then((data)=>{
              //   loader.dismissAll();
              //   this.navCtrl.setRoot(AddAccountPagePage);
              //
              // },(error)=>{
              //   loader.dismissAll();
              //   this.navCtrl.setRoot(AddAccountPagePage);
              // });
              loader.dismissAll();
              this.onSign = true;
              // let loaderAcc = this.loading.create({
              //     content: 'Getting contacts',
              // });
              //
              // loaderAcc.present();

              this.setTimeOut();

              this.database.addContactFrmExt().then((result)=>{
                  this.database.getallGroupFromApi();

                  this.database.addReminderFrmExt().then((resRemain)=>{
                      this.database.addInnerFrmExt().then((resInner)=>{
                          console.log("inner circle finished");

                          this.database.addInterestFrmExt().then((resInt)=>{

                              console.log("Interest finished");

                          });
                          this.navCtrl.setRoot(AddAccountPagePage);
                      });
                  });
              });

              //this.database.getInnerCircleFromApi();
              //this.storage.set("userid",userDetails[0].UserId);
              //this.database.getInnerCircleFromApi();

            }, (error) => {
              console.log("ERROR: ", error);
            });
        }
      // });

        //console.log("JSON.parse(this.people)",JSON.parse(this.people));
      })
      .catch(error => {
        loader.dismissAll();
        console.log(error);
        let alert = this.alertCtrl.create({
          title: "Invalid Login Credentials",
          subTitle:"Please enter a valid email and password",
          buttons: [
            {
              text: 'Ok',
              handler: data => {
              }
            }
          ]
        });
        alert.present();
      });
  }
  public download(url,userid) {
    return new Promise((resolve, reject) => {
    this.platform.ready().then(() => {
      this.propicName = "user"+userid;
      const fileTransfer: TransferObject = this.transfer.create();
      fileTransfer.download(url, this.storageDirectory + this.propicName+".jpg").then((entry) => {
          localStorage.setItem("image",this.storageDirectory + this.propicName+".jpg");
        resolve();
      }, (error) => {
          localStorage.setItem("image","assets/Images/profile.jpg");

          reject();
      });
    });
    });
 }
    setTimeOut()
    {
        this.timeOut = setTimeout(() =>{

            this.onTimeOut = false;

        } , 10000)
    }
}