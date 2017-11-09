import { Component } from '@angular/core';
import { NavController,AlertController, NavParams } from 'ionic-angular';
import { Contacts} from '@ionic-native/contacts';
import { Database } from '../../providers/database';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { HTTP } from '@ionic-native/http';

//pages
import { HomeTabPage } from '../home-tab/home-tab';


@Component({
  selector: 'page-add-account-page',
  templateUrl: 'add-account-page.html'
})
export class AddAccountPagePage {

  public checked:any;
  public bool:any = true;
  public check:any = false;
  value:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
      public database: Database, 
      public loading: LoadingController,
      public contacts :Contacts,private geolocation: Geolocation,
      public diagnostic : Diagnostic,public alertCtrl: AlertController,
      public http:HTTP) {
      this.database.load = true;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAccountPagePage');
  }
  skipBtn() {
    // this.database.getInterestForContactFrmApi();

      this.navCtrl.setRoot(HomeTabPage);
  }
  syncBtnAction() {
    console.log("Contacts");

    let loader = this.loading.create({
      content: 'Syncing Your Contacts...',
    });
    loader.present();

    let fields;
    fields = ['*'];
    let people = [];
    console.log("Going to sync");
    //sync mobile contact to app
    this.contacts.find(fields).then((contacts) => {
      for (let i = 0; i < contacts.length; i++) {

          console.log(contacts[i]);
          let bb : String = String(contacts[i].displayName);
          let firstName = bb.split(' ').slice(0, -1).join(' ');
          let lastName = bb.split(' ').slice(-1).join(' ');
          console.log(firstName);
          console.log(lastName);
            if(firstName == null || firstName =="")
            {
                firstName="";
            }
          if(lastName == null || lastName =="")
          {
              lastName="";
          }
          if(contacts[i].phoneNumbers == null)
        {
          console.log("null contacts")

        }else
        {
          if(contacts[i].emails == null)
          {
            people.push({
              firstname: firstName,
                lastname: lastName,
              email: "" ,
              phonenumber: contacts[i].phoneNumbers[0].value,
            });
          }else
          {
            people.push({
                firstname: firstName,
                lastname: lastName,
                  email: contacts[i].emails[0].value ,
                  phonenumber: contacts[i].phoneNumbers[0].value,
                });
          }
        }

      }
      if(people.length == 0)
      {
        console.log("0 Phone contacts");
        loader.dismissAll();
        this.navCtrl.setRoot(HomeTabPage);
      }
      console.log("Phone contacts length",people.length);
      for (let i = 0; i < people.length; i++) {
        if(people[i].phonenumber == null)
        {
          people[i].phonenumber = "";
        }
        if(people[i].email == null)
        {
          people[i].email = "";
        }
          let num = String(people[i].phonenumber);
          num = num.replace(/[^0-9]/g, '');
          let extractNumber;
          if(num.length >10)
          {
              extractNumber   = num.slice(-10);

          }else
          {
              extractNumber   = num;
          }
          this.database.checkWhetherContactExistSync(extractNumber,people[i].firstname,people[i].lastname).then((result)=>{

              if (i == people.length - 1) {
                  loader.dismissAll();
                  this.navCtrl.setRoot(HomeTabPage);
              }

          },(errorAcc)=>{
              this.database.checkWhetherContactExistAcc(extractNumber,people[i].firstname,people[i].lastname).then((result) => {
                      console.log("contact exist");
                      console.log(i);
                      console.log(people.length);
                      if (i === people.length - 1) {
                          loader.dismissAll();
                          this.navCtrl.setRoot(HomeTabPage);
                      }
                  },
                  (error) => {
                      console.log("contact not exist");


                      let url = this.database.apiUrl + "Contact/Save?ContactId=0&UserId=" + this.database.userIdFromDB +
                          "&FirstName=" + people[i].firstname + "&LastName="+people[i].lastname+"&EMail=&PhNo=" + extractNumber + "&OfficeNo=&Position=&Company=&Relative=&Profilepic=&DOB=&Fav=false&FavRating=0&Notes=&ModifyOn=01-01-2017&Profession=&AnnivasaryOn=&Location=";
                      let encodedUrl = encodeURI(url);
                      console.log(encodedUrl);
                      this.http.get(encodedUrl, {}, {})
                          .then(datafrmapi => {
                              console.log("Contact addded through http api");
                              let aa = JSON.parse(datafrmapi.data);
                              this.database.addContactFrmDeviceOnline(aa, people[i].firstname, people[i].lastname,people[i].email, extractNumber,
                                  people[i].company, people[i].birthdayon, people[i].note).then((result) => {

                                  if (i === people.length - 1) {
                                      console.log("Sync finished");
                                      loader.dismissAll();
                                      this.navCtrl.setRoot(HomeTabPage);
                                  }
                              }, (error) => {
                                  if (i === people.length - 1) {
                                      loader.dismissAll();
                                      this.navCtrl.setRoot(HomeTabPage);
                                  }
                              });
                          },(err)=>{
                              console.log(err);
                          }).catch((error) => {
                          console.log("add conatct error" + error.error);
                          this.database.addContactFrmDevice(people[i].firstname,people[i].lastname, people[i].email, people[i].phonenumber,
                              people[i].company, people[i].birthdayon, people[i].note).then((result) => {

                              if (i === people.length - 1) {
                                  loader.dismissAll();
                                  this.navCtrl.setRoot(HomeTabPage);

                              }
                          }, (error) => {
                              if (i === people.length - 1) {
                                  loader.dismissAll();
                                  this.navCtrl.setRoot(HomeTabPage);
                              }
                          });
                      });
                  });
          });

      }
    },(error)=>{
      console.log("Error in accessing contacts");
      console.log(error);
    });
  }
  selected()
  {
    // this.database.getInterestForContactFrmApi();

      console.log("selected");
    if(this.value == true)
    {
      this.bool = false;
    }
    else if(this.value == false)
    {
      this.bool = true;
    }
  }
}
