import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController ,Platform } from 'ionic-angular';
import { Database } from '../../providers/database';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';

import * as _ from "lodash";
import { LoadingController } from 'ionic-angular';

declare let Connection: any;
declare let navigator: any;

//pages
import { AddContactsPagePage } from '../add-contacts-page/add-contacts-page';
import { AddGroupPagePage } from '../add-group-page/add-group-page';
import { GroupEditPagePage } from '../group-edit-page/group-edit-page';
import { EditContactPagePage } from '../edit-contact-page/edit-contact-page';

import { ImgcacheService } from '../../global/services/cache-img/cache-img.service';

@Component({
  selector: 'page-all-contacts-page',
  templateUrl: 'all-contacts-page.html',
})
export class AllContactsPagePage {
  segment: string = "name";
  isConnectedToNet: Boolean;

  public contactList: any;
  public contactListInit: Array<Object>;
  public groupList: any;
  public start = 0;
  public networkReach;
  public groupListInitial: Array<Object>;
  searchGroup = '';
  searchName = '';
  public hideGrouped = true;
  public hideCon = false;
  public  hideContact : boolean = false;
  public  hideGroup : boolean = true;
    backButtonPressedOnceToExit:any;
  contacts;
  groupedContacts: Array<Object>;
  groupedContactsInit: Array<Object>;
  ctName = [];
  ctId = [];
  public contactCount;
  public groupCount;


  constructor(public navCtrl: NavController,
              public toastCtrl : ToastController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public database: Database,
              public platform: Platform,
              public loading: LoadingController,
              public http:HTTP,
              public imgcache : ImgcacheService,
              private network: Network) {
    // var a = this.contactList.length;
    //database.checkContactSync();
  }

