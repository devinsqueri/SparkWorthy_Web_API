import { Component,ViewChild } from '@angular/core';
import { Platform,NavController,ToastController,AlertController } from 'ionic-angular';
import { SignInPagePage } from '../pages/sign-in-page/sign-in-page';
import { Database } from '../providers/database';
import { Storage } from '@ionic/storage';
import { HomeTabPage } from '../pages/home-tab/home-tab';
import { ImgcacheService } from '../global/services';

@Component({
  templateUrl: 'app.html',
  providers: [Database],
   //prodMode: true
})
export class MyApp {
  rootPage: any;
  //nav:NavController;
  @ViewChild('myNav') nav: NavController;
  public checkSignIn() {
    this.storage.get('signin').then((name) => {
      if (name == "false") {
        this.rootPage = HomeTabPage;

        this.imgcacheService.initImgCache().then(() => {
          this.nav.setRoot(this.rootPage);
        });

      } else {
        this.rootPage = SignInPagePage;

        this.imgcacheService.initImgCache().then(() => {
          this.nav.setRoot(this.rootPage);
        });

      }
    });
  }


  constructor(public platform: Platform, public storage: Storage,
  public toastCtrl:ToastController,public alertCtrl :AlertController,public imgcacheService: ImgcacheService) {
    platform.ready().then(() => {
      console.log(this.storage.get("firstLaunch"));
      this.storage.get("firstLaunch").then((result)=>{
        if(result == null)
        {
          console.log("firstLaunch");
          this.storage.set("firstLaunch",true);
        }else
        {
          console.log("not firstLaunch");

        }
      },(err)=>{
        console.log("first launch error" + err);
      })

      this.checkSignIn();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      // Splashscreen.hide();
      //this.hideSplashScreen();
      // platform.registerBackButtonAction(() => {


      //       //uncomment this and comment code below to to show toast and exit app
      //       // if (this.backButtonPressedOnceToExit) {
      //       //   platform.exitApp();
      //       // } else if (this.nav.canGoBack()) {
      //       //   this.nav.pop({});
      //       // } else {
      //       //   this.showToast();
      //       //   this.backButtonPressedOnceToExit = true;
      //       //   setTimeout(() => {

      //       //     this.backButtonPressedOnceToExit = false;
      //       //   },2000)
      //       // }

      //       if(this.nav.canGoBack()){
      //         this.nav.pop();
      //       }else{
      //         this.showAlert();
      //       }
      //     });
    });
  }

  // hideSplashScreen() {
  //   if (this.splashScreen) {
  //     setTimeout(() => {
  //       this.splashScreen.hide();
  //     }, 5000);
  //   }
  // }
      showAlert() {
      let alert = this.alertCtrl.create({
        title: 'Exit?',
        message: 'Do you want to exit the app?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {

            }
          },
          {
            text: 'Exit',
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });
      alert.present();
    }


}
