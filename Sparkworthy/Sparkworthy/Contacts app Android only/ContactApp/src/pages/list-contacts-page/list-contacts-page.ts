import { Component } from '@angular/core';
import { NavController, NavParams , AlertController,Platform,LoadingController} from 'ionic-angular';
import { Database } from '../../providers/database';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';

declare let Connection: any;
declare let navigator: any;
import { HTTP } from '@ionic-native/http';
import * as _ from "lodash";
@Component({
  selector: 'page-list-contacts-page',
  templateUrl: 'list-contacts-page.html'
})
export class ListContactsPagePage {

  public contactList: any;
  groupDetails : any;
  contactDetails : any;
  commingFrm:any;
  searchName = '';
  public  reachedLast:any;
  public load;
  public numberOfGroupContact;
  public loaded :boolean = false;

   // public groupListInitial: Array<Object>;

  public contactListInitial:Array<Object>;
  constructor(public navCtrl: NavController,
              public loadingCtrl:LoadingController,
              public navParams: NavParams ,
              public database : Database ,
              public alertCtrl : AlertController,
              public platform:Platform,
              public http :HTTP,
              private network: Network,
              public toast:Toast) {
    this.commingFrm = navParams.get('comingFrom');
    switch (this.commingFrm)
    {
      case "innercircle":
          this.contactDetails = navParams.get('object');
        break;
      case "group":
        this.groupDetails = navParams.get("object");
          break;
    }
    this.displayContacts();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListContactsPagePage');
  }

