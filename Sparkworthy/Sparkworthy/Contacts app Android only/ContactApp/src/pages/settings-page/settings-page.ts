import { Component } from '@angular/core';
import {NavController, NavParams, Platform, AlertController, App,ModalController} from 'ionic-angular';
import { ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { Database } from '../../providers/database';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Toast } from '@ionic-native/toast';

import { Camera } from '@ionic-native/camera';

import { File } from '@ionic-native/file';//pages
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';

// import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
declare var Connection: any;
declare var navigator: any;
declare var cordova: any;

import { SQLitePorter } from '@ionic-native/sqlite-porter';

//page
import { AddAccountPagePage } from '../add-account-page/add-account-page';
import {SignInPagePage} from "../sign-in-page/sign-in-page";
import {SettingsModelPage} from "../settings-model/settings-model";


@Component({
  selector: 'page-settings-page',
  templateUrl: 'settings-page.html'
})
export class SettingsPagePage {

  public propicName;
  userdetails = {};
  userCompany: any;
  userName: any;
  userCity: any;
  userId: any;
  updateDeatailsUser: any;
  getDetailsUser: any;
  imageSrc: any;
  localStorageEmail: any;
  localStoragePassword: any;
  InterestgetUser: any;
  userImageprofile: string;
  lastImage: string = null;
  loading: Loading;
  imageEncode: any;
  spinnerBool:boolean = false;
  boolFrmSync :Boolean = false;
  storageDirectory: string = '';
backButtonPressedOnceToExit:any;
  constructor(public navCtrl: NavController,
              public storage: Storage,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public platform: Platform,
              public navParams: NavParams,
              public database: Database,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private http: HTTP,
              public filepath :FilePath,
              public file:File,
              private transfer: Transfer,
              private camera: Camera,
              private geolocation: Geolocation,
              public app: App,
              public diagnostic : Diagnostic,
              public toast : Toast,
              private network: Network,
              public modalCtrl: ModalController) {

      this.platform.ready().then(() => {
        storage.get("firstLaunch").then((res)=>{
          if(res == true)
          {
            this.openModal();
          }
        })
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

  openModal() {
    let myModal = this.modalCtrl.create(SettingsModelPage);
    myModal.present();
  }

  ionViewWillEnter() {
    this.userImageprofile =   localStorage.getItem("image");

    this.getUserDetails();
  }
  ionViewDidLoad() {

  }
  openAccountSyncPage() {
    this.navCtrl.push(AddAccountPagePage);
  }
  //description: update the user details to database API services
  //params : userId,userName, userCity,userCompany
  updateUserDetails() {
    if(this.userName == null || this.userName == "")
    {
        this.userName = "";
    }
      if(this.userName == null || this.userName == "")
      {
          this.userName = "";
      }
      if(this.userCompany == null || this.userCompany == "")
      {
          this.userCompany = "";
      }
      if(this.userCity == null || this.userCity == "")
      {
          this.userCity = "";
      }

    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    });
    loader.present();
    this.platform.ready().then(() => {
      var networkState = this.network.type;
      if (networkState === Connection.NONE) {
        this.database.updateUserInLocalDB(this.userName, this.userCompany, this.userCity, this.userId).then((result) => {
          loader.dismissAll();

          let alert = this.alertCtrl.create({
            title: "Success",
            subTitle: "Settings updated successfully.",
            buttons: [
              {
                text: 'Ok',
                handler: data => {
                  //this.navCtrl.pop();
                }
              }
            ]
          });
          alert.present();

          //this.navCtrl.pop();
        }, (error) => {
          loader.dismissAll();

          console.log("ERROR: ", error);
        });
      }
      else {
        // http://182.71.233.135:92/api/login/update?UserId=2&Name=SS&CompanyFeed=test my company info's&Location=USA

        let url = this.database.apiUrl + "login/update?UserId=" + this.userId + "&Name=" + this.userName + "&CompanyFeed=" + this.userCompany + "&Location=" + this.userCity;

        let encodedUrl = encodeURI(url);

        this.http.get(encodedUrl, {}, {})
          .then(data => {
            console.log("Result from server",data);
            console.log("User details updated through http api");
            if(this.database.development == true)
            {
              let alert1 = this.alertCtrl.create({
                title: "User  edited through api.",
                subTitle:"Result returned :"+JSON.stringify(data),
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
            loader.dismissAll();
            this.updateDeatailsUser = data.data;
            loader.dismissAll();
          })
          .catch(error => {
            loader.dismissAll();
          });
        this.database.updateUserInLocalDB(this.userName, this.userCompany, this.userCity, this.userId).then((result) => {
          //this.navCtrl.pop();
          let alert = this.alertCtrl.create({
            title: "Success",
            subTitle: "Settings updated successfully.",
            buttons: [
              {
                text: 'Ok',
                handler: data => {
                  //this.navCtrl.pop();
                }
              }
            ]
          });
          alert.present();

        }, (error) => {
          console.log("ERROR: ", error);
        });

      }
    });
  }

  //createdBy : gidhin
  //description:get the user value from data  base api services
  //params:userName and userPassword
  getUserDetails() {
  let loader = this.loadingCtrl.create({
              content: 'Fetching Details...',
            });
    if(this.boolFrmSync != true)
    {
      
          loader.present();
    }
    this.boolFrmSync = false;

    this.database.getUser().then((result) => {


      this.userName = result[0].Name;
      this.userCompany = result[0].Company;
      this.userId = result[0].UserId;
      this.userCity = result[0].City;
      loader.dismissAll();
    }, (error) => {
      //console.log("ERROR: ", error);
    });
  }

  syncAllFunctions() {
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    var networkState = this.network.type;
    if (networkState === Connection.NONE) {
      let alert = this.alertCtrl.create({
        title: "No internet connection",
        subTitle: "Check your internet connection and try again",
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
      let loader = this.loadingCtrl.create({
        content: 'Syncing...',
      });
      loader.present();

      this.database.checkContactDeleteTable();
      this.database.checkGroupDeleteTable();
      this.database.checkGroupContactDeleteTable();
      this.database.checkRemainderDeleteTable();
      this.database.checkInnerCircleDeleteTable();
      this.database.checkInterestDelete();
      this.database.checkGroupContactDeleteTable();
      this.database.checkContactSync();

      // this.database.checkContactUpdate();
      // this.database.checkUpdateInnerCirlce();
      // this.database.checkUpdateReminder();
      // this.database.checkGroupSync();
      // this.database.checkGroupContactSettings();
      // this.database.addInterestToApi();

      // this.database.checkGroupSync();
      // this.database.checkRemainderSync();
      // this.database.checkGroupContactSettings();
      // this.database.checkInnerCircleSettings();
      loader.dismissAll();
      setTimeout(() =>{
        this.toast.show("Synchronized successfully", '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
        );
      } , 5000);


      //     this.database.checkContactDeleteTable();
      //     this.database.checkGroupDeleteTable();
      //     this.database.checkRemainderDeleteTable();
      //     this.database.checkInnerCircleDeleteTable();
      //     this.database.checkInterestDelete();
      //     this.database.saveNewContactsToApi();
      //     this.database.checkContactSync();
      //     this.database.updateContactToApi();
      //     this.database.checkGroupSync();
      //     this.database.checkGroupContactDeleteTable();
      //     this.database.checkInterestTable();
      //     this.database.updateGroupToApi();
      //     this.database.updateRemainderToApi();
      //     this.database.updateGroupContactToApi();
      //     this.database.getInnerCircleFromApi();
      //     this.boolFrmSync = true;
      //     this.getUserDetails();
      //     loader.dismissAll();
      //   }
      // });
      this.syncEmail();
    }
  }

  // statring of image access and upload
  //testing image upload action sheet
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Go to Gallery',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  //testing take pic from gallary and cameraOptions
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filepath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log("filePath", filePath);

            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            console.log("correctPath", correctPath);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            console.log("currentName", currentName);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());


      }
    }, (err) => {
      this.presentToast('Error while selecting image');
    });
  }
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    });
    loader.present();
    this.file.copyFile(namePath, currentName, this.database.storageDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      loader.dismissAll();

      this.uploadImage();
      console.log("this.lastImage", this.lastImage);
    }, error => {
      loader.dismissAll();
      this.presentToast('Error while storing image');
      console.log("error",error)
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (this.platform.is('ios')) {
      return cordova.file.documentsDirectory + img;
    }else {
      if (img === null) {
        return '';
      } else {
        return cordova.file.dataDirectory + img;
      }
    }
  }

  public uploadImage() {
    this.loading = this.loadingCtrl.create({
      content: 'Setting Profile Picture...',
    });
    this.loading.present();
    //debugger;
    // Destination URL
    console.log("this.userId", this.userId);
    let url = this.database.apiUrl+"Contact/uploadProfile?TypeId=1&UpdateId=" + this.userId;


    // File for Upload
    let targetPath = this.pathForImage(this.lastImage);
    console.log("targetPath", targetPath);

    // File name only
    let filename = this.lastImage;
    console.log("filename", filename);

    let options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { 'fileName': filename }
    };
    // var data = new FormData(options[0]);
    // console.log('dataas', data);
    // debugger;

    console.log("options", options);
    const fileTransfer: TransferObject = this.transfer.create();

    
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {

      console.log("data", data);
      this.presentToast('Image uploaded successfully');
      this.loading.dismissAll();

      this.database.updateUserProPic("http://comp-view.com/SparkWorthy/UploadImages/Users/"+filename,this.database.userIdFromDB).then((result)=>{
        localStorage.setItem("image",this.storageDirectory +filename);
        this.userImageprofile = this.storageDirectory +filename;
        this.download("http://comp-view.com/SparkWorthy/UploadImages/Users/"+filename,this.database.userIdFromDB);

        //for ios
        // localStorage.setItem("image","http://comp-view.com/SparkWorthy/UploadImages/Users/"+filename);
        // this.userImageprofile = "http://comp-view.com/SparkWorthy/UploadImages/Users/"+filename;
        // this.download("http://comp-view.com/SparkWorthy/UploadImages/Users/"+filename,this.database.userIdFromDB);

      });
    }, err => {
      this.loading.dismissAll();
      this.presentToast('Error while uploading image');
      console.log("err", err);
      this.loading.dismissAll();

    });
  }
  //END of image access and upload
  download(name,userid) {
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    });

    return new Promise((resolve, reject) => {
    this.platform.ready().then(() => {
      let url = name;
      this.propicName = "user"+userid;
      const fileTransfer: TransferObject = this.transfer.create();
      this.loading.dismissAll();
      console.log("downloding");
      fileTransfer.download(url, this.storageDirectory + this.lastImage).then((entry) => {
        console.log("downloded");
        console.log(entry);
        //android only
        localStorage.setItem("image",this.storageDirectory + this.lastImage);
        this.userImageprofile = this.storageDirectory + this.lastImage;
        resolve();
      }, (error) => {
        console.log(error);
        loader.dismissAll();


        reject();
      });
      loader.dismissAll();

    });
    });
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
      public getLocation()
      {
        this.spinnerBool = true;
        this.geolocation.getCurrentPosition({enableHighAccuracy: true }).then((resp) => {

          let url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+resp.coords.latitude+","+resp.coords.longitude+"&sensor=true";
          let encodedUrl = encodeURI(url);
          this.http.get(encodedUrl,{},{}).then((data)=>{

            let d = JSON.parse(data.data);
            // console.log(d);
            //4th one Boston
            let len = d.results[0].address_components.length;

            this.spinnerBool = false;
            if(d.results[0].address_components[len-5].long_name == null)
            {
              this.toast.show("Unable to get location try again", '5000', 'center').subscribe(
                  toast => {
                    console.log(toast);
                  }
              );

            }
            else
            {
              this.userCity = d.results[0].address_components[len-5].long_name;
              this.toast.show("Current location obtained", '5000', 'center').subscribe(
                  toast => {
                    console.log(toast);
                  }
              );
            }


          }).catch((err)=>
          {
            this.spinnerBool = false;

            this.toast.show("Unable to get location try again", '5000', 'center').subscribe(
                toast => {
                  console.log(toast);
                }
            );
          });
        }).catch((error) => {
          this.spinnerBool = false;

          console.log('Error getting location', error);
          this.toast.show("Unable to get location try again", '5000', 'center').subscribe(
              toast => {
                console.log(toast);
              });
        });
      }
    syncEmail()
    {
      
    }
    public logout()
    {
      this.database.logout();

      this.app.getRootNav().setRoot(SignInPagePage);
    }
    navigateMe()
    {
      this.http.get("", {}, {})
          .then(datafrmapi => {
          });
      let networkState = this.network.type;
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
      }else
      {
        this.checkGps();
      }


    }
  public checkGps()
  {
    console.log(this.diagnostic.isLocationEnabled());
    this.diagnostic.isLocationEnabled().then((res)=>{
      if(res == false)
      {
        let alert = this.alertCtrl.create({
          title: "Gps Disabled",
          subTitle: "Turn on GPS",
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
              }
            },
            {
              text: 'Go to Settings',
              handler: data => {
                this.diagnostic.switchToLocationSettings();
              }
            }
          ]
        });
        alert.present();
      }else
      {
        this.getLocation();
      }
    }).catch((err)=>{
      console.log(err)
    });
  }
}
