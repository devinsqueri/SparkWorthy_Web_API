import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController ,LoadingController,ToastController} from 'ionic-angular';
import { Database } from '../../providers/database';
import { Slides } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';

 import { ViewChild } from '@angular/core';
declare let Connection: any;
declare let navigator: any;
import { SocialSharing } from '@ionic-native/social-sharing';
@Component({
  selector: 'page-trending-page',
  templateUrl: 'trending-page.html'
})
export class TrendingPagePage {
  trendingData : Array<Object>;
  backButtonPressedOnceToExit:any;
  @ViewChild(Slides) slides: Slides;
  public navArrowBack : Boolean;
  public navArrowForwrd : Boolean;
  public lengthNews : any;

  constructor(public navCtrl: NavController,
              public toastCtrl : ToastController,
              public navParams: NavParams,
              public database: Database,
              public loading: LoadingController,
              public platform: Platform,
              public alertCtrl: AlertController,
              public http:HTTP,
              private socialSharing: SocialSharing,
              private network: Network,
              public toast : Toast) {
    this.platform.ready().then(() => {
    });
  }
    ionViewWillEnter() {
      this.slides.slideTo(0);
      if (this.slides.getActiveIndex() == 0)
      {
        this.navArrowBack = true;
      }

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

        let url = this.database.apiUrl + "Feed/getFeeds?FeedId="+this.database.userIdFromDB;
        let encodedUrl = encodeURI(url);
        console.log("encodedUrl", encodedUrl);
        this.http.get(encodedUrl, {}, {})
            .then(data => {
              loader.dismissAll();
              this.trendingData = [];
              this.trendingData = JSON.parse(data.data);
              this.lengthNews = this.trendingData.length;
              if(this.lengthNews == 0)
              {
                  this.toast.show("No news available", '5000', 'center').subscribe(
                      toast => {
                          console.log(toast);
                      });
              }
              console.log("data trending length ", this.lengthNews);

              // if (this.lengthNews == this.slides.getActiveIndex())
              // {
              //   this.navArrowForwrd = true;
              // }
              console.log("this.trendingData ", this.trendingData);
            })
            .catch(error => {


            });
      }

    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TrendingPagePage');
  }
  otherShare(link){
    this.socialSharing.share("Genral Share Sheet",null/*Subject*/,null/*File*/,link)
    .then(()=>{
      },
      ()=>{
      })
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
