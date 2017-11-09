import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform,LoadingController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Network } from '@ionic-native/network';

declare var Connection: any;
declare var navigator: any;
import { Toast } from '@ionic-native/toast';

import { Database } from '../../providers/database';
import { ValidationService } from '../../app/validation.service';
import {location} from "@angular/platform-browser/src/facade/browser";

//pages

@Component({
    selector: 'page-add-contacts-page',
    templateUrl: 'add-contacts-page.html'
})
export class AddContactsPagePage {

    contact = {};
    isConnectedToNet: boolean;
    addNewContact: any;
    sampleNum;
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public database: Database,
                public alertCtrl: AlertController,
                public platform: Platform,
                public formBuilder: FormBuilder,
                public http :HTTP,
                public loading: LoadingController,
                public toast : Toast,
                private network: Network) {
        this.addNewContact = this.formBuilder.group({
            "firstname": ["", Validators.required,],
            "lastname": ["", Validators.maxLength(50),],
            "email": ["", [ Validators.maxLength(200),ValidationService.emailValidator]],
            "phonenumber": ["", [ Validators.minLength(10), Validators.maxLength(10)]],
            "officenumber": ["",],
            'position': ["", Validators.maxLength(50),],
            "company": ["", Validators.required],
            "profession": ["", Validators.maxLength(100),],
            "relationship": ["", Validators.maxLength(100),],
            "location": ["", Validators.maxLength(100),],
            //"interest": ["",],
            "dob": ["",],
            "anniversary": ["",],
            "notes": ["",],
        });
        console.log("this.addNewContact", this.addNewContact);
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad AddContactsPagePage');
        console.log(this.database.userIdFromDB);
    }
    saveContact() {
        this.database.load = true;
        let loader = this.loading.create({
            content: 'Loading...',
        });
        loader.present();

        let firstname = this.addNewContact.value.firstname;
        let lastname = this.addNewContact.value.lastname;
        let email = this.addNewContact.value.email;
        let phonenumber = this.addNewContact.value.phonenumber;
        let officenumber = this.addNewContact.value.officenumber;
        let position = this.addNewContact.value.position;
        let company = this.addNewContact.value.company;
        let anniver = this.addNewContact.value.anniversary;
        let profession = this.addNewContact.value.profession;
        //let interest = this.addNewContact.value.interest;
        let birth = this.addNewContact.value.dob;
        let relationship = this.addNewContact.value.relationship;
        let notes = this.addNewContact.value.notes;
        // let location = this.addNewContact.value.location;
        let location = this.addNewContact.value.location;

        let  phonenumbernew = phonenumber.toString();
        let officenumbernew = officenumber.toString();

        // let firstnamenew = firstname.replace(/\s/g,"%20");
        //
        // let lastnamenew = lastname.replace(/\s/g,"%20");
        //
        // let emailnew = email.replace(/\s/g,"%20");
        //
        // phonenumbernew = (phonenumbernew).replace(/\s/g,"%20");
        //
        // officenumbernew = (officenumbernew).replace(/\s/g,"%20");
        //
        // let  positionnew = (position).replace(/\s/g,"%20");
        //
        // let  companynew = (company).replace(/\s/g,"%20");
        //
        // let relationshipnew = (relationship).replace(/\s/g,"%20");
        //
        // let notesnew = (notes).replace(/\s/g,"%20");
        //
        // let professionnew = (profession).replace(/\s/g,"%20");

        this.http.get("", {}, {})
            .then(datafrmapi => {
            });
        if (firstname == "" || firstname.trim() == "" || firstname.trim() == " " )
        {
            loader.dismissAll();

            alert("Please enter a first name");
        }
        else if(company == "" || company.trim() == "" || company.trim() == " ")
        {
            loader.dismissAll();

            alert("Please enter a company name");
        }
        else
        {
            this.database.checkWhetherContactExist(phonenumber).then((result)=>{

                loader.dismissAll();

                alert("Phonenumber already exist");

            },(error)=>{

                console.log("birth", birth);
                this.platform.ready().then(() => {

                    let networkState = this.network.type;

                    console.log(networkState);
                    if (networkState === Connection.NONE) {
                        this.isConnectedToNet = false;
                        this.database.addContact(firstname, lastname, email, phonenumber, officenumber, position, company, birth, relationship, notes,profession,anniver,location).then((result) => {
                            this.database.contactAdded = true;
                            loader.dismissAll();
                            this.toast.show("Contact added successfully", '5000', 'center').subscribe(
                                toast => {
                                    console.log(toast);
                                });
                            this.navCtrl.pop();

                        }, (error) => {
                            loader.dismissAll();

                            console.log("ERROR: ", error);
                        });
                    }
                    else {
                        this.isConnectedToNet = true;

                        let url = this.database.apiUrl + "Contact/Save?ContactId=0&UserId=" + this.database.userIdFromDB +
                            "&FirstName=" + firstname + "&LastName=" + lastname + "&EMail=" + email +
                            "&PhNo=" + phonenumber + "&OfficeNo=" + officenumber + "&Position=" + position +
                            "&Company=" + company + "&Relative=" + relationship + "&Profilepic=&DOB=" + birth +
                            "&Fav=false&FavRating=0&Notes=" + notes + "&ModifyOn=01-01-2017&Profession=" + profession + "&AnnivasaryOn=" + anniver +"&Location="+location;
                        let encodedUrl = encodeURI(url);

                        this.http.get(encodedUrl, {}, {})
                            .then(datafrmapi => {
                                // update contactidext and ifsync
                                let aa = JSON.parse(datafrmapi.data);
                                console.log("Id from Sentient", aa);
                                if(this.database.development == true)
                                {
                                    let alert1 = this.alertCtrl.create({
                                        title: "Contact added through api.",
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
                                this.database.addContactWhenOnline(firstname, lastname, email,
                                    phonenumber, officenumber, position, company, birth, relationship, notes, aa,profession,anniver,location).then((result) => {
                                    this.database.contactAdded = true;
                                    loader.dismissAll();
                                    console.log("Contact added through http");
                                    this.toast.show("Contact added successfully", '5000', 'center').subscribe(
                                        toast => {
                                            console.log(toast);
                                        });
                                    this.navCtrl.pop();
                                }, (error) => {
                                    this.database.addContact(firstname, lastname, email, phonenumber, officenumber, position, company, birth, relationship, notes,profession,anniver,location).then((result) => {
                                        this.database.contactAdded = true;
                                        loader.dismissAll();
                                        this.toast.show("Contact added successfully", '5000', 'center').subscribe(
                                            toast => {
                                                console.log(toast);
                                            });
                                        this.navCtrl.pop();
                                    }, (error) => {
                                        loader.dismissAll();

                                        console.log("ERROR: ", error);
                                    });
                                    loader.dismissAll();

                                    console.log("ERROR: ", error);
                                });
                            })
                            .catch(error => {
                                //alert(JSON.stringify(error));
                                this.database.addContact(firstname, lastname, email, phonenumber, officenumber, position, company, birth, relationship, notes,profession,anniver,location).then((result) => {
                                    this.database.contactAdded = true;
                                    loader.dismissAll();
                                    this.toast.show("Contact added successfully", '5000', 'center').subscribe(
                                        toast => {
                                            console.log(toast);
                                        });
                                    this.navCtrl.pop();
                                }, (error) => {
                                    loader.dismissAll();

                                    console.log("ERROR: ", error);
                                });
                                console.log(error.status);
                                console.log(error.error); // error message as string
                                console.log(error.headers);
                            });
                    }
                });

            })

        }
        //console.log("interest", interest);

    }
    sample()
    {
        // console.log(this.sampleNum);
        // let aa : String = String(this.sampleNum);
        // console.log(aa);
        // console.log(aa.replace(/^\D+/g, ''));
        let bb : String = String(this.sampleNum);
        var firstName = bb.split(' ').slice(0, -1).join(' ');
        var lastName = bb.split(' ').slice(-1).join(' ');
        console.log(firstName);
        console.log(lastName);

    }
}