  ionViewWillEnter() {
      let networkState = this.network.type;
      if (networkState === Connection.NONE) {
          this.networkReach = false;
      }else
      {
          this.networkReach = true;
      }
          if(this.database.load == true)
      {
          this.database.load = false;
          console.log('ionViewWillEnter AllContactsPagePage');
          this.database.contactAdded = false;
          this.displayContacts();

          this.database.groupAdded = false;
          this.getallGroups();
      }

    //this.getUserContacts();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AllContactsPagePage');
  }
  addNewContact() {
    console.log(this.segment);
    switch (this.segment) {
      case 'name':
        this.navCtrl.push(AddContactsPagePage);
        break;
      case 'group':
        this.navCtrl.push(AddGroupPagePage);
        break;
    }
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
  transform(array, args) {
    this.contactList = [];
    let sortedList = _.sortBy(array, args);
    this.contactList = sortedList;
      this.contactListInit = this.contactList;
      this.contactList = [];

      this.start = 0;
      this.getContacts(this.start);

      // let currentLetter = false;
    // let currentContacts:Array<Object> = [];

  }

    getContacts(obj)
    {
        let contact :Array<Object> = [];

        let length = this.contactListInit.length;

        contact = this.contactListInit.slice(this.start,this.start+15);
        this.start = this.start +15;
        for(let con of contact)
        {
            this.contactList.push(con);
        }
        console.log(contact);
        console.log("getContacts");
        obj.complete();
        // for(this.start ; this.start>=this.contactListInit.length;this.start++ )
        // {
        //
        // }
        //this.contactList =
    }
  displayContacts() {
    this.contactList = [];
    this.database.getAllContacts().then((result) => {

      this.contactList = <Array<Object>>result;
      this.contactListInit = <Array<Object>>result;
        if(this.contactListInit.length == 0)
        {
            this.contactCount = 0;
        }else
        {
            this.contactCount = this.contactListInit.length;
        }
      this.transform(this.contactList, "firstname");


        // this.groupedContactsInit = [];
        // this.groupedContacts = [];
        // this.start = 0;
        // this.getContacts(this.start);
      // this.groupContacts(this.contactList);
      // console.log(this.groupedContacts);

    }, (error) => {
    });
  }
  // getContacts(obj)
  // {
  //     let contact :Array<Object> = [];
  //     // let length = this.contactListInit.length;
  //      contact = this.contactList.slice(this.start,this.start+15);
  //      this.start = this.start +15;
  //      this.groupContacts(contact);
  //     console.log(contact);
  //     console.log("getContacts");
  //     obj.complete();
  //     // for(this.start ; this.start>=this.contactListInit.length;this.start++ )
  //     // {
  //     //
  //     // }
  //     //this.contactList =
  // }

  // groupContacts(contacts) {
  //   let currentLetter = false;
  //   let currentContacts = [];
  //
  //   contacts.forEach((value, index) => {
  //
  //     if (value.firstname.charAt(0) != currentLetter) {
  //
  //       currentLetter = value.firstname.charAt(0);
  //
  //       let newGroup = {
  //         letter: currentLetter,
  //         contacts: []
  //       };
  //
  //       currentContacts = newGroup.contacts;
  //       this.groupedContacts.push(newGroup);
  //       this.groupedContactsInit.push(newGroup);
  //     }
  //     currentContacts.push(value);
  //   });
  // }
  openGroupEdit(v) {
    this.navCtrl.push(GroupEditPagePage, { object: v,name:v['GroupName'] });
  }
  openContactEditPage(obj) {
    this.navCtrl.push(EditContactPagePage, { object: obj });
  }
  getallGroups() {
    this.groupList = [];
    this.database.getAllgroups().then((result) => {
      this.groupList = <Array<Object>>result;
      this.groupListInitial = <Array<Object>>result;
        if(this.groupListInitial.length == 0)
        {
            this.groupCount = 0;
        }else
        {
            this.groupCount = this.groupListInitial.length;
        }
    }, (error) => {
      //console.log("ERROR: ", error);
    });
  }
  deleteContact(v) {
      this.database.load = true;

      this.database.deleteContact(v['contactid']).then((result) => {
      if (v['contactidext'] != null) {
        console.log("Conatct id Ext found");
        this.checkNetworkToDeleteContact(v['contactidext']);
      }
      this.displayContacts();
    }, (error) => {
      //console.log("ERROR: ", error);
    });
  }
    doInfinite()
    {

    }
  deleteGroup(v) {
      this.database.load = true;

      this.http.get("", {}, {})
          .then(datafrmapi => {
          });
    this.platform.ready().then(() => {
      let networkState = this.network.type;
      if (networkState === Connection.NONE) {
        this.database.deleteGroup(v['GroupId']).then((result) => {
          this.checkNetworkToGroupContact(v['GroupIdExt']);
          this.getallGroups();

        }, (error) => {
          //console.log("ERROR: ", error);
        });

      } else {

          let url = this.database.apiUrl + "group/delete?GroupId=" + v['GroupIdExt'];

          let encodedUrl = encodeURI(url);

        this.http.get(encodedUrl, {}, {})
          .then(datafrmapi => {
              console.log("Group deleted through http api");
              if(this.database.development == true)
              {
                  let alert1 = this.alertCtrl.create({
                      title: "Group deleted through api.",
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
              console.log("Result from server"+datafrmapi);
          })
          .catch(error => {
              this.checkNetworkToGroupContact(v['GroupIdExt']);

              console.log(error.status);
            console.log(error.error); // error message as string
            console.log(error.headers);
          });

        this.database.deleteGroup(v['GroupId']).then((result) => {
          this.getallGroups();

        }, (error) => {
          //console.log("ERROR: ", error);
        });

      }
    });

  }
  selectSegmentContact()
  {
      this.displayContacts();
    // this.hideContact = false;
    // this.hideGroup = true;
  }
  selectSegmentGroup()
  {
      // this.hideContact = true;
      // this.hideGroup = false;

  }
  checkNetworkToDeleteContact(v) {
      this.http.get("", {}, {})
          .then(datafrmapi => {
          });
    console.log("Contact to delete  "+v);
    this.platform.ready().then(() => {
      let networkState = this.network.type;
      if (networkState === Connection.NONE) {
        this.database.saveContactToDelete(v).then((result) => {
            console.log("Contact added to contacttodelete table");
        }, (error) => {
          //console.log("ERROR: ", error);
        });
        this.isConnectedToNet = false;
        // document.addEventListener("online",ononline(),false);
      }
      else {

          let url = this.database.apiUrl+"contact/delete?ContactId=" + v;

          let encodedUrl = encodeURI(url);

        this.http.get(encodedUrl, {}, {})
          .then(datafrmapi => {
              console.log("Contact deleted in online mode");
              console.log("Result from server"+datafrmapi.data);
              if(this.database.development == true)
              {
                  let alert1 = this.alertCtrl.create({
                      title: "Contact deleted through api.",
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
          })
          .catch(error => {
              this.database.saveContactToDelete(v).then((result) => {
                  console.log("Contact added to contacttodelete table");
              }, (error) => {
                  //console.log("ERROR: ", error);
              });
            // console.log(error.status);
            console.log(error.error); // error message as string
            // console.log(error.headers);
          });
        this.isConnectedToNet = true;
      }
    });
  }
  checkNetworkToGroupContact(v) {
    this.database.saveGroupToDeleteInOffline(v);
  }
    onCancel()
    {
        this.displayContacts();
        console.log("oncancel");
        this.contactList = this.contactListInit;
        this.hideGrouped = true;
        this.hideCon = false;

    }
    onCancelGroup(obj)
    {
        this.groupList = this.groupListInitial;
    }
  getNameItems(searchterm) {

    this.hideGrouped = false;
    this.hideCon = true;

    this.contactList = this.contactListInit;


    let sVal = searchterm.target.value;
    // if(sVal.length<3)
    // {
    //     return;
    // }
   if(sVal === "")
    {
        this.displayContacts();
          this.hideGrouped = true;
          this.hideCon = false;
    }
    if (sVal.trim() == '') {
      return;
    }

      this.contactList = this.contactList.filter((v) => {
        // if (v.firstname.toLowerCase().indexOf(sVal.toLowerCase()) > -1) {
        //   return true;
        // }
        return v.name.toLowerCase().indexOf(sVal.toLowerCase()) > -1;
        // return false;
      });

  }
    getContactsSearch(obj)
    {
        let contact :Array<Object> = [];
        //
        // let length = this.contactList.length;

        contact = this.contactList.slice(this.start,this.start+15);
        this.start = this.start +15;
        for(let con of contact)
        {
            this.contactList.push(con);
        }
        console.log(contact);
        console.log("getContacts");
        obj.complete();
        // for(this.start ; this.start>=this.contactListInit.length;this.start++ )
        // {
        //
        // }
        //this.contactList =
    }
  getGroupItems(searchbar) {
    this.groupList = this.groupListInitial;
    let sVal = searchbar.target.value;
    if (sVal.trim() == '') {
      return;
    }
    this.groupList = this.groupList.filter((v) => {
      return v.GroupName.toLowerCase().indexOf(sVal.toLowerCase()) > -1;
    });
  }
    sample()
    {
        console.log("sample");
    }
}
