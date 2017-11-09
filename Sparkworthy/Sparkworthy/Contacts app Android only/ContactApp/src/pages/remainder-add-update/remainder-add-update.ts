import { Component } from '@angular/core';
import {NavController,LoadingController, NavParams, AlertController, Platform} from 'ionic-angular';
import { Database } from '../../providers/database';
import { HTTP } from '@ionic-native/http';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';

declare let Connection: any;
declare let navigator: any;
import * as moment from 'moment';

@Component({
    selector: 'page-remainder-add-update',
    templateUrl: 'remainder-add-update.html'
})
export class RemainderAddUpdatePage {

    navHeader : any;
    remainderInfo  = [];
    contactDetails :any;
    isUpdate : Boolean;
    boolTog:any;
    date:any;
    year:any;
    public bool:boolean;
    public activate:boolean = false;
    public showAlertMessage:any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public database : Database ,
                public alertCtrl : AlertController,
                public platform:Platform,
                public http:HTTP,
                public datepicker: DatePicker,
                private localNotifications: LocalNotifications,
                public loading: LoadingController,
                public toast : Toast,
                private network: Network) {

        this.navHeader = this.navParams.get('role');
        this.remainderInfo = [];
        let conn = this.network.type;
        console.log("connection" +conn);
        switch (this.navHeader)
        {
            case "Add Reminder":
                this.isUpdate = false;
                this.contactDetails = this.navParams.get('objectContact');
                this.bool  = true;
                this.boolTog = false;
                break;
            case "Update Reminder":
                this.isUpdate = true;
                this.boolTog = true;
                this.bool = true;
                this.remainderInfo = this.navParams.get('objectRemainder');
                this.contactDetails = this.navParams.get('objectContact');

                //this.setNotification();
                if(this.remainderInfo["IsActive"] >0)
                {
                    this.activate = true;
                }else
                {
                    this.activate  = false;
                }

                if( this.navParams.get('objectView') == false)
                {
                    this.bool = true;
                    this.boolTog = true;

                }else
                {
                    this.navHeader = "Reminder";
                    this.bool  = false;
                    this.boolTog = false;

                }
                //this.splitDateTime();
                break;
        }
    }
    ionViewCanLeave() {
        if(this.showAlertMessage) {
            let alertPopup = this.alertCtrl.create({
                title: 'Warning',
                message: 'All unsaved data will be lost',
                buttons: [{
                    text: 'Exit',
                    handler: () => {
                        alertPopup.dismiss().then(() => {
                            this.exitPage();
                        });
                    }
                },
                    {
                        text: 'Stay',
                        handler: () => {
                            // need to do something if the user stays?
                        }
                    }]
            });

            // Show the alert
            alertPopup.present();

            // Return false to avoid the page to be popped up
            return false;
        }
    }
    private exitPage() {
        this.showAlertMessage = false;
        this.navCtrl.pop();
    }
    transform(value: string): Date {
        let reggie = /(\d{4})-(\d{2})-(\d{2})/;
        let dateArray = reggie.exec(value);
        let dateObject = new Date(
            (+dateArray[1]),
            ((+dateArray[2])) - 1, // Careful, month starts at 0!
            (+dateArray[3])
        );
        return dateObject;
    }
    // setNotification()
    // {
    //     console.log("Notification"+ JSON.stringify(this.remainderInfo) );
    //     console.log("reminder date"+this.remainderInfo['Date']);
    //     console.log("reminder Time"+this.remainderInfo['Time']);
    //     let sam = this.remainderInfo['Date']+"T"+this.remainderInfo['Time']+":00.000Z";
    //
    //     let aa = this.transform(sam);
    //     console.log("aa"+aa);
    //     console.log("JSOnaa"+JSON.stringify(aa));
    //
    //     let t = new Date("2017-04-07T18:36");
    //     console.log("Time"+t);
    //     let d = new Date(this.remainderInfo['Date']);
    //     console.log("Date"+d);
    //
    //     this.localNotifications.schedule({
    //         text: 'Delayed ILocalNotification',
    //         at: t,
    //         led: 'FF0000',
    //         sound: null
    //     });
    //     console.log("Notification set");
    //
    // }
    splitDateTime()
    {
        let datetime:String = this.remainderInfo['SetTime'];
        let time = datetime.substr(11,9);
        let date = datetime.substr(0,10);
        this.remainderInfo['date'] = date;
        this.remainderInfo['time'] = time;

    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad RemainderAddUpdatePage');
    }
    ionViewWillEnter()
    {
        console.log('ionViewWillEnter AllContactsPagePage');
    }
    saveUpdateRemainder()
    {
        if(this.isUpdate == false)
        {
            this.saveRemainder();
        }
        else
        {
            this.updateRemainder();
        }
    }

    setIonicDateTime(value: string): Date {
        if (value) {
            let date: Date = new Date(value);
            let ionicDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
            return ionicDate;
        }
        return null;
    }
    getIonicDateTime(value: Date): string {
        if (value) {
            let date: Date = new Date(value);
            let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
            return ionicDate.toISOString();
        }
    }

    saveRemainder( )
    {
        this.remainderInfo['Description'] = this.remainderInfo['Description'];

        if(this.remainderInfo['Description'] == null || this.remainderInfo['Description'] == "" || this.remainderInfo['Description'] == " " || this.remainderInfo['Description'].trim() == "")
        {
            let alertPopup = this.alertCtrl.create({
                title: 'Warning',
                message: 'Please enter the reminder',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        alertPopup.dismiss().then(() => {
                        });
                    }
                },
                ]
            });

            // Show the alert
            alertPopup.present();

        }else
        if(this.remainderInfo['Date'] == null || this.remainderInfo['Date'] == "")
        {
            let alertPopup = this.alertCtrl.create({
                title: 'Warning',
                message: 'Please enter the date',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        alertPopup.dismiss().then(() => {
                        });
                    }
                },
                ]
            });

            // Show the alert
            alertPopup.present();


        }else if(this.remainderInfo['Time'] == null || this.remainderInfo['Time'] == "")
        {
            let alertPopup = this.alertCtrl.create({
                title: 'Warning',
                message: 'Please enter the time',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        alertPopup.dismiss().then(() => {
                        });
                    }
                },
                ]
            });

            // Show the alert
            alertPopup.present();

        }else
        {
            this.activate = true;
            let loader = this.loading.create({
                content: 'Saving...',
            });
            loader.present();

            if(this.contactDetails['lastname'] == null || this.contactDetails['lastname'] == "")
            {
                this.contactDetails['lastname'] = " ";
            }

            let reminActive;
            console.log(this.activate);
            if(this.activate == true)
            {
                reminActive = 1;
                this.setNotification();
                // this.sampleActivate();

            }else
            if(this.activate == false)
            {
                reminActive = 0;
            }else
            {
                reminActive = 0;
            }
            this.platform.ready().then(() => {

                if(this.remainderInfo['ShortNote'] == null || this.remainderInfo['ShortNote'] =="")
                {
                    this.remainderInfo['ShortNote'] = "";
                }
                this.http.get("", {}, {})
                    .then(datafrmapi => {
                    });

                let networkState = this.network.type;
                let conn = this.network.type;
                if (networkState === Connection.NONE) {
                    this.database.addRemainder(this.contactDetails['contactid'],this.remainderInfo['Description'],
                        this.remainderInfo['ShortNote'],this.remainderInfo['Date'],this.remainderInfo['Time'],reminActive).then((result)=>{
                        console.log("OFFLINE: Reminder added");
                        this.bool = false;
                        this.boolTog = true;
                        this.toast.show("Reminder added for "+this.contactDetails['firstname']+ " " +this.contactDetails['lastname'], '5000', 'center').subscribe(
                            toast => {
                                console.log(toast);
                            });
                        loader.dismissAll();
                        this.navCtrl.pop();
                    },(error)=> {
                        loader.dismissAll();

                    });
                }else
                {
                    let url = this.database.apiUrl+"Reminder/saveReminder?ReminderId=0&ContactId="+this.contactDetails['contactidext']+"&Command="+this.remainderInfo['Description']+"&Notes="+this.remainderInfo['ShortNote']+"&SetTime="+this.remainderInfo['Time']+"&SetDate="+this.remainderInfo['Date']+"&ReminderON="+this.activate;
                    let encodedUrl = encodeURI(url);
                    console.log(encodedUrl);

                    this.http.get(encodedUrl, {}, {})
                        .then(datafrmapi => {
                            console.log("Reminder added through http api");
                            console.log("Result from server",datafrmapi);
                            // update contactidext and ifsync
                            let aa = JSON.parse(datafrmapi.data);
                            this.database.addRemainderWhenOnline(this.contactDetails['contactid'],this.remainderInfo['Description'],
                                this.remainderInfo['ShortNote'],this.remainderInfo['Date'],this.remainderInfo['Time'],aa,reminActive).then((result)=>{
                                loader.dismissAll();

                                this.navCtrl.pop();
                                this.toast.show("Reminder added for "+this.contactDetails['firstname']+ " " +this.contactDetails['lastname'], '5000', 'center').subscribe(
                                    toast => {
                                        console.log(toast);
                                    });
                                this.bool = false;
                                this.boolTog = true;
                            },(error)=> {
                                loader.dismissAll();

                            });
                        })
                        .catch(error => {
                            console.log(error);
                            this.database.addRemainder(this.contactDetails['contactid'],this.remainderInfo['Description'],
                                this.remainderInfo['ShortNote'],this.remainderInfo['Date'],this.remainderInfo['Time'],reminActive).then((result)=>{
                                loader.dismissAll();
                                console.log("OFFLINE: Reminder added");
                                this.toast.show("Reminder added for "+this.contactDetails['firstname']+ " " +this.contactDetails['lastname'], '5000', 'center').subscribe(
                                    toast => {
                                        console.log(toast);
                                    });
                                this.navCtrl.pop();

                                this.bool = false;
                                this.boolTog = true;
                            },(error)=> {
                                loader.dismissAll();

                            });
                            loader.dismissAll();

                            console.log(error.status);
                            console.log(error.error); // error message as string
                            console.log(error.headers);
                        });
                }
            });
        }

        //let date = new Date().toLocaleString();
        //let ad = this.setIonicDateTime(date);

    }
    showcalenderDate()
    {
        this.datepicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datepicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK

        }).then((date) => {

            console.log('Got date: ', date);
            let month : any;
            let day : any;
            let year : any;
            let strDate = date.toLocaleDateString();
            console.log('strDate.substr(3,1)=="/"',strDate.substr(3,1)=="/");

            if((strDate.substr(1,1)=="/")&&(strDate.substr(3,1)=="/"))
            {
                month = strDate.substr(0,1);
                day = strDate.substr(2,1);
                year = strDate.substr(4,4);
            }else if((strDate.substr(5,1)=="/")&&(strDate.substr(3,1)))
            {
                month = strDate.substr(0,2);
                day = strDate.substr(3,2);
                year = strDate.substr(6,4);

            }else if((strDate.substr(1,1)=="/") && (strDate.substr(4,1)=="/") )
            {
                month = strDate.substr(0,1);
                day = strDate.substr(2,2);
                year = strDate.substr(5,4);
            }else if((strDate.substr(2,1)=="/") && (strDate.substr(4,1)=="/") )
            {
                month = strDate.substr(0,2);
                day = strDate.substr(3,1);
                year = strDate.substr(5,4);

            }
            if (month.length == 1)
            {
                month = "0"+month
            }
            if(day.length == 1)
            {
                day = "0"+day
            }
            let fulldate = year + "-" + month +"-"+ day;
            console.log("full date" + fulldate);
            this.remainderInfo['Date'] = fulldate;
        }, (err) => {
            console.log('Error occurred while getting date: ', err)
        });
    }
    showcalenderTime()
    {
        this.datepicker.show({
            date: new Date(),
            mode: 'time',
            androidTheme: this.datepicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK

        }).then((date) => {
            console.log('Got date: ',date );
            let time = date.toTimeString();
            console.log('Got time time: ',time );

            let strDate = time.substring(0,5);
            var dt = moment(strDate, ["HH:mm"]).format("h:mm A");
            console.log("Time moment" + dt);

            this.remainderInfo['Time'] = dt;
        }, (err) => {
            console.log('Error occurred while getting date: ', err)
        });
    }
    public getHrFormat(time)
    {
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice (1);  // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
    }
    updateRemainder()
    {
        this.remainderInfo['Description'] = this.remainderInfo['Description'];

        if(this.remainderInfo['Description'] == null || this.remainderInfo['Description'] == "" || this.remainderInfo['Description']== " ")
        {
            let alertPopup = this.alertCtrl.create({
                title: 'Warning',
                message: 'Please enter the reminder',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        alertPopup.dismiss().then(() => {
                        });
                    }
                },
                ]
            });

            // Show the alert
            alertPopup.present();

        }else
        if(this.remainderInfo['Date'] == null || this.remainderInfo['Date'] == "")
        {
            let alertPopup = this.alertCtrl.create({
                title: 'Warning',
                message: 'Please enter the date',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        alertPopup.dismiss().then(() => {
                        });
                    }
                },
                ]
            });

            // Show the alert
            alertPopup.present();


        }else if(this.remainderInfo['Time'] == null || this.remainderInfo['Time'] == "")
        {
            let alertPopup = this.alertCtrl.create({
                title: 'Warning',
                message: 'Please enter the time',
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        alertPopup.dismiss().then(() => {
                        });
                    }
                },
                ]
            });

            // Show the alert
            alertPopup.present();

        }else
        {
            this.http.get("", {}, {})
                .then(datafrmapi => {
                });
            let loader = this.loading.create({
                content: 'Saving...',
            });
            loader.present();
            let reminActive;
            console.log(this.activate);
            if(this.activate == true)
            {
                reminActive = 1;
                this.setNotification();
                // this.sampleActivate()
            }else
            if(this.activate == false)
            {
                reminActive = 0;
                this.cancelNotification();
            }else
            {
                reminActive = 0;
                this.cancelNotification();

            }
            let networkState = this.network.type;
            this.showAlertMessage = false;
            if(this.remainderInfo['ShortNote'] == null || this.remainderInfo['ShortNote'] =="")
            {
                this.remainderInfo['ShortNote'] = "";
            }
            if (networkState === Connection.NONE) {
                this.database.updateRemainder(this.remainderInfo['Description'],
                    this.remainderInfo['ShortNote'],this.remainderInfo['Date'],this.remainderInfo['Time'],this.remainderInfo['RemainderId'],reminActive).then((result)=>{

                    console.log("OFFLINE:Reminder updated");

                    this.bool = false;
                    this.boolTog = false;
                    this.navHeader = "Reminder";
                    loader.dismissAll();
                    this.toast.show("Reminder updated successfully", '5000', 'center').subscribe(
                        toast => {
                            console.log(toast);
                        });

                },(error)=> {
                    console.log("ERROR: ", error);
                    loader.dismissAll();

                });
            }else
            {

                let url = this.database.apiUrl+"Reminder/saveReminder?ReminderId="+this.remainderInfo['RemainderIdFrmExt']+"&ContactId="+this.contactDetails['contactidext']+"&Command="+this.remainderInfo['Description']+"&Notes="+this.remainderInfo['ShortNote']+"&SetTime="+this.remainderInfo['Time']+"&SetDate="+this.remainderInfo['Date']+"&ReminderON="+this.activate;
                let encodedUrl = encodeURI(url);
                console.log(encodedUrl);
                this.http.get(encodedUrl, {}, {})
                    .then(datafrmapi => {
                        // update contactidext and ifsync
                        let aa = JSON.parse(datafrmapi.data);
                        if(this.database.development == true)
                        {
                            let alert1 = this.alertCtrl.create({
                                title: "reminder added through api.",
                                subTitle:"Result returned :"+aa,
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
                        console.log("Reminder updated through http api");

                    })
                    .catch(error => {
                        console.log(error.error);
                        // this.database.updateRemainderOnline(this.remainderInfo['Description'],
                        //     this.remainderInfo['ShortNote'],this.remainderInfo['Date'],this.remainderInfo['Time'],this.remainderInfo['RemainderId'],reminActive).then((result)=>{
                        //     this.bool = false;
                        //     this.navHeader = "Reminder";
                        //     let alert = this.alertCtrl.create({
                        //         title: "Success",
                        //         subTitle: "Reminder edited successfully.",
                        //         buttons: [
                        //             {
                        //                 text: 'Ok',
                        //                 handler: data => {
                        //                     //this.navCtrl.pop();
                        //                 }
                        //             }
                        //         ]
                        //     });
                        //     alert.present();
                        //
                        //
                        // },(error)=> {
                        //     console.log("ERROR: ", error);
                        // });
                    })



                this.database.updateRemainder(this.remainderInfo['Description'],
                    this.remainderInfo['ShortNote'],this.remainderInfo['Date'],this.remainderInfo['Time'],this.remainderInfo['RemainderId'],reminActive).then((result)=>{
                    this.bool = false;
                    this.boolTog = false;
                    this.navHeader = "Reminder";
                    loader.dismissAll();

                    this.toast.show("Reminder updated successfully", '5000', 'center').subscribe(
                        toast => {
                            console.log(toast);
                        });

                },(error)=> {
                    loader.dismissAll();

                    console.log("ERROR: ", error);
                });
            }
        }
    }
    sampleActivate()
    {
        console.log("sampleActivate");
        console.log(new Date(new Date().getTime() + 5 * 1000));
        this.localNotifications.schedule({
            id: 1,
            at: new Date(new Date().getTime() + 5 * 1000),
            text: 'Single ILocalNotification',
            // sound: 'file://assets/Images/alarm.mp3',
        });
    }
    changeToEditView()
    {
        this.navHeader = "Update Reminder";
        this.showAlertMessage = true;
        this.bool = true;
        this.boolTog  = true;
    }
    setNotification()
    {
        var dt = moment(this.remainderInfo['Time'], ["h:mm A"]).format("HH:mm:ss");
        let date = this.remainderInfo['Date'] + "T" +dt;
        let mm = moment.parseZone(date).utc().format();
        let now = moment.parseZone().local().format();
        let current = now.substr(0,16) +":00Z";
        let ionicdateNow = this.database.setIonicDateTime(current);
        console.log("ionicdateNow"+ionicdateNow);
        let ionicdate = this.database.setIonicDateTime(mm);
        // this.setNotificationTutorial(ionicdate);
        console.log("ionic date"+ionicdate);

        let currentTime = moment.now();
        console.log("Current time"+currentTime);
        if(ionicdate > ionicdateNow)
        {
            console.log("Time is greater");
            this.localNotifications.isScheduled(this.remainderInfo['Id']).then((res)=>{
                console.log("res"+res);
                //this.localNotifications.cancel(this.remainderInfo['Id']);
            });
            let platform = this.platform.version();

            console.log(platform.major);
            //for android
            // if(platform.major >= 7)
            // {
            //     this.localNotifications.schedule({
            //         id:this.remainderInfo['Id'],
            //         title: this.contactDetails['firstname'] + " " + this.contactDetails['lastname'] +":"+ this.remainderInfo['Description'],
            //         text: this.remainderInfo['ShortNote'],
            //         at: ionicdate,
            //
            //         sound: 'res://platform_default',
            //         led: 'FF0000'
            //     });
            //
            // }else
            // {
                this.localNotifications.schedule({
                    id:this.remainderInfo['RemainderId'],
                    title: this.contactDetails['firstname'] + " " + this.contactDetails['lastname'] +":"+ this.remainderInfo['Description'],
                    text: this.remainderInfo['ShortNote'],
                    at: ionicdate,
                    sound: 'file://assets/Images/alarm.mp3',
                    led: 'FF0000'
                });
            // }
            //for ios
            // this.localNotifications.schedule({
            //     id:this.remainderInfo['RemainderId'],
            //     title: this.remainderInfo['Description'],
            //     text: this.remainderInfo['ShortNote'],
            //     at: ionicdate,
            //     sound: 'file://assets/Images/alarm.mp3',
            //     led: 'FF0000'
            // });

            console.log("Notification set");

        }else
        {
            console.log("Time is lesser");
        }
        // console.log("MAnual date"+datenew);
    }
    // setNotificationTutorial(date)
    // {
    //     let currentDate = new Date();
    //     let currentDay = currentDate.getDay();
    //
    //     let firstNotificationTime = new Date();
    //     let dayDifference = date.getDay() - currentDay;
    //     if(dayDifference < 0){
    //         dayDifference = dayDifference + 7; // for cases where the day is in the following week
    //     }
    //     firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
    //     firstNotificationTime.setHours(date.getHours());
    //     firstNotificationTime.setMinutes(date.getMinutes());
    //
    //     let notification = {
    //         id: currentDate.getDay(),
    //         title: 'Hey!',
    //         text: 'You just got notified :)',
    //         at: firstNotificationTime,
    //         every: 'week'
    //     };
    //
    //     this.localNotifications.schedule(notification);
    // }
    cancelNotification()
    {

        this.localNotifications.isScheduled(this.remainderInfo['RemainderId']).then((res)=>{
            console.log("Notifation found"+res);
            this.localNotifications.clear(this.remainderInfo['RemainderId']);
            this.localNotifications.cancel(this.remainderInfo['RemainderId']);
        },(err)=>{
            console.log("Notification not found");
            console.log(err);
        });
    }

}
