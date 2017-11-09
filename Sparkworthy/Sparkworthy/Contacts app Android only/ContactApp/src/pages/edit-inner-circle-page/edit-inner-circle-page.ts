import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Database } from '../../providers/database';
// import { Select2OptionData } from 'ng2-select2';

@Component({
  selector: 'page-edit-inner-circle-page',
  templateUrl: 'edit-inner-circle-page.html'
})
export class EditInnerCirclePagePage {

// public exampleData: Array<Select2OptionData>;
    public interestAdded=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,public database : Database) {
    // this.exampleData = [
    //   {
    //     id: 'basic1',
    //     text: 'Basic 1'
    //   },
    //   {
    //     id: 'basic2',
    //     disabled: true,
    //     text: 'Basic 2'
    //   },
    //   {
    //     id: 'basic3',
    //     text: 'Basic 3'
    //   },
    //   {
    //     id: 'basic4',
    //     text: 'Basic 4'
    //   }
    // ];
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditInnerCirclePagePage');
  }  
}
