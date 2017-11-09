import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the SettingsModel page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings-model',
  templateUrl: 'settings-model.html'
})
export class SettingsModelPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public storage: Storage,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsModelPage');
  }
  closeModal() {
    this.storage.set("firstLaunch",false);

    this.viewCtrl.dismiss();
  }

}
