import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import * as _ from "lodash";

declare var Connection: any;
declare var navigator: any;
import { FilePath } from '@ionic-native/file-path';
import { HTTP } from '@ionic-native/http';
import { ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { Database } from '../../providers/database';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';//pages

import { ListContactsPagePage } from '../list-contacts-page/list-contacts-page';
import { EditContactPagePage } from '../edit-contact-page/edit-contact-page';

declare var cordova: any;

@Component({
  selector: 'page-group-edit-page',
  templateUrl: 'group-edit-page.html'
})
export class GroupEditPagePage {

  public groupDetails: any;
  public contactList: any;
    public contactListInit: Array<Object>;


  public loader;
  public groupname;
  imageStr:any
  profilePicUpdated:boolean = false;
  lastImage: string = null;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController,
              public database: Database,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public http:HTTP,
              public transfer:Transfer,
              public file : File,
              public filepath :FilePath,
              public camera : Camera,
              private network: Network,
              public toast:Toast) {
    this.groupDetails = this.navParams.get('object');
    this.groupname = this.navParams.get('name');
    console.log("this.groupDetails", this.groupDetails);
  }
  ionViewWillEnter() {
    this.contactList = [];
    console.log('ionViewWillEnter GroupEditPagePage');
    this.displayGroupContact();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupEditPagePage');
  }

  openContactsList() {
    this.database.numOfCon = 0;
    this.navCtrl.push(ListContactsPagePage, { object: this.groupDetails, comingFrom: "group" ,number:this.contactList.length});
  }
  openContactEditPage(v) {
    this.navCtrl.push(EditContactPagePage, { object: v });
  }
  deleteGroupContact(v) {
    console.log("Contact to delete",v);
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    this.platform.ready().then(() => {
      var networkState = this.network.type;
      if (networkState === Connection.NONE) {
        this.database.deleteContactFrmGroupContact(v['GroupContactId']).then((result) => {
          this.displayGroupContact();
          this.database.saveGroupContactToDeleteInOffline(v['contactidext'], this.groupDetails['GroupId']);
        }, (error) => {
          console.log("ERROR: ", error);
        });
      } else {

        let url = this.database.apiUrl + "group/deleteGroupContacts?GroupId=" + this.groupDetails['GroupIdExt'] + "&ContactListId=" + v['contactidext'];
        let encodedUrl = encodeURI(url);
        console.log(encodedUrl);

        this.http.get(encodedUrl, {}, {})
          .then(datafrmapi => {
            console.log("Group contact deleted through http api");
            console.log("Result from server"+datafrmapi);
            if(this.database.development == true)
            {
              let alert1 = this.alertCtrl.create({
                title: "Group contact  deleted through api.",
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

        this.database.deleteContactFrmGroupContact(v['GroupContactId']).then((result) => {
          this.displayGroupContact();
          console.log(result);
        }, (error) => {
          console.log("ERROR: ", error);
        });

      }
    });
  }
  displayGroupContact() {
    this.contactList = [];
    this.database.getAllGroupContact(this.groupDetails['GroupId']).then((result) => {
        this.contactList =  <Array<Object>>result;
        // this.contactListInit = <Array<Object>>result;
        // this.transform(this.contactList,"firstname");
        console.log(this.contactList);


        // if(this.database.contactAddedToGroup == true)
      // {
      //   this.database.contactAddedToGroup = false;
      //   let diff  =  this.contactList.length  -this.database.numOfCon;
      //   console.log(diff);
      //   let alert = this.alertCtrl.create({
      //     title: "Contacts Added",
      //     subTitle: this.database.numOfCon+" Contacts have been added",
      //     buttons: [
      //       {
      //         text: 'Ok',
      //         handler: data => {
      //           this.navCtrl.pop();
      //         }
      //       }
      //     ]
      //   });
      //   alert.present();

      //}
    }, (error) => {
      console.log("ERROR: ", error);
    });

  }
    transform(array, args) {
        this.contactList = [];
        let sortedList = _.sortBy(array, args);
        this.contactList = sortedList;
        // let currentLetter = false;
        // let currentContacts:Array<Object> = [];

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
          text: 'None',
          handler: () =>{
            this.setNoneAsPic();
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
  public setNoneAsPic()
  {
    this.updateGroupProPic("assets/Images/profile.jpg");
    this.navCtrl.pop();
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
              console.log("Directory"+this.database.storageDirectory);
                  this.file.copyFile(namePath, currentName, this.database.storageDirectory, newFileName).then(success => {
                  this.lastImage = newFileName;
                  this.groupDetails['ProfilePicture'] = this.database.storageDirectory + newFileName;
                  console.log("cordova.file.dataDirectory+newFileName", this.database.storageDirectory+newFileName);

                  loader.dismissAll();
                this.uploadImage();
              }, error => {
                loader.dismissAll();

                this.presentToast('Error while storing image');

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
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    this.platform.ready().then(() => {
      var networkState = this.network.type;
      if (networkState === Connection.NONE) {
        let alert = this.alertCtrl.create({
          title: "No internet connection",
          subTitle: "You cannot change group picture without active internet connection.",
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
        this.loader = this.loadingCtrl.create({
          content: 'Uploading...',
        });
        this.loader.present();
        let url = this.database.apiUrl+"Contact/uploadProfile?TypeId=3&UpdateId=" + this.groupDetails.GroupIdExt;

        // File for Upload
        let targetPath = this.pathForImage(this.lastImage);

        // File name only
        let filename = this.lastImage;

        let options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params: { 'fileName': filename }
        };

        const fileTransfer: TransferObject = this.transfer.create();


        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
          console.log(data);
          this.profilePicUpdated = true;
          this.imageStr = targetPath;
          this.updateGroupProPic("http://comp-view.com/SparkWorthy/UploadImages/Groups/"+filename);
          console.log("Image uploaded successfully");
        }, err => {
          console.log(err);
          this.loader.dismissAll();
        });

      }
    });
        //http://182.71.233.135:92/api/login/updateProfilePicture?UserId=2&uploadDP=Test1.png
    // Destination URL
  }
  //END of image access and upload



  saveEditedGroup() {
    this.database.load = true;

    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    let gid = this.groupDetails['GroupId'];
    let gname = this.groupname;
    console.log(gid);
    console.log(gname);
    gname = gname.trim();

    if (gname == null || gname == " " || gname == "") {
      this.toast.show("Enter a group name", '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          });

    } else {


    let networkState = this.network.type;
    if (networkState === Connection.NONE) {
      this.database.editGroup(gid, gname).then((result) => {
        // this.navCtrl.pop();
        console.log("OFFLINE:Group edited");
        this.toast.show("Group updated successfully", '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            });
      }, (error) => {
        console.log("ERROR: ", error);
      });
    } else {
      let url = this.database.apiUrl + "group/update?GId=" + this.groupDetails['GroupIdExt'] + "&GName=" + gname;

      let encodedUrl = encodeURI(url);

      this.http.get(encodedUrl, {}, {})
          .then(datafrmapi => {
            console.log("Group edited through online");
            this.database.editGroupOnline(gid, gname).then((result) => {
              this.toast.show("Group updated successfully", '5000', 'center').subscribe(
                  toast => {
                    console.log(toast);
                  });
              console.log(result);
            }, (error) => {
              console.log("ERROR: ", error);
            });
          })
          .catch(error => {
            this.database.editGroup(gid, gname).then((result) => {
              // this.navCtrl.pop();
              this.toast.show("Group updated successfully", '5000', 'center').subscribe(
                  toast => {
                    console.log(toast);
                  });
              console.log("OFFLINE:Group edited");

            }, (error) => {
              console.log("ERROR: ", error);
            });
          });
    }

  }
  }
  //  public download(name) {
  //   return new Promise((resolve, reject) => {
  //     this.platform.ready().then(() => {
  //       // this.propicName = "user"+userid;
  //       let ProPicname = "group"+this.groupDetails.GroupIdExt;

  //       let url = this.database.staticUrlGroup+name;

  //       const fileTransfer: TransferObject = this.transfer.create();
  //       fileTransfer.download(url, this.database.storageDirectory +ProPicname+ ".jpg").then((entry) => {
  //         this.updateGroupProPic(this.database.storageDirectory +ProPicname+ ".jpg");
  //         resolve();
  //       }, (error) => {
  //        this.loader.dismissAll();
  //         reject();
  //       });
  //     });
  //   });
  // }
  public updateGroupProPic(name)
  {
    this.database.load = true;


    this.database.updateGroupContactPicture(name,this.groupDetails['GroupId'] ).then((result) => {
      this.loader.dismissAll();
      this.groupDetails['ProfilePicture'] = name;
           // alert(JSON.stringify(result));

      this.navCtrl.pop();
    }, (error) => {
      this.loader.dismissAll();
      this.navCtrl.pop();
      console.log("ERROR: ", error);
    });
  }

}
