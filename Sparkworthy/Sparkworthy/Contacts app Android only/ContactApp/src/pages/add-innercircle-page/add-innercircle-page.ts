import { Component } from '@angular/core';
import { NavController, NavParams,Platform,AlertController,LoadingController } from 'ionic-angular';
import { Database } from '../../providers/database';
import { HTTP } from '@ionic-native/http';
declare let Connection: any;
declare let navigator: any;
import { Network } from '@ionic-native/network';

import { Toast } from '@ionic-native/toast';

@Component({
  selector: 'page-add-innercircle-page',
  templateUrl: 'add-innercircle-page.html'
})
export class AddInnercirclePagePage {

  public contactDetails=[];
  public innerCircleInfo=[];
  public from;
  public onEdit:Boolean;
  public showAlertMessage :boolean;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public database : Database,
              public platform:Platform,
              public alertCtrl : AlertController,
              public http:HTTP,
              public toast : Toast,
              private network: Network,
              public loadingCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInnercirclePagePage');
  }
  ionViewCanLeave() {
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
  ionViewWillEnter()
  {
    this.from = this.navParams.get("from");
    switch(this.from)
    {
      case "Add Inner circle":
        this.innerCircleInfo = [];
        this.onEdit = true;
        this.contactDetails = this.navParams.get("object");
        break;
      case "Edit Inner circle":
        this.contactDetails = [];
        this.onEdit = false;
        this.innerCircleInfo = this.navParams.get("object");
        this.contactDetails = this.navParams.get("contact");

        break;
    }
  }
  public addInnerCircle()
  {
    switch(this.from)
  {
    case "Add Inner circle":
      this.addInnerCrle();
      break;
    case "Edit Inner circle":
      this.editInner();
      break;
  }
  }
  public addInnerCrle()
  {
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    this.platform.ready().then(() => {
      this.innerCircleInfo['firstname'] = this.innerCircleInfo['firstname'];
      this.innerCircleInfo['relationship'] = this.innerCircleInfo['relationship'];
      if (this.innerCircleInfo['firstname'] == null || this.innerCircleInfo['firstname'] == " " || this.innerCircleInfo['firstname'] == "" || this.innerCircleInfo['firstname'].trim() == "")
      {
          let alert = this.alertCtrl.create({
          title: "Please enter first name",
          // subTitle:"Please enter firstname",
          buttons: [
            {
              text: 'Ok',
              handler: data => {
              }
            }
          ]
        });
        alert.present();
      }else if(this.innerCircleInfo['relationship'] == null || this.innerCircleInfo['relationship'] == "" || this.innerCircleInfo['relationship'] == " ")
      {
         let alert = this.alertCtrl.create({
          title: "Please enter your relationship",
          // subTitle:"Please enter firstname",
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
      else
      {

        let contactid : String = this.contactDetails['contactid'];
        let contactidext : String = this.contactDetails['contactidext'];

        let firstname : String = this.innerCircleInfo['firstname'];
        let lastname : String = this.innerCircleInfo['lastname'];
        let birthday : String = this.innerCircleInfo['birthday'];
        let profession : String = this.innerCircleInfo['profession'];
        let relationship :String = this.innerCircleInfo['relationship'];
        let anniversary : String = this.innerCircleInfo['anniversary'];
        let notes : String = this.innerCircleInfo['notes'];
        // let company : String = this.innerCircleInfo['company'];
        let company : String = " ";

        if (lastname == null){
          lastname = "";
        }

        if(birthday == null)
        {
          birthday = "";
        }
        if(profession == null)
        {
          profession = "";
        }
        if(relationship == null)
        {
          relationship = "";
        }
        if(anniversary == null)
        {
          anniversary = "";
        }
        if(notes == null)
        {
          notes = "";
        }
        // if(company == null)
        // {
        //   company ="";
        // }
        console.log(this.innerCircleInfo['birthday']);
        console.log(this.innerCircleInfo['profession']);
        console.log(this.innerCircleInfo['notes']);
        console.log(this.innerCircleInfo['relationship']);
        console.log(this.innerCircleInfo['anniversary']);
        let loader = this.loadingCtrl.create({
          content: 'Loading...',
        });
        loader.present();

        let networkState = this.network.type;
      if (networkState === Connection.NONE) {
        this.database.addInnerCircle(contactid,firstname,lastname,
            birthday,profession,relationship,
            anniversary,
            notes,company).then((data)=>{
          console.log("OFFLINE:Inner cirlce added");
          loader.dismissAll();
          this.navCtrl.pop();
        },(error)=>{
        });
      }
      else {
        let url = this.database.apiUrl+"innercircle/saveContact?InnerCircleId=0&ContactId="
            +contactidext+"&FName="+firstname
            +"&LName="+lastname+"&Profession="+profession
            +"&Relation="+relationship+"&Notes="+notes
            +"&DOB="+birthday+"&Annivasary="+anniversary;
        let encodedUrl = encodeURI(url);
        console.log(encodedUrl);
        this.http.get(encodedUrl, {}, {})
          .then(datafrmapi => {
              let data  = JSON.parse(datafrmapi.data);
            console.log("Result from server",data);
            if(this.database.development == true)
            {
              let alert1 = this.alertCtrl.create({
                title: "inner cirlce added through api.",
                subTitle:"Result returned :"+data,
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
            console.log("Inner circle added through http api");

            this.database.addInnerCircleWhenOnline(contactid,data,firstname,lastname,
            birthday,profession,relationship,
            anniversary,
            notes,company).then((data)=>{
                  loader.dismissAll();
                 this.navCtrl.pop();
        },(error)=>{
              loader.dismissAll();

            });

          })
          .catch(error => {
          this.database.addInnerCircle(contactid,firstname,lastname,
              birthday,profession,relationship,
              anniversary,
              notes,company).then((data)=>{
            console.log("OFFLINE:Inner cirlce added");
            loader.dismissAll();

            this.navCtrl.pop();
                  },(error)=>{
            loader.dismissAll();

          });
            console.log(error.status);
            console.log(error.error); // error message as string
            console.log(error.headers);
          });

       
      }

      }
    });
  }
  public editInner()
  {
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    this.platform.ready().then(() => {
      this.innerCircleInfo['firstname'] = this.innerCircleInfo['firstname'].trim();
      this.innerCircleInfo['relationship'] = this.innerCircleInfo['relationship'].trim();

      if (this.innerCircleInfo['firstname'] == null || this.innerCircleInfo['firstname'] == " " || this.innerCircleInfo['firstname'] == "" )
      {
          let alert = this.alertCtrl.create({
          title: "Please enter firstname",
          // subTitle:"Please enter firstname",
          buttons: [
            {
              text: 'Ok',
              handler: data => {
              }
            }
          ]
        });
        alert.present();
      }else if(this.innerCircleInfo['relationship'] == null || this.innerCircleInfo['relationship'] == "" || this.innerCircleInfo['relationship'] == " ")
      {
         let alert = this.alertCtrl.create({
          title: "Please enter your relationship",
          // subTitle:"Please enter firstname",
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
      else
      {
        let contactid : String = this.contactDetails['contactid'];
        let contactidext : String = this.contactDetails['contactidext'];

        let firstname : String = this.innerCircleInfo['firstname'];
        let lastname : String = this.innerCircleInfo['lastname'];
        let birthday : String = this.innerCircleInfo['birthday'];
        let profession : String = this.innerCircleInfo['profession'];
        let relationship :String = this.innerCircleInfo['relationship'];
        let anniversary : String = this.innerCircleInfo['anniversary'];
        let notes : String = this.innerCircleInfo['notes'];
        let innercircleid : String = this.innerCircleInfo['id'];
        let innercircleidExt : String = this.innerCircleInfo['InnerCircleIdExt'];

        if (lastname == null){
          lastname = "";
        }

        if(birthday == null)
        {
          birthday = "";
        }
        if(profession == null)
        {
          profession = "";
        }
        if(relationship == null)
        {
          relationship = "";
        }
        if(anniversary == null)
        {
          anniversary = "";
        }
        if(notes == null)
        {
          notes = "";
        }
        let networkState = this.network.type;
        this.showAlertMessage = false;

        this.onEdit = false;
        if (networkState === Connection.NONE) {
        this.database.editInnerCircleInfo(firstname,lastname,
            birthday,profession,relationship,
            anniversary,
            notes,innercircleid).then((data)=>{
              console.log("OFFLINE:Inner circle edited");

          this.toast.show("Inner circle updated successfully", '5000', 'center').subscribe(
              toast => {
                console.log(toast);
              });
          //this.navCtrl.pop();
        },(error)=>{
        });
      }
      else {

        let url = this.database.apiUrl+"innercircle/saveContact?InnerCircleId="+innercircleidExt+"&ContactId="
            +contactidext+"&FName="+firstname
            +"&LName="+lastname+"&Profession="+profession
            +"&Relation="+relationship+"&Notes="+notes
            +"&DOB="+birthday+"&Annivasary="+anniversary;
        let encodedUrl = encodeURI(url);
        console.log(encodedUrl);
          this.http.get(encodedUrl, {}, {})
          .then(datafrmapi => {
            console.log("Result from server",datafrmapi);
            if(this.database.development == true)
            {
              let alert1 = this.alertCtrl.create({
                title: "inner cirlce edited through api.",
                subTitle:"Result returned :"+datafrmapi,
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
            this.database.editInnerCircleInfoOnline(firstname,lastname,
                birthday,profession,relationship,
                anniversary,
                notes,innercircleid).then((data)=>{
              console.log("Inner circle edited through http api");
              this.toast.show("Inner circle updated successfully", '5000', 'center').subscribe(
                  toast => {
                    console.log(toast);
                  });
              //this.navCtrl.pop();
            },(error)=>{
            });
          })
          .catch(error => {
            this.database.editInnerCircleInfo(firstname,lastname,
                birthday,profession,relationship,
                anniversary,
                notes,innercircleid).then((data)=>{
              console.log("OFFLINE:Inner circle edited");

              this.toast.show("Inner circle updated successfully", '5000', 'center').subscribe(
                  toast => {
                    console.log(toast);
                  });
              //this.navCtrl.pop();
            },(error)=>{
            });
            console.log(error.status);
            console.log("Innercirlce"+error.error); // error message as string
            console.log(error.headers);
          });
        }
      }
    });
  }
  changeToEditView()
  {
    this.showAlertMessage = true;
    this.onEdit = true;
  }
}
