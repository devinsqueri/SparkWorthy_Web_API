import { Component } from '@angular/core';
import { NavController,Platform,ToastController } from 'ionic-angular';
//pages
import { HomePagePage } from '../home-page/home-page';
import { AllContactsPagePage } from '../all-contacts-page/all-contacts-page';
import { TrendingPagePage } from '../trending-page/trending-page';
import { SettingsPagePage } from '../settings-page/settings-page';
import { Geolocation } from '@ionic-native/geolocation';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-home-tab',
  templateUrl: 'home-tab.html'
})

export class HomeTabPage {
  tab1Root: any = HomePagePage;
  tab2Root: any = AllContactsPagePage;
  tab3Root: any = TrendingPagePage;
  tab4Root: any = SettingsPagePage;
  bool = true;
  
  constructor(public navCtrl: NavController,public platform : Platform,
  public toastCtrl : ToastController,private geolocation: Geolocation,private http: HTTP) {

    this.tab1Root = HomePagePage;
    this.tab2Root = AllContactsPagePage;
    this.tab3Root = TrendingPagePage;
    this.tab4Root = SettingsPagePage;
  }
      ionViewWillEnter() {
        this.tab1Root = HomePagePage;
    this.tab2Root = AllContactsPagePage;
    this.tab3Root = TrendingPagePage;
    this.tab4Root = SettingsPagePage;

        console.log("View will enter on tab");
      }
}
