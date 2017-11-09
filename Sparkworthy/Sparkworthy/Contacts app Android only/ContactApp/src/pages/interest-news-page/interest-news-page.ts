import { Component } from '@angular/core';
import { NavController, NavParams ,LoadingController ,AlertController} from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Database } from '../../providers/database';

/*
  Generated class for the InterestNewsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare let Connection: any;

@Component({
  selector: 'page-interest-news-page',
  templateUrl: 'interest-news-page.html'
})
export class InterestNewsPagePage {
  public navArrowBack : Boolean;
  public navArrowForwrd : Boolean;
  public lengthNews : any;
  trendingData : Array<Object>;
  contactDetails = [];
  @ViewChild(Slides) slides: Slides;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loading: LoadingController,
              public http:HTTP,
              private socialSharing: SocialSharing,
              private network: Network,
              public toast : Toast,
              public alertCtrl: AlertController,
              public database: Database
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterestNewsPagePage');
  }
  ionViewWillEnter() {
      this.contactDetails = this.navParams.get('object');

      if (this.slides.getActiveIndex() == 0)
    {
      this.navArrowBack = true;
    }
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

      let url = this.database.apiUrl + "Feed/getContactFeeds?ContactId=" + this.contactDetails['contactidext'];
      let encodedUrl = encodeURI( url );
      console.log("encodedUrl" , encodedUrl);
      this.http.get(encodedUrl , {} , {})
          .then(data => {
            loader.dismissAll();

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
            if (this.lengthNews == this.slides.getActiveIndex())
            {
              this.navArrowForwrd = true;
            }
            console.log("this.trendingData ", this.trendingData);
          })
          .catch(error => {
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
