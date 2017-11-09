import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ActionSheetController, ToastController, LoadingController, Loading,AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import {  FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { HTTP } from '@ionic-native/http';
declare let Connection: any;
declare let navigator: any;
declare let cordova: any;
import { Network } from '@ionic-native/network';

import { Database } from '../../providers/database';
import { ValidationService } from '../../app/validation.service';

//pages

@Component({
    selector: 'page-add-group-page',
    templateUrl: 'add-group-page.html'
})
export class AddGroupPagePage {
  public loader:any;
    userForm: any;
    group = {};
    isConnectedToNet: boolean;
    public gotImage:any = false;
    lastImage: string = null;
    loading: Loading;
    public addImage:Boolean = false;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public database: Database,
        public platform: Platform,
        public formBuilder: FormBuilder,
        public actionSheetCtrl: ActionSheetController,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public http:HTTP,
        public filepath : FilePath,
        public file:File,
        private transfer: Transfer, 
        public camera :Camera,
        private network: Network,
        public alertCtrl : AlertController) {

        this.userForm = this.formBuilder.group({
            'gname': ['', [Validators.required, ValidationService.groupName, Validators.minLength(1), Validators.maxLength(99)]]
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddGroupPagePage');
        console.log(this.database.userIdFromDB);

    }
    saveGroup() {
        this.database.load = true;
        this.http.get("", {}, {})
            .then(datafrmapi => {
            });
        if (this.userForm.dirty && this.userForm.valid) {
            let groupname = this.userForm.value.gname;

            this.platform.ready().then(() => {
                this.database.groupAdded = true;
                let networkState = this.network.type;

                if (networkState === Connection.NONE) {

                    this.isConnectedToNet = false;
                    if(this.gotImage == true)
                    {
                        this.database.addGroupWithProPic(groupname,this.database.storageDirectory+this.lastImage, 0).then((result) => {
                        this.database.groupAdded = true;
                        this.navCtrl.pop();
                    },
                    (error) => {
                        console.log("ERROR: ", error);
                    });
                        
                    }else
                    {
                        this.database.addGroup(groupname, 0).then((result) => {
                        this.database.groupAdded = true;
                        this.navCtrl.pop();
                    }, (error) => {
                        console.log("ERROR: ", error);
                    });
                    }
                    
                }
                else {
                      this.loader = this.loadingCtrl.create({
                         content: 'Loading...',
                    });
                    this.loader.present();
                    this.isConnectedToNet = true;

                    let url = this.database.apiUrl + "group/save?UserId=" + this.database.userIdFromDB + "&GName=" + groupname;

                    let encodedUrl = encodeURI(url);

                    this.http.get(encodedUrl, {}, {})
                        .then(datafrmapi => {
                            // update contactidext and ifsync
                            let aa = JSON.parse(datafrmapi.data);
                            console.log("Group added through http api", aa);
                            console.log("Id from sentient",aa);
                            if(this.database.development == true)
                            {
                                let alert1 = this.alertCtrl.create({
                                    title: "Group added through api.",
                                    subTitle:"Result returned "+aa,
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
                            this.database.addGroupWhenonline(groupname, 1, aa).then((result) => {
                                if(this.gotImage == true)
                                {
                                    this.uploadImage(aa);
                                }else
                                {
                                    this.loader.dismissAll();
                                    this.navCtrl.pop();
                                }
                            }, (error1) => {
                                console.log("ERROR: ", error1);
                            });
                        })
                        .catch(error => {
                            this.loader.dismissAll();
                             this.database.addGroup(groupname, 0).then((result) => {
                        this.database.groupAdded = true;
                        this.navCtrl.pop();
                    }, (error) => {
                        console.log("ERROR: ", error);
                    });
                            console.log(error.status);
                            console.log(error.error); // error message as string
                            console.log(error.headers);
                        });
                }
            });

        }

    }

    getallGroups() {
        this.database.getAllgroups().then((result) => {
            //   this.groupList = <Array<Object>> result;
            //   this.groupListInitial = <Array<Object>> result;
        }, (error) => {
            console.log("ERROR: ", error);
        });
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
        let options = {
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
                let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            }
        }, (err) => {
            this.presentToast('Error while selecting image');
        });
    }
    // Create a new name for the image
    private createFileName() {
        let d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
        return newFileName;
    }
    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
        this.file.copyFile(namePath, currentName, this.database.storageDirectory, newFileName).then(success => {
            this.lastImage = newFileName;
            this.gotImage = true;
            console.log("this.lastImage", this.lastImage);
        }, error => {
            this.gotImage = false;

            this.presentToast('Error while storing image');
        });
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
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

    public uploadImage(id) {

        this.addImage = true;
        //http://182.71.233.135:92/api/login/updateProfilePicture?UserId=2&uploadDP=Test1.png
        // Destination URL
        let url = this.database.apiUrl+"Contact/uploadProfile?TypeId=3&UpdateId=" + id;

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
            console.log("Image uploaded successfully");
            this.updateGroupProPic("http://comp-view.com/SparkWorthy/UploadImages/Groups/"+filename,id);
            // this.download(filename,id);
        }, err => {
              this.loader.dismissAll();

            this.loading.dismissAll();
            this.presentToast('Error while uploading image');
        });
    }
  //   public download(name,id) {
  //
  //   return new Promise((resolve, reject) => {
  //     this.platform.ready().then(() => {
  //       // this.propicName = "user"+userid;
  //       let ProPicname = "group"+id;
  //
  //       let url = this.database.staticUrlGroup+name;
  //
  //       const fileTransfer: TransferObject = this.transfer.create();
  //       fileTransfer.download(url, this.database.storageDirectory +ProPicname+ ".jpg").then((entry) => {
  //
  //         this.updateGroupProPic(this.database.storageDirectory +ProPicname+ ".jpg",id);
  //         resolve();
  //       }, (error) => {
  //      this.loader.dismissAll();
  //
  //      this.navCtrl.pop();
  //
  //        this.loader.dismissAll();
  //         reject();
  //       });
  //     });
  //   });
  // }
    public updateGroupProPic(name,id)
  {

    this.database.updateGroupContactPictureBasedOnExt(name,id ).then((result) => {
                 
                            this.loader.dismissAll();

      this.navCtrl.pop();
    }, (error) => {
      this.loader.dismissAll();
      this.navCtrl.pop();
      console.log("ERROR: ", error);
    });
  }
    //END of image access and upload



}