  displayContacts()
  {
    this.database.getAllContacts().then((result) => {
        let groupConList;
      this.contactList = <Array<Object>> result;
      this.contactListInitial = <Array<Object>> result;
      this.transform(this.contactList, "firstname");
      this.database.getAllGroupContactForList(this.groupDetails["GroupId"]).then((resultCon)=>{
          groupConList = <Array<Object>> resultCon;
          this.contactListInitial= [];
          for(let j of this.contactList)
          {
              let bool = false;
              for(let i of groupConList)
              {
                  if(i["ContactId"] == j["contactid"])
                  {
                      bool = true;
                      console.log(j["hide"]);
                  }else {
                      //this.contactListInitial.push(j);

                      j["canhide"] = false;
                      console.log(j["hide"]);
                  }
              }
              if(bool == false)
              {
                  this.contactListInitial.push(j);
              }
          }
          this.contactList = [];
          this.contactList = this.contactListInitial;
          this.numberOfGroupContact = this.contactList.length;
          console.log("this.contactList.length"+this.contactList.length);
      },(error)=>{
          console.log("group con error"+error);

      })


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

    onCancel()
    {
        this.displayContacts();

    }


  addContactToGroup(v) {
      this.http.get("", {}, {})
          .then(datafrmapi => {
          });
    switch (this.commingFrm)
    {
      case "innercircle":
        this.platform.ready().then(() => {
          var networkState = this.network.type;
          if (networkState === Connection.NONE) {
          }
          else {


          }
        });

        break;
      case "group":
        let loader = this.loadingCtrl.create({
      content: 'Adding contact...',
    });

        this.platform.ready().then(() => {
          var networkState = this.network.type;
          if (networkState === Connection.NONE) {
            this.database.addContactToGroup(this.groupDetails['GroupId'],v['contactid'],this.groupDetails['GroupName']).then((result)=>{

            loader.dismissAll();
          },(error)=>{
                        loader.dismissAll();

              console.log("ERROR: ", error);
            });
          }
          else{

              let url = this.database.apiUrl+"group/importContact?GroupId="+this.groupDetails['GroupIdExt']+"&ContactListId="+v['contactidext'];
              let encodedUrl = encodeURI(url);

            this.http.get(encodedUrl, {}, {})
                .then(datafrmapi => {
                  let id = JSON.parse(datafrmapi.data);
                  this.database.addContactToGroupWhenOnline(this.groupDetails['GroupId'],v['contactid'],this.groupDetails['GroupName'],id).then((result)=>{
                  loader.dismissAll();


                  },(error)=>{
                    loader.dismissAll();

                    console.log("ERROR: ", error);
                  });

                })
                .catch(error => {
                 

                  this.database.addContactToGroup(this.groupDetails['GroupId'],v['contactid'],this.groupDetails['GroupName']).then((result)=>{
                  loader.dismissAll();


                  },(error)=>{
                   loader.dismissAll();
                    console.log("ERROR: ", error);
                  });
                  console.log(error.status);
                  console.log(error.error); // error message as string
                  console.log(error.headers);
                });
          }
        });
        break;
    }
  }
    getNameItems(searchbar) {

     this.contactList = this.contactListInitial;
    let sVal = searchbar.target.value;
    if (sVal.trim() == '') {
      return;
    }
    this.contactList = this.contactList.filter((v) => {
      return v.firstname.toLowerCase().indexOf(sVal.toLowerCase()) > -1;
    });
  }
    save()
    {
        this.loaded = false;
        this.numberOfGroupContact = 0;
        this.database.contactAddedToGroup = true;
        let load = this.loadingCtrl.create({
            content: 'Adding contact...',
        });
        load.present();
        this.reachedLast  = false;
        let j = 0;
        let con : Array<Object> = this.contactList;
        console.log("con lenght"+con.length);
        let notChecked : boolean =true;
        for(let i of this.contactList) {
            j = j + 1;
            console.log(i);
            if (j == con.length) {
                load.dismissAll();
                this.reachedLast = true;
            }
            if (i['checked'] == true) {
                this.numberOfGroupContact = this.numberOfGroupContact +1;
                this.addContact(i);
                notChecked = false;

            }else if (i['checked'] != true)
            {

            }
        }
        if(notChecked == true)
        {
            load.dismissAll();
            this.toast.show("Please choose any contact and click add", '5000', 'center').subscribe(
                toast => {
                    console.log(toast);
                });
        }
    }
    public displayAlert()
    {
        if(this.loaded == false)
        {
            this.reachedLast = false;
            this.loaded = true;
            let titleT ="";
            if(this.numberOfGroupContact == 1)
            {
                titleT = " Contact added";
            }else
            {
                titleT = " Contacts added"
            }
            let alert = this.alertCtrl.create({
                title: "Contact Added",
                subTitle: this.numberOfGroupContact+ titleT,
                buttons: [
                    {
                        text: 'Ok',
                        handler: data => {
                            this.navCtrl.pop();

                            // this.displayContacts();

                        }
                    }
                ]
            });
            alert.present();
        }

    }
    public addContact(v)
    {
        this.http.get("", {}, {})
            .then(datafrmapi => {
            });
            this.platform.ready().then(() => {
                var networkState = this.network.type;
                if (networkState === Connection.NONE) {
                    this.database.addContactToGroup(this.groupDetails['GroupId'], v['contactid'], this.groupDetails['GroupName']).then((result) => {
                        if(this.reachedLast == true)
                        {
                            this.displayAlert();
                        }

                        // loader.dismissAll();
                    }, (error) => {
                        // loader.dismissAll();
                        if(this.reachedLast == true)
                        {
                            this.displayAlert();
                        }

                        console.log("ERROR: ", error);
                    });
                }
                else {

                    let url = this.database.apiUrl + "group/importContact?GroupId=" + this.groupDetails['GroupIdExt'] + "&ContactListId=" + v['contactidext'];

                    let encodedUrl = encodeURI(url);

                    this.http.get(encodedUrl, {}, {})
                        .then(datafrmapi => {
                            let id = JSON.parse(datafrmapi.data);
                            if(this.database.development == true)
                            {
                                let alert1 = this.alertCtrl.create({
                                    title: "Group Contact added through api.",
                                    subTitle:"Result returned :"+id,
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
                            this.database.addContactToGroupWhenOnline(this.groupDetails['GroupId'], v['contactid'], this.groupDetails['GroupName'], id).then((result) => {
                                // loader.dismissAll();
                                console.log("Group contact added through http api");
                                console.log("Result from server",datafrmapi);

                                if(this.reachedLast == true)
                                {
                                    this.displayAlert();

                                }

                            }, (error) => {
                                // loader.dismissAll();
                                if(this.reachedLast == true)
                                {
                                    this.displayAlert();

                                }

                                console.log("ERROR: ", error);
                            });

                        })
                        .catch(error => {


                            this.database.addContactToGroup(this.groupDetails['GroupId'], v['contactid'], this.groupDetails['GroupName']).then((result) => {
                                // loader.dismissAll();
                                if(this.reachedLast == true)
                                {
                                    this.displayAlert();

                                }
                            }, (error) => {
                                if(this.reachedLast == true)
                                {
                                    this.displayAlert();

                                }
                                // loader.dismissAll();
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
