import { Component } from '@angular/core';
import { NavController, NavParams ,AlertController ,LoadingController} from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

declare let Connection: any;
declare let navigator: any;
import { Database } from '../../providers/database';
import { SocialSharing } from '@ionic-native/social-sharing';
import { HTTP } from '@ionic-native/http';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-location-news-feed-page',
  templateUrl: 'location-news-feed-page.html'
})
export class LocationNewsFeedPagePage {
    @ViewChild(Slides) slides: Slides;

public locationData :Array<Object>;
public newsNone : boolean;
    public navArrowBack : Boolean;
    public navArrowForwrd : Boolean;
    public lengthNews : any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public database: Database, 
              public loading: LoadingController,
              public alertCtrl: AlertController,
              public http:HTTP,
              private socialSharing: SocialSharing,
              public diagnostic : Diagnostic,
              private geolocation: Geolocation,
              private network: Network) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationNewsFeedPagePage');
  }
   ionViewWillEnter() {
       this.http.get("", {}, {})
           .then(datafrmapi => {
           });
      let networkState = this.network.type;
      if (networkState === Connection.NONE) {
        let alert = this.alertCtrl.create({
          title: "No Internet Connection",
          subTitle: "Check your internet connection",
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
        let loader = this.loading.create({
          content: 'Loading...',
        });
        loader.present();
        
        let url = this.database.apiUrl + "Feed/GetFeeduserLocation?userId="+this.database.userIdFromDB;

        let encodedUrl = encodeURI(url);
        console.log("encodedUrl", encodedUrl);
        this.http.get(encodedUrl, {}, {})
            .then(data => {
              loader.dismissAll();
              console.log("data inage ", data);
              this.locationData = JSON.parse(data.data);
              console.log("news length" +this.locationData.length);

              if (this.locationData.length == 0){
                   let alert1 = this.alertCtrl.create({
                              title: "No news available.",
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

              }else
              {
                  this.newsNone = false;
              }
              this.lengthNews = this.locationData.length;
                if (this.lengthNews == this.slides.getActiveIndex())
                {
                    this.navArrowForwrd = true;
                }
              console.log(this.newsNone);
              console.log("this.locationData ", this.locationData);
            })
            .catch(error => {
                // console.log("No news available error" +error);
                //  let alert1 = this.alertCtrl.create({
                //             title: "No news available.",
                //             buttons: [
                //               {
                //                 text: 'Ok',
                //                 handler: data => {
                //                   this.navCtrl.pop();
                //                 }
                //               }
                //             ]
                //           });
                //           alert1.present();

            });
      }
    }
    otherShare(link){
      this.socialSharing.share("Genral Share Sheet",null/*Subject*/,null/*File*/,link)
      .then(()=>{
        },
        ()=>{
        })
    }
      public getLocation()
      {
        console.log("Get Location");
        
        this.geolocation.getCurrentPosition({  enableHighAccuracy: true }).then((resp) => {
                  console.log("got cordinates"); 
                  console.log(resp);


            this.http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+resp.coords.latitude+","+resp.coords.longitude+"&sensor=true",{},{}).then((data)=>{
                 
                 console.log("got response from api"); 
                 let d = JSON.parse(data.data);
                console.log(d);
                console.log(d.results[7].address_components[0]);
                console.log("lenght"+d.results[0].address_components.length);
                let len = d.results[0].address_components.length;


                if(d.results[0].address_components[len-5].long_name == null && d.results[0].address_components[len-2].short_name == null)
                  {
                  }
                  else
                  {
                    // localStorage.setItem("city",d.results[0].address_components[len-5].long_name);
                    // localStorage.setItem("country",d.results[0].address_components[len-2].short_name);
                  }
            }).catch((err)=>
            {
               console.log('api maps error', err);

            });
            }).catch((error) => {
                console.log('Error getting location', error);
            });
      }
      public checkGps()
      {
          console.log(this.diagnostic.isLocationEnabled());  
      this.diagnostic.isLocationEnabled().then((res)=>{
        if(res == false)
        {
          let alert = this.alertCtrl.create({
          title: "Gps Disabled",
          subTitle: "Turn on GPS",
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
              }
            },
            {
              text: 'Go to Settings',
              handler: data => {
                this.diagnostic.switchToLocationSettings();
              }
            }
          ]
        });
        alert.present();
      }else
      {
        //this.getLocation();
      }
      }).catch((err)=>{
        console.log(err)
      });
    }
    // public locationWatcher()
    // {
    //   var subscription = this.geolocation.watchPosition({  enableHighAccuracy: true })
    //                           .filter((p) => p.coords !== undefined) //Filter Out Errors
    //                           .subscribe(position => {
    //
    //      console.log("watcher"+position.coords.longitude + ' ' + position.coords.latitude);
    //      this.http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&sensor=true",{},{}).then((data)=>{
    //
    //              console.log("got response from api");
    //              let d = JSON.parse(data.data);
    //               if(d.results[7].address_components[0].long_name == null && d.results[8].address_components[1].short_name == null)
    //               {
    //               }
    //               else
    //               {
    //
    //                 localStorage.setItem("city",d.results[7].address_components[0].long_name);
    //                 localStorage.setItem("country",d.results[8].address_components[1].short_name);
    //               }
    //         }).catch((err)=>
    //         {
    //            console.log('api maps error', err);
    //
    //         });
    // });
    //
    // }
    slideChanged()
    {
        let currentIndex = this.slides.getActiveIndex();
        console.log("Current index is", currentIndex);
        if (currentIndex == 0)
        {
            this.navArrowBack = true;
        }else
        {
            this.navArrowBack = false;
        }
        if(currentIndex >= this.lengthNews-1 )
        {
            this.navArrowForwrd = true;
        }else
        {
            this.navArrowForwrd = false;
        }
    }
    moveCardBack()
    {
        this.slides.slidePrev();
    }
    moveCardForward()
    {
        this.slides.slideNext();
    }
}
