import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ActionSheetController, Platform, LoadingController, Loading } from 'ionic-angular';
import {  FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { AddInterestPage } from '../add-interest/add-interest';
import { InterestNewsPagePage } from '../interest-news-page/interest-news-page';
import {Autosize} from 'ionic2-autosize';
import { FormBuilder, Validators } from '@angular/forms';

import { Database } from '../../providers/database';
declare var Connection: any;
declare var navigator: any;
import { ImgcacheService } from '../../global/services/cache-img/cache-img.service';

//pages
import { InterestPagePage } from '../interest-page/interest-page';
import { InnerCirclePagePage } from '../inner-circle-page/inner-circle-page';
import { RemainderPagePage } from '../remainder-page/remainder-page';
import { Toast } from '@ionic-native/toast';

declare let cordova: any;

@Component({
  selector: 'page-edit-contact-page',
  templateUrl: 'edit-contact-page.html',
})

export class EditContactPagePage {
  private rate = 0;
  public image = true;
  public previousRate = 5;
  contactDetails: any;
  profileImageUpdated:boolean = false;
  lastImage: string = null;
  loading: Loading;
  imageStr : any;
  public loader;
  public onEdit:Boolean = false;
  public showAlertMessage:any;
  public push : boolean = false;
    addNewContact: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public params: NavParams,
              public database: Database,
              public alertCtrl: AlertController,
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform,
              public loadingCtrl: LoadingController,
              public http:HTTP,
              public file:File,
              public formBuilder: FormBuilder,
              public filepath : FilePath,
              public transfer : Transfer,
              public camera:Camera,
              public toast : Toast,
              public imgcache : ImgcacheService,
              private network: Network) {
    this.contactDetails = params.get("object");
    this.image = true;
    // this.imgcache.getimage("http://comp-view.com/SparkWorthy/UploadImages/Users/1491366893657.jpg");
    console.log("getimage exceutd");
    console.log("this.contactDetails", this.contactDetails.contactid);
  }
  ionViewDidLoad() {
    this.rate = this.contactDetails['favorites'];
  }
  ionViewWillLeave(){
    // this.database.editFav(this.rate,this.contactDetails['contactid']);
    console.log("view did leave excecuted");
  }
  ionViewCanLeave() {
    if(this.push == true)
    {
      return true;
    }else
    if(this.showAlertMessage) {

      let alertPopup = this.alertCtrl.create({
        title: 'Warning',
        message: 'All unsaved data will be lost',
        buttons: [{
          text: 'Exit',
          handler: () => {
            alertPopup.dismiss().then(() => {
              this.exitPage();
            });
          }
        },
          {
            text: 'Stay',
            handler: () => {
              // need to do something if the user stays?
            }
          }]
      });

      // Show the alert
      alertPopup.present();

      // Return false to avoid the page to be popped up
      return false;
    }
  }
  private exitPage() {
    this.showAlertMessage = false;

      this.navCtrl.pop();

  }
  public openMyTrend()
  {
    this.navCtrl.push(InterestNewsPagePage , { object: this.contactDetails });
  }
  addFav() {
    if (this.previousRate === 1 && this.rate === 1) {
      this.rate = 0;
      this.previousRate = this.rate;
    }
    switch (this.rate) {
      case 1:
        this.previousRate = this.rate;
        break;
    }
  }
  openInterest() {
    this.push = true;
    this.navCtrl.push(AddInterestPage, { object: this.contactDetails });
  }
  openInnerCirlce() {
    this.push = true;

    if (this.contactDetails['lastname'] == null)
    {
      this.contactDetails['lastname'] == "";
    }
    this.navCtrl.push(InnerCirclePagePage, { object: this.contactDetails, name: this.contactDetails['firstname'] + " " + this.contactDetails['lastname'] });
  }
  openRemainders() {
    this.push = true;

    this.navCtrl.push(RemainderPagePage, { object: this.contactDetails });
  }
    saveEditedContact() {
        this.database.load = true;
        this.http.get("", {}, {})
            .then(datafrmapi => {
            });
        let firstname : String = this.contactDetails['firstname'];
        let lastname : String= this.contactDetails['lastname'];
        let email : String= this.contactDetails['email'];
        let phonenumber: String = this.contactDetails['phonenumber'];
        let officenumber: String = this.contactDetails['officenumber'];
        let position : String= this.contactDetails['position'] ;
        let company : String= this.contactDetails['company'];
        let contactid : String= this.contactDetails['contactid'];
        let birthday : String = this.contactDetails['birthday'];
        let relationship : String = this.contactDetails['relationship'];
        let notes : String = this.contactDetails['notes'];
        let contactidext : String  = this.contactDetails['contactidext'];
        let profession : String = this.contactDetails['profession'];
        let anniversary : String  = this.contactDetails['anniversary'];
        let location : String  = this.contactDetails['location'];

        if(String(phonenumber).match(/.*[0-9].*/)){
            console.log("machted");

        }else
        {
            console.log("not machted");
        }
        // let profilepic : String = this.contactDetails['profilepic']
        // if (profilepic == null || profilepic == "")
        // {
        //   profilepic = "";
        // }
        if(lastname == null || lastname == "")
        {
            lastname = "";
        }
        if(email == null || email == "")
        {
            email = "";
        }
        if(phonenumber == null || phonenumber == "" || phonenumber == " ")
        {
            phonenumber = "";
        }
        if(officenumber == null || officenumber == "")
        {
            officenumber = "";
        }
        if(position == null || position == "")
        {
            position = "";
        }
        if(company == null || company == "")
        {
            company = "";
        }
        if(birthday == null || birthday == "")
        {
            birthday = "";
        }
        if(relationship == null || relationship == "")
        {
            relationship = "";
        }
        if(notes == null || notes == "")
        {
            notes = "";
        }
        if(profession == null || profession == "")
        {
            profession = "";
        }
        if(anniversary == null || anniversary == "")
        {
            anniversary = "";
        }
        if(location == null || location == "")
        {
            location = "";
        }

        firstname = firstname.trim();
        if(firstname == "" || firstname == null  || firstname == " ")
        {
            let alert = this.alertCtrl.create({
                title: "Please enter a first name",
                // subTitle: "",
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

        }else
        if(company == "" || company == null || company == " ")
        {
            let alert = this.alertCtrl.create({
                title: "Please enter a company",
                // subTitle: "",
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

        }else {
            console.log("Phone number : " + JSON.stringify(phonenumber));
            if (phonenumber != "" ) {
                console.log("inside !="+phonenumber);
                if (String(phonenumber).match(/^[0-9]*$/))
                {
                    this.showAlertMessage = false;
                    this.onEdit = false;


                    this.platform.ready().then(() => {
                        let networkState = this.network.type;
                        if (networkState === Connection.NONE) {
                            this.database.editContact(email, phonenumber, officenumber, position, company, contactid, this.rate, birthday, relationship, notes, firstname, lastname, profession, anniversary, location).then((result) => {
                            }, (error) => {
                                console.log("ERROR: ", error);
                            });
                        }
                        else {
                            let bool;
                            bool = this.rate > 0;

                            let req = this.database.apiUrl + "Contact/Save?ContactId=" + contactidext + "&UserId=" + this.database.userIdFromDB +
                                "&FirstName=" + firstname + "&LastName=" + lastname + "&EMail=" + email + "&PhNo=" + phonenumber + "&OfficeNo=" + officenumber + "&Position=" + position + "&Company=" + company + "&Relative=" + relationship + "&Profilepic=&DOB=" + birthday + "&Fav=" + bool +
                                "&FavRating=" + this.rate + "&Notes=" + notes + "&ModifyOn=" + "01-01-2017" + "&Profession=" + profession + "&AnnivasaryOn=" + anniversary + "&Location=" + location;

                            let url = encodeURI(req);

                            // console.log(this.database.apiUrl + "Contact/Save?ContactId="+contactidext+"&UserId="+this.database.userIdFromDB+
                            //     "&FirstName="+firstnamenew+"&LastName="+lastnamenew+"&EMail="+emailnew+"&PhNo="+phonenumbernew+"&OfficeNo="+officenumbernew+"&Position="+positionnew+"&Company="+companynew+"&Relative="+relationshipnew+"&Profilepic=test.pic&DOB="+birthday+"&Fav="+bool+
                            //     "&FavRating="+this.rate+"&Notes="+notesnew+"&ModifyOn="+"01-01-2017"+"&Profession="+professionnew+"&AnnivasaryOn="+anniversary);


                            // this.http.get(this.database.apiUrl + "Contact/Save?ContactId="+contactidext+"&UserId="+this.database.userIdFromDB+
                            //     "&FirstName="+firstname+"&LastName="+lastname+
                            //     "&EMail="+email+"&PhNo="+phonenumber+"&OfficeNo="+officenumber+"&Position="+position+
                            //     "&Company="+company+"&Relative="+relationship+"&Profilepic=test.pic&DOB="+birthday+"&Fav="+bool+
                            //     "&FavRating="+this.rate+"&Notes="+notes+"&ModifyOn="+"01-01-2017"+"&Profession="+profession+"&AnnivasaryOn="+anniversary, {}, {})
                            // this.http.get(this.database.apiUrl + "Contact/Save?ContactId="+contactidext+"&UserId="+this.database.userIdFromDB+
                            //     "&FirstName="+firstnamenew+"&LastName="+lastnamenew+
                            //     "&EMail="+emailnew+"&PhNo="+phonenumbernew+"&OfficeNo="+officenumbernew+"&Position="+positionnew+
                            //     "&Company="+companynew+"&Relative="+relationshipnew+"&Profilepic=test.pic&DOB="+birthday+"&Fav="+bool+
                            //     "&FavRating="+this.rate+"&Notes="+notesnew+"&ModifyOn="+"01-01-2017"+"&Profession="+professionnew+"&AnnivasaryOn="+anniversary, {}, {})


                            console.log(url);
                            this.http.get(url, {}, {})
                                .then(datafrmapi => {
                                    console.log("Contact edited through api");
                                    console.log("Result from server", datafrmapi);
                                    this.database.editContactOnline(email, phonenumber, officenumber, position, company, contactid, this.rate, birthday, relationship, notes, firstname, lastname, profession, anniversary, location).then((result) => {
                                    }, (error) => {
                                        console.log("ERROR: ", error);
                                    });
                                })
                                .catch(error => {
                                    this.database.editContact(email, phonenumber, officenumber, position, company, contactid, this.rate, birthday, relationship, notes, firstname, lastname, profession, anniversary, location).then((result) => {
                                    }, (error) => {
                                        console.log("ERROR: ", error);
                                    });
                                    console.log(error.status);
                                    console.log(error.error); // error message as string
                                    console.log(error.headers);
                                });
                        }
                    });
                    this.toast.show("Contact updated successfully", '5000', 'center').subscribe(
                        toast => {
                            console.log(toast);
                        });
                }

                else
                {
                    let alert = this.alertCtrl.create({
                        title: "Please enter numbers only",
                        // subTitle: "",
                        buttons: [
                            {
                                text: 'Ok',
                                handler: data => {
                                    //this.navCtrl.pop();
                                }
                            }
                        ]
                    });
                    alert.present()
                }
            } else {
                this.showAlertMessage = false;
                this.onEdit = false;


                this.platform.ready().then(() => {
                    let networkState = this.network.type;
                    if (networkState === Connection.NONE) {
                        this.database.editContact(email, phonenumber, officenumber, position, company, contactid, this.rate, birthday, relationship, notes, firstname, lastname, profession, anniversary, location).then((result) => {
                        }, (error) => {
                            console.log("ERROR: ", error);
                        });
                    }
                    else {
                        let bool;
                        bool = this.rate > 0;

                        let req = this.database.apiUrl + "Contact/Save?ContactId=" + contactidext + "&UserId=" + this.database.userIdFromDB +
                            "&FirstName=" + firstname + "&LastName=" + lastname + "&EMail=" + email + "&PhNo=" + phonenumber + "&OfficeNo=" + officenumber + "&Position=" + position + "&Company=" + company + "&Relative=" + relationship + "&Profilepic=&DOB=" + birthday + "&Fav=" + bool +
                            "&FavRating=" + this.rate + "&Notes=" + notes + "&ModifyOn=" + "01-01-2017" + "&Profession=" + profession + "&AnnivasaryOn=" + anniversary + "&Location=" + location;

                        let url = encodeURI(req);

                        // console.log(this.database.apiUrl + "Contact/Save?ContactId="+contactidext+"&UserId="+this.database.userIdFromDB+
                        //     "&FirstName="+firstnamenew+"&LastName="+lastnamenew+"&EMail="+emailnew+"&PhNo="+phonenumbernew+"&OfficeNo="+officenumbernew+"&Position="+positionnew+"&Company="+companynew+"&Relative="+relationshipnew+"&Profilepic=test.pic&DOB="+birthday+"&Fav="+bool+
                        //     "&FavRating="+this.rate+"&Notes="+notesnew+"&ModifyOn="+"01-01-2017"+"&Profession="+professionnew+"&AnnivasaryOn="+anniversary);


                        // this.http.get(this.database.apiUrl + "Contact/Save?ContactId="+contactidext+"&UserId="+this.database.userIdFromDB+
                        //     "&FirstName="+firstname+"&LastName="+lastname+
                        //     "&EMail="+email+"&PhNo="+phonenumber+"&OfficeNo="+officenumber+"&Position="+position+
                        //     "&Company="+company+"&Relative="+relationship+"&Profilepic=test.pic&DOB="+birthday+"&Fav="+bool+
                        //     "&FavRating="+this.rate+"&Notes="+notes+"&ModifyOn="+"01-01-2017"+"&Profession="+profession+"&AnnivasaryOn="+anniversary, {}, {})
                        // this.http.get(this.database.apiUrl + "Contact/Save?ContactId="+contactidext+"&UserId="+this.database.userIdFromDB+
                        //     "&FirstName="+firstnamenew+"&LastName="+lastnamenew+
                        //     "&EMail="+emailnew+"&PhNo="+phonenumbernew+"&OfficeNo="+officenumbernew+"&Position="+positionnew+
                        //     "&Company="+companynew+"&Relative="+relationshipnew+"&Profilepic=test.pic&DOB="+birthday+"&Fav="+bool+
                        //     "&FavRating="+this.rate+"&Notes="+notesnew+"&ModifyOn="+"01-01-2017"+"&Profession="+professionnew+"&AnnivasaryOn="+anniversary, {}, {})


                        console.log(url);
                        this.http.get(url, {}, {})
                            .then(datafrmapi => {
                                console.log("Contact edited through api");
                                console.log("Result from server", datafrmapi);
                                this.database.editContactOnline(email, phonenumber, officenumber, position, company, contactid, this.rate, birthday, relationship, notes, firstname, lastname, profession, anniversary, location).then((result) => {
                                }, (error) => {
                                    console.log("ERROR: ", error);
                                });
                            })
                            .catch(error => {
                                this.database.editContact(email, phonenumber, officenumber, position, company, contactid, this.rate, birthday, relationship, notes, firstname, lastname, profession, anniversary, location).then((result) => {
                                }, (error) => {
                                    console.log("ERROR: ", error);
                                });
                                console.log(error.status);
                                console.log(error.error); // error message as string
                                console.log(error.headers);
                            });
                    }
                });
                this.toast.show("Contact updated successfully", '5000', 'center').subscribe(
                    toast => {
                        console.log(toast);
                    });
            }
        }
    }

  // statring of image access and upload
  //testing image upload action sheet
  public presentActionSheet() {
    //http://comp-view.com/SparkWorthy/UploadImages/Contacts/1491366893657.jpg

    // this.imgcache.getimage("http://comp-view.com/SparkWorthy/UploadImages/Users/1491366893657.jpg");

    // if (this.onEdit == false)
    // {
    //   this.toast.show("Click on the edit icon to change the profile picture", '5000', 'bottom').subscribe(
    //       toast => {
    //         console.log(toast);
    //       });
    // }else {

      var networkState = this.network.type;
      if (networkState === Connection.NONE) {
        let alert = this.alertCtrl.create({
          title: "No internet connection",
          subTitle: "You cannot change profile picture without active internet connection.",
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
  }
  public setNoneAsPic()
  {
    this.database.load = true;

    this.image = false;
      this.lastImage = "assets/Images/profile.jpg";
      
      this.updateContactProPic("assets/Images/profile.jpg");
  }
  //testing take pic from gallary and cameraOptions
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    let options = {
      quality: 50,
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
            this.copyFileToLocalDir(correctPath, currentName,this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        console.log("Correct path new" +correctPath );
        console.log("Correct path storage dir" +this.database.storageDirectory );

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
    console.log("newFileName"+newFileName);
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    });
    this.database.load = true;

    loader.present();

              console.log("Directory"+this.database.storageDirectory);
                  this.file.copyFile(namePath, currentName, this.database.storageDirectory, newFileName).then(success => {
                    this.lastImage = "";
                  this.lastImage = newFileName;
                  console.log("cordova.file.dataDirectory+newFileName", this.database.storageDirectory+newFileName);
                  // this.updateContactProPic(this.database.storageDirectory+newFileName);
                  loader.dismissAll();
                    this.uploadImage(this.database.storageDirectory);
              }, error => {
               loader.dismissAll();

                this.presentToast('Error while storing file');
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

  public uploadImage(str) {
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    this.platform.ready().then(() => {
      var networkState = this.network.type;
      if (networkState === Connection.NONE) {
        let alert = this.alertCtrl.create({
          title: "No internet connection",
          subTitle: "You cannot change profile picture without active internet connection.",
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

        // Destination URL
        // let url = "http://localhost:4562/api/"+"Contact/uploadProfile?TypeId=2&UpdateId=" +this.contactDetails.contactidext;

        let url = this.database.apiUrl+"Contact/uploadProfile?TypeId=2&UpdateId=" +this.contactDetails.contactidext;
        // http://localhost:4562/api/Contact/uploadProfile?TypeId=2&UpdateId=66
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

        console.log("Target path"+targetPath);
        console.log("URL"+url);
        console.log("Options"+options);
        // Use the FileTransfer to upload the image
        fileTransfer.upload(targetPath, url, options).then(data => {
          this.loader.dismissAll();

          this.presentToast('Image uploaded successfully');
          //TODO:Once uploaded update the data
          this.profileImageUpdated = true;
          this.imageStr = targetPath;
          // http://182.71.233.135:92/UploadImages/Contacts/1493634862469.jpg
          // TODO:change when new url is ready
              this.updateContactProPic("http://comp-view.com/SparkWorthy/UploadImages/Contacts/"+filename);
          // this.updateContactProPicHttp(filename);
          // this.updateContactProPic("http://comp-view.com/SparkWorthy/UploadImages/Contacts/"+filename);

          console.log("http://comp-view.com/SparkWorthy/UploadImages/Contacts/"+filename);
        }, err => {
          this.loader.dismissAll();
          console.log(err);
          this.presentToast('Error while uploading image');
        });
      }
    });
  }
  //END of image access and upload
  //
  // public download(name,userid) {
  //   return new Promise((resolve, reject) => {
  //     this.platform.ready().then(() => {
  //       // this.propicName = "user"+userid;
  //
  //        this.ProPicname = "contact"+this.contactDetails.contactidext;
  //       let url = this.database.staticUrlContact+name;
  //       const fileTransfer: TransferObject = this.transfer.create();
  //       console.log(JSON.stringify("File directory Check"));
  //
  //       this.file.checkFile(this.database.storageDirectory,this.ProPicname+".jpg").then((res)=>{
  //         console.log(JSON.stringify("File directory exist"+res));
  //           this.file.removeFile(this.database.storageDirectory,this.ProPicname+".jpg");
  //       },(err)=>{
  //         console.log(JSON.stringify("File directory not exist"+err));
  //       });
  //       fileTransfer.download(url, this.database.storageDirectory +this.ProPicname+".jpg").then((entry) => {
  //         this.updateContactProPic(this.database.storageDirectory +this.ProPicname+".jpg");
  //         resolve();
  //       }, (error) => {
  //         this.loader.dismissAll();
  //         reject();
  //       });
  //     });
  //   });
  // }
  public updateContactProPicHttp(profilepic)
  {
    console.log("profilepic"+profilepic);
    let firstname : String = this.contactDetails['firstname'];
    let lastname : String= this.contactDetails['lastname'];
    let email : String= this.contactDetails['email'];
    let phonenumber: String = this.contactDetails['phonenumber'];
    let officenumber: String = this.contactDetails['officenumber'];
    let position : String= this.contactDetails['position'] ;
    let company : String= this.contactDetails['company'];
    let contactid : String= this.contactDetails['contactid'];
    let birthday : String = this.contactDetails['birthday'];
    let relationship : String = this.contactDetails['relationship'];
    let notes : String = this.contactDetails['notes'];
    let contactidext : String  = this.contactDetails['contactidext'];
    let profession : String = this.contactDetails['profession'];
    let anniversary : String  = this.contactDetails['anniversary'];
    let bool;
    if(lastname == null || lastname == "")
    {
      lastname = "";
    }
    if(email == null || email == "")
    {
      email = "";
    }
    if(officenumber == null || officenumber == "")
    {
      officenumber = "";
    }
    if(position == null || position == "")
    {
      position = "";
    }
    if(company == null || company == "")
    {
      company = "";
    }
    if(birthday == null || birthday == "")
    {
      birthday = "";
    }
    if(relationship == null || relationship == "")
    {
      relationship = "";
    }
    if(notes == null || notes == "")
    {
      notes = "";
    }
    if(profession == null || profession == "")
    {
      profession = "";
    }
    if(anniversary == null || anniversary == "")
    {
      anniversary = "";
    }
    bool = this.rate > 0;

    let req = this.database.apiUrl + "Contact/Save?ContactId=" + contactidext + "&UserId=" + this.database.userIdFromDB +
        "&FirstName=" + firstname + "&LastName=" + lastname + "&EMail=" + email + "&PhNo=" + phonenumber + "&OfficeNo=" + officenumber + "&Position=" + position + "&Company=" + company + "&Relative=" + relationship + "&Profilepic="+profilepic+"&DOB=" + birthday + "&Fav=" + bool +
        "&FavRating=" + this.rate + "&Notes=" + notes + "&ModifyOn=" + "01-01-2017" + "&Profession=" + profession + "&AnnivasaryOn=" + anniversary;

    let url = encodeURI(req);

    console.log(url);
    this.http.get(url, {}, {})
        .then(datafrmapi => {
          if(this.database.development == true)
          {
            let alert1 = this.alertCtrl.create({
              title: "Contact edited through api.",
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
          console.log("profile edited through api");
        })
        .catch(error => {

          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });

  }
  public updateContactProPic(url)
  {
    this.database.updateProfilePic(url,this.contactDetails['contactid'] ).then((result) => {
      console.log("updateContactProPic"+result);
      //for ios
      this.navCtrl.pop();
      this.loader.dismissAll();
    }, (error) => {
      //for ios
      this.navCtrl.pop();

      console.log("ERROR: ", error);
    });
  }
  public changeToEditView()
  {
    this.onEdit = true;
    this.showAlertMessage = true;
  }
  loaded()
  {
    console.log("loaded");
  }
}
