import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController,ModalController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Network } from '@ionic-native/network';

//database
import { Database } from '../../providers/database';
import { ValidationService } from '../../app/validation.service';
import { AddInterestPage } from '../add-interest/add-interest'
declare var Connection: any;
declare var navigator: any;

@Component({
  selector: 'page-create-account-page',
  templateUrl: 'create-account-page.html'
})
export class CreateAccountPagePage {

  user = {};
  isConnectedToNet: Boolean;
  createUserAccount: any;
  emailErrorMsg : any;
  confirmPasswordErrorMsg : any;
  emailTaken:Boolean = true;
  public email;
  public emailexist:boolean = false;
  getInterest: any;
  userid: any;
  public pass:any = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public alertCtrl: AlertController,
              public database: Database,
              public loading: LoadingController,
              public formBuilder: FormBuilder,
              public http : HTTP,
              public modalCtrl:ModalController,
              private network: Network) {
    this.getInterestValue();
    this.emailTaken = true;
    console.log("this.userid", this.userid);
    //Create account validation
    this.createUserAccount = this.formBuilder.group({
      "name": ["", [Validators.required,Validators.maxLength(200)]],
      "phonenumber": ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      "email": ["", [Validators.required, this.check,Validators.maxLength(200)]],
      "password": ["", [Validators.required,Validators.maxLength(200)]],
      "conPassword": ["",[Validators.required,Validators.maxLength(200)]],
      "company": ["", [Validators.maxLength(200)]],
      "websitelink": ["", [Validators.maxLength(8000)]],
      "position": ["", [Validators.maxLength(100)]],
      "country": [""],
      "city": [""],
      "state": [""],
      "zipcode": [""],
      "dob": ["",[Validators.required]],
      "interest": ["",]
    });
    this.createUserAccount.value.password = "";
    console.log("this.createUserAccount", this.createUserAccount);
  }
  getPass(control)
  {
    if(control.value == null || control.value == "")
    {

    }else
    {
      this.pass = control.value;

    }
  }
  // passwordCheck(control)
  // {
  //   if(this.pass == null || this.pass == "")
  //   {
  //
  //   }else
  //   if(control.value == this.pass)
  //   {
  //     return null
  //   }else
  //   {
  //     return true;
  //   }
  // }
  public ht(v)
  {
    let url = this.database.apiUrl+"Register/validateEmail?Email="+v;

    let encodedUrl = encodeURI(url);
    this.http.get(encodedUrl,{},{}).then((data)=>{
      console.log(data.data);
      let parsedData = JSON.parse(data.data);
      console.log("Result from server"+parsedData);

      if(parsedData == "Email Already exist")
      {

        this.emailTaken = true;
        let alert = this.alertCtrl.create({
          title: "Email id already taken",
          buttons: [
            {
              text: 'Ok',
              handler: data => {
              }
            }
          ]
        });
        alert.present();
        return { 'invalidEmailAddress': true };

      }
      else
      {

      }
    }).catch((error)=>{

    });
  }

  public bool()
  {
    if(this.email != this.createUserAccount.value.email || this.email =="" || this.email == null)
    {
      let url = "http://comp-view.com/SparkWorthy/api/Register/validateEmail?Email="+this.createUserAccount.value.email;

      let encodedUrl = encodeURI(url);
      console.log("email validation http send");
      this.http.get(encodedUrl,{},{}).then((data)=> {
        console.log(data.data);
        let parsedData = JSON.parse(data.data);
        console.log("result from server" + parsedData);
        this.email = this.createUserAccount.value.email;
        if (parsedData == "Email Already exist") {
          this.emailexist = true;

        }else
        {
          this.emailexist = false;
        }
      },(error)=>{
        this.emailexist = false;
      });
    }
  }

  check(control)
  {
    console.log(control.value);
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {

      return null;
    } else if(control.value == "" || control.value == null) {
      return null;
    }else
      return { 'invalidEmailAddress': true };

      // console.log("matched");
      // let url = "http://comp-view.com/SparkWorthy/api/Register/validateEmail?Email="+this.createUserAccount.value.email;
      //
      // let encodedUrl = encodeURI(url);
      //
      // this.http.get(encodedUrl,{},{}).then((data)=> {
      //   console.log(data.data);
      //   let parsedData = JSON.parse(data.data);
      //   console.log("parsedData" + parsedData);
      //
      //   if (parsedData == "Email Already exist") {
      //     this.emailErrorMsg = "Email id already taken.Try again with another email";
      //     return { 'invalidEmailAddress': true };
      //
      //   }else
      //   {
      //     return null;
      //   }
      // },(error)=>{
      //   return null;
      // });



  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAccountPagePage');
  }
  navigateBackToSignIn() {
    console.log(this.user['name']);
    this.checkNetwork();
    //this.addUserDataToLocalDb();
    this.navCtrl.pop();

  }
  checkNetwork() {
  }

  public addUserToAPi() {
    let loader = this.loading.create({
      content: 'Creating Account...',
    });
    loader.present();
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    console.log(this.createUserAccount);
    let name = this.createUserAccount.value.name;
    let phonenumber = this.createUserAccount.value.phonenumber;
    let email = this.createUserAccount.value.email;
    let company = this.createUserAccount.value.company;
    let password = this.createUserAccount.value.password;
    let conpassword = this.createUserAccount.value.conPassword;
    let companywebfeed = this.createUserAccount.value.websitelink;
    let position = this.createUserAccount.value.position;
    let country = this.createUserAccount.value.country;
    let city = this.createUserAccount.value.city;
    let state = this.createUserAccount.value.state;
    let zipcode = this.createUserAccount.value.zipcode;
    let dob = this.createUserAccount.value.dob;
    // let interest = this.createUserAccount.value.interest;
    let interest = "12";

    console.log("this.interrest", interest);
    console.log("this.name", this.createUserAccount.value);
    if (name == "" || phonenumber == "" || email == "" || dob == "" || interest == "" || password == "") {
      loader.dismissAll();
      let alert = this.alertCtrl.create({
        title: "Enter all the fields",
        buttons: [
          {
            text: 'Ok',
            handler: data => {
            }
          }
        ]
      });
      alert.present();
    } else if (password != conpassword) {
      loader.dismissAll();
      let alert = this.alertCtrl.create({
        title: "Password Mismatch",
        subTitle: "Please check the password",
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
    // else if(password.length<4)
    // {
    //   let alert = this.alertCtrl.create({
    //     title: "Password too short",
    //     subTitle: "Password should contain atleast 4 characters",
    //     buttons: [
    //       {
    //         text: 'Ok',
    //         handler: data => {
    //         }
    //       }
    //     ]
    //   });
    //   alert.present();
    //
    // }
    else if(this.emailTaken == true) {

      var networkState = this.network.type;
      if (networkState == Connection.NONE) {
        let alert = this.alertCtrl.create({
          title: "No Internet Connection",
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

      }else
      {
        let url = this.database.apiUrl+"Register/validateEmail?Email="+email;

        let encodedUrl = encodeURI(url);
        console.log(encodedUrl);
        this.http.get(encodedUrl,{},{}).then((data)=>{
          console.log(data.data);
          let parsedData = JSON.parse(data.data);
          console.log("parsedData"+parsedData);

          if(parsedData == "Email Already exist")
          {
            loader.dismissAll();

            this.emailTaken = true;
            let alert = this.alertCtrl.create({
              title: "Email id already taken",
              subTitle:"Try again with another email",
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
            this.platform.ready().then(() => {
              var networkState = this.network.type;
              if (networkState == Connection.NONE) {
                this.isConnectedToNet = false;
                let alert = this.alertCtrl.create({
                  title: "No Internet Connection",
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
                this.isConnectedToNet = true;
                let url = this.database.apiUrl + "Register/SaveRegistration?Name=" + name + "&DOB=" + dob +
                    "&PhNo=" + phonenumber + "&Email=" + email + "&Passwd=" + password + "&Company=" + company +
                    "&CompanyURL=" + companywebfeed + "&Position=" + position + "&Country=" + country + "&City=" + city + "&State=" + state + "&Zip=" + zipcode + "&InterestList=" + interest;
                let people;
                console.log("url", url);
                let encodedUrl = encodeURI(url);
                this.http.get(encodedUrl, {}, {})
                    .then(data => {
                      loader.dismissAll();
                      people = data.data;
                      this.navCtrl.pop();
                    })
                    .catch(error => {
                      console.log("error.status", error.status);
                      console.log("error.error", error.error); // error message as string
                      console.log("error.headers", error.headers);
                      loader.dismissAll();
                      let alert = this.alertCtrl.create({
                        title: "Connection failed",
                        subTitle:"Check your internet connection." ,
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
            });
          }
        }).catch((error)=>{
          this.http.get("", {}, {})
              .then(datafrmapi => {
              });
          this.platform.ready().then(() => {
            var networkState = this.network.type;
            if (networkState == Connection.NONE) {
              this.isConnectedToNet = false;
              let alert = this.alertCtrl.create({
                title: "No Internet Connection",
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
              this.isConnectedToNet = true;
              let url = this.database.apiUrl + "Register/SaveRegistration?Name=" + name + "&DOB=" + dob +
                  "&PhNo=" + phonenumber + "&Email=" + email + "&Passwd=" + password + "&Company=" + company +
                  "&CompanyURL=" + companywebfeed + "&Position=" + position + "&Country=" + country + "&City=" + city + "&State=" + state + "&Zip=" + zipcode + "&InterestList=" + interest;
              let people;
              console.log("url", url);
              let encodedUrl = encodeURI(url);
              this.http.get(encodedUrl, {}, {})
                  .then(data => {
                    loader.dismissAll();
                    people = data.data;
                    this.navCtrl.pop();
                  })
                  .catch(error => {
                    console.log("error.status", error.status);
                    console.log("error.error", error.error); // error message as string
                    console.log("error.headers", error.headers);
                    loader.dismissAll();
                    let alert = this.alertCtrl.create({
                      title: "Connection failed",
                      subTitle:"Check your internet connection." ,
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
          });
        });
      }


    }
    else {

    }

  }

  public getInterestValue() {
    // this.database.getUser().then((result) => {
    //   console.log("resultof interest", result);
    // }, (error) => {
    //   //console.log("ERROR: ", error);
    // });
    //gettype =0 and id = 0 for to list out all interest
    let url = this.database.apiUrl + "interest/getInterest?GetType=0&Id=0";
    let encodedUrl = encodeURI(url);
    this.http.get(encodedUrl, {}, {})
      .then(data => {
        this.getInterest = JSON.parse(data.data);
        // console.log("getInterest", this.getInterest);
        // console.log("getInterest[0]", this.getInterest[0]);
        // console.log("getInterest[0].InterestId", this.getInterest[0].InterestId);
      })
      .catch(error => {
      });

  }

  presentInterestModal() {
    let profileModal = this.modalCtrl.create(AddInterestPage, { from:"create" });
    // profileModal.present();
  }

}
