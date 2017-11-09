import {Component, } from '@angular/core';
import { NavController, NavParams,AlertController,LoadingController} from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
declare let Connection: any;
import { Database } from '../../providers/database';


import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-add-interest',
  templateUrl: 'add-interest.html'
})
export class AddInterestPage {

  public bool : boolean = true;
  searchQuery: string = '';
  items: string[];
  search: any;
  interestArr: Array<Object>;
  public interests =[];
  public showAlertMessage: any;
  confirmedExit: boolean = false;
  contactDetails: any;
  txtInterest:String;
  interestCount : any;
  public initialInterests;
  public  interestText;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public toast: Toast,
              private network: Network,
              public http:HTTP,
              public database: Database,
              public loadingCtrl : LoadingController
              ) {

    this.showAlertMessage = true;
    this.contactDetails = navParams.get('object');
    this.getInterestValue();
  }


  ionViewCanLeave() {
    console.log("View can leave executed");
    // this.dismiss();
  }
  addInterest()
  {
    console.log(this.txtInterest);
    this.txtInterest = this.txtInterest.trim();
    if(this.txtInterest == "" || this.txtInterest == null || this.txtInterest == " ")
    {
      this.toast.show("Enter any interest and then click on add", '5000', 'center').subscribe(
          toast => {
            console.log(toast);
          });

    }else
    {
      this.database.checkInterestNameExist(this.txtInterest,this.contactDetails['contactid']).then((data)=>{
        if(data == "already exist")
        {
          this.toast.show("Interest exists", '5000', 'center').subscribe(
              toast => {
                console.log(toast);
              });

        }else if(data == "not exist")
        {
          this.save();
        }
      },(error)=>{
        this.save();
      });
    }
  }
  public save()
  {
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    });
    loader.present();

    let networkState = this.network.type;
    let interest = this.txtInterest;
    this.txtInterest = "";
    if (networkState === Connection.NONE) {
      this.database.addInterestInContact(this.contactDetails['contactid'],this.contactDetails['contactidext'],interest,0).then((result)=>{
        this.getInterestValue();
        loader.dismissAll();
      },(error)=>{
        loader.dismissAll();
      })
    }else
    {
      let url = this.database.apiUrl+"interest/save?ContactId="+this.contactDetails['contactidext']+"&InterestName="+interest;
      let encodedUrl = encodeURI(url);
      console.log(encodedUrl);
      this.http.get(encodedUrl,{},{}).then((data)=>{
        let parsedData = JSON.parse(data.data);
        console.log("Interest added through api");
        console.log("Result from server",parsedData);
        if(this.database.development == true)
        {
          let alert1 = this.alertCtrl.create({
            title: "Interest added through api.",
            subTitle:"Result returned :"+parsedData,
            buttons: [
              {
                text: 'Ok',
                handler: data => {
                  this.navCtrl.pop();
                }
              }
            ]
          });
          alert1.present();

        }
        this.database.addInterestInContactOnline(this.contactDetails['contactid'],this.contactDetails['contactidext'],parsedData,interest,1).then((res)=>{
          this.getInterestValue();
          loader.dismissAll();
        },(error)=>{
          loader.dismissAll();

          console.log(error);
        })
      }).catch((error)=>{
        loader.dismissAll();
        this.database.addInterestInContact(this.contactDetails['contactid'],this.contactDetails['contactidext'],interest,0).then((result)=>{
          this.getInterestValue();
          loader.dismissAll();
        },(error)=>{
          loader.dismissAll();

        });
        console.log(error.error);
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddInterestPage');
  }
  onItemAdded(obj){
    console.log(obj.value);
    console.log(this.interests);


    // this.interestArr.push()
  }
  onItemRemoved(obj)
  {
    console.log(obj);
    let networkState = this.network.type;

    this.deleteInterest(obj);
  }

  getCount()
  {
    this.database.getInterestForContact(this.contactDetails.contactid).then((result) => {
      let interests = <Array<Object>> result;
      this.initialInterests = interests;
      this.interestCount = interests.length;
      if(this.interestCount == 0){
        this.interestText = "0 Interest";

        // this.bool = true;
      }
      if (this.interestCount == 1)
      {
        this.interestText = "1 Interest";
      }else if(this.interestCount > 1)
      {
        this.interestText = this.interestCount + " Interests";
      }
      console.log(this.interests);
      // alert(JSON.stringify(this.interestCount));
    }, (error) => {
    });
  }
  deleteInterest(v) {
  console.log(v);
    this.http.get("", {}, {})
        .then(datafrmapi => {
        });
    var networkState = this.network.type;
    if (networkState === Connection.NONE) {
      this.database.deleteInterest(v['id']).then((result) => {
        console.log("OFFLINE:Interest deleted");
        // this.getInterestValue();
        this.getCount();

      }, (error) => {
        console.log("ERROR: ", error);
      });
      this.database.addInterestToDeleteTable(this.contactDetails['contactidext'],v['InterestIdExt']);
    }
    else {

      let url = this.database.apiUrl+"interest/deleteContactInterest?Id="+v['InterestIdExt'];

      let encodedUrl = encodeURI(url);
      console.log(encodedUrl);
      this.http.get(encodedUrl, {}, {})
          .then(data => {
            console.log("Interest deleted through http api");
            if(this.database.development == true)
            {
              let alert1 = this.alertCtrl.create({
                title: "Interest deleted through api.",
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
            console.log("Result from server",data);
          })
          .catch(error => {
            console.log(error.error);
          });
      this.database.deleteInterest(v['id']).then((result) => {
        // this.getInterestValue();
        this.getCount();

      }, (error) => {
        console.log("ERROR: ", error);
      });
    }
  }

  getAllInterest()
  {

  }
  public getInterestValue() {
    let loader = this.loadingCtrl.create({
      content: 'Loading...',
    });
    loader.present();

    this.database.getInterestForContact(this.contactDetails.contactid).then((result) => {
      this.interests = <Array<Object>> result;
      this.interests.reverse();
      this.initialInterests = this.interests;
      console.log(this.interests);
      this.interestCount = this.interests.length;
      if(this.interestCount == 0){
        this.interestText = "0 Interest";
      }
      if (this.interestCount == 1)
      {
        this.interestText = "1 Interest";
      }else if(this.interestCount > 1)
      {
        this.interestText = this.interestCount + " Interests";
      }

      loader.dismissAll();
      // alert(JSON.stringify(this.interestCount));
    }, (error) => {
      loader.dismissAll();
    });
  }
  onCancel()
  {
    this.interests = this.initialInterests;
  }
  hideSearch()
  {
    this.bool = true;
  }
  hideAdd()
  {
    this.bool = false;
  }
  onInput(searchterm)
  {

    this.interests = this.initialInterests;

    let sVal = searchterm.target.value;
    if(sVal === "")
    {

    }
    if (sVal.trim() == '') {
      return;
    }

    this.interests = this.interests.filter((v) => {
      // if (v.firstname.toLowerCase().indexOf(sVal.toLowerCase()) > -1) {
      //   return true;
      // }
      return v.InterestName.toLowerCase().indexOf(sVal.toLowerCase()) > -1;
      // return false;
    });

  }
}
