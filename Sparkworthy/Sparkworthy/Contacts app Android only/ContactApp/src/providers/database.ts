import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// import {first} from "rxjs/operator/first";
import { HTTP } from '@ionic-native/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Toast } from '@ionic-native/toast';
import {first} from "rxjs/operator/first";

declare var cordova: any
@Injectable()
export class Database {

  public load:boolean = true;
  public numberOfContactBool: boolean;
  //private storage: SQLite;
  public isOpen: boolean;
  public userIdFromDB;
  public userEmail;
  public timeNow = new Date();
  public noOfCon: any;
  public contactInGroupContact = [];
  public interestOfContact = [];
  public remainderofcontact = [];
  public launchedFirst = null;
  public development = false;
  // public apiUrl = "http://182.71.233.135:92/api/";
  public apiUrl = "http://comp-view.com/SparkWorthy/api/";

  public contactAddedToGroup : boolean;
  public numOfCon ;
  public sentientApiUrl = "http://comp-view.com/SparkWorthy/api/";
  public contactAdded: Boolean = true;
  public groupAdded: Boolean = true;
  public performGroupContactFetch: Boolean = false;
  public contactEndBool: boolean;
  public groupEndBool: boolean;
  storageDirectory: string;

  public staticUrlContact = "http://182.71.233.135:92/api/" + "UploadImages/Contacts/";
  public staticUrlGroup = "http://182.71.233.135:92/api/" + "UploadImages/Groups/";
  public staticUrlUSers = "http://comp-view.com/SparkWorthy/UploadImages/Users/";


  // public staticUrlContact = "http://comp-view.com/SparkWorthy/" + "UploadImages/Contacts/";
  // public staticUrlGroup = "http://comp-view.com/SparkWorthy/" + "UploadImages/Groups/";
  // public staticUrlUSers = "http://comp-view.com/SparkWorthy/" + "UploadImages/Users/";
  public storage: SQLiteObject;

  constructor (public sqlite: SQLite, public http: HTTP, public sqliteporter: SQLitePorter,private toast: Toast) {
    this.createDatabase();
  }

  public createDatabase () {
    if (!this.isOpen) {

      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        this.storage = db;
        db.executeSql("CREATE TABLE IF NOT EXISTS User (UserId INTEGER, Name TEXT, PhoneNumber INTEGER , Email TEXT ," +
            "Company TEXT , CompanyWebSiteFeed TEXT , Position TEXT , Country TEXT , City TEXT , State TEXT , " +
            "ZipCode INTEGER,BirthdayOn DATE , Interest TEXT,ProfilePicture TEXT , CreatedOn DATE , ModifiedOn DATE , IfSync INTEGER)", []);
        this.isOpen = true;
      });

      //contact table creation
      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS Contact (UserId INTEGER , ContactId INTEGER PRIMARY KEY AUTOINCREMENT,ContactIdExt INTEGER UNIQUE , Firstname TEXT," +
            "Lastname TEXT, Email TEXT , PhoneNumber INTEGER , OfficeNumber INTEGER , Position TEXT , " +
            "Company TEXT , Favorites INTEGER ,Profession TEXT,Anniversary DATE,BirthdayOn DATE,RelationShip TEXT,Notes TEXT,ProfilePicture TEXT, CreatedOn DATE , ModifiedOn DATE,IfSync INTEGER,UpdateSync INTEGER,Location TEXT)", []);
        this.isOpen = true;
      });
      //group table creation
      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS GroupTable (UserId INTEGER , GroupId INTEGER PRIMARY KEY AUTOINCREMENT , GroupIdExt INTEGER UNIQUE , GroupName TEXT," +
            "ProfilePicture TEXT,CreatedOn DATE , ModifiedOn DATE,IfSync INTEGER)", []);
        this.isOpen = true;
      });

      //group contact
      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS GroupContact (GroupContactId INTEGER PRIMARY KEY AUTOINCREMENT,GroupContactIdExt INTEGER, GroupId INTEGER , " +
            "ContactId INTEGER,GroupName TEXT , CreatedOn DATE , ModifiedOn DATE,IfSync INTEGER)", []);
        this.isOpen = true;
      });

      //remainder table creation
      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS RemainderTable (UserId INTEGER , ContactId INTEGER , RemainderId INTEGER PRIMARY KEY AUTOINCREMENT,RemainderIdFrmExt INTEGER UNIQUE, Description TEXT ," +
            " ShortNote TEXT ,Date DATE,Time TIME, SetTime DATETIME ,CreatedOn DATE , ModifiedOn DATE, IsActive INTEGER,IfSync INTEGER,UpdateSync INTEGER)", []);
        this.isOpen = true;
      });
      //interest table creation

      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS InterestTable (id INTEGER PRIMARY KEY AUTOINCREMENT,ContactId INTEGER,ContactIdExt INTEGER ,InterestedId INTEGER,InterestIdExt INTEGER , InterestName TEXT,PictureLocation TEXT ," +
            "CreatedOn DATE,IfSync INTEGER)", []);
        this.isOpen = true;
      });

      //available interest and their id's are store in InterestListTable
      //Interest list table
      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS InterestList (id INTEGER PRIMARY KEY,InterestId INTEGER UNIQUE,InterestName TEXT,PictureLocation TEXT)", []);
        this.isOpen = true;
      });

      //innercircle table creation
      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS InnerCircleTable (id INTEGER PRIMARY KEY AUTOINCREMENT,InnerCircleIdExt INTEGER UNIQUE,Firstname TEXT,Lastname TEXT,ContactId INTEGER ," +
            "BirthdayOn DATE,Profession TEXT,Relation TEXT,Anniversary TEXT,Notes TEXT,CreatedOn DATE, ModifiedOn DATE,IfSync INTEGER,UpdateSync INTEGER,Company TEXT)", []);
        this.isOpen = true;
      });

      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS ContactDelete (id INTEGER PRIMARY KEY,ContactId INTEGER)", []);
        this.isOpen = true;
      });

      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS GroupDelete (id INTEGER PRIMARY KEY,GroupId INTEGER)", []);
        this.isOpen = true;
      });

      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS RemainderDelete (id INTEGER PRIMARY KEY,RemianderId INTEGER)", []);
        this.isOpen = true;
      });

      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS GroupContactDelete (id INTEGER PRIMARY KEY,ContactId INTEGER,GroupId INTEGER)", []);
        this.isOpen = true;
      });
      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS InnerCircleDelete (id INTEGER PRIMARY KEY,InnerCircleId INTEGER)", []);
        this.isOpen = true;
      });
      this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
        db.executeSql("CREATE TABLE IF NOT EXISTS InterestDelete (id INTEGER PRIMARY KEY,ContactId INTEGER,InterestId INTEGER)", []);
        this.isOpen = true;
      });
    }
  }

    public createDatabaseUser () {

            this.sqlite.create({name: "data.db", location: "default"}).then((db: SQLiteObject) => {
                this.storage = db;
                db.executeSql("CREATE TABLE IF NOT EXISTS User (UserId INTEGER, Name TEXT, PhoneNumber INTEGER , Email TEXT ," +
                    "Company TEXT , CompanyWebSiteFeed TEXT , Position TEXT , Country TEXT , City TEXT , State TEXT , " +
                    "ZipCode INTEGER,BirthdayOn DATE , Interest TEXT,ProfilePicture TEXT , CreatedOn DATE , ModifiedOn DATE , IfSync INTEGER)", []);
                this.isOpen = true;
            });
    }

  public deleteDatabase () {
    //cordova.plugins.sqlitePorter
    this.sqliteporter.wipeDb(this.storage).then((result) => {
      console.log(result);
    }, (error) => {
      console.log(error);
    })
  }

  getContactExt(id)
  {
    return new Promise((resolve, reject) => {
      //this.sqlite.

      this.storage.executeSql("SELECT * FROM Contact WHERE ContactId=?", [id]).then((data) => {

        resolve(data.rows.item(0).ContactIdExt);
      }, (error) => {
        reject(error);
      });
    });

  }
  /*
   * @discussion - add new contact
   * @param
   * @return
   */

  public getUser () {
    return new Promise((resolve, reject) => {
      //this.sqlite.

      this.storage.executeSql("SELECT * FROM User", []).then((data) => {
        let user = [];
        if (data.rows.length > 0) {

          for (let i = 0; i < data.rows.length; i++) {
            user.push({
              UserId: data.rows.item(i).UserId,
              Name: data.rows.item(i).Name,
              Company: data.rows.item(i).Company,
              PhoneNumber: data.rows.item(i).PhoneNumber,
              City: data.rows.item(i).City,
              ProfilePicture: data.rows.item(i).ProfilePicture,

            });
          }
        }
        resolve(user);
      }, (error) => {
        reject(error);
      });
    });
  }

  public updateUserProPic (profile, userid) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE User SET ProfilePicture=? WHERE UserId = ?", [profile, userid]).then((data) => {

        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - add user to user table if signin is successful
   * @param - 14 parameters
   * @return
   */
  public addToUserTable (name, phonenumber, email, company, companywebfeed, position, country, city, state, zipcode, profilepic) {
    let sync = 1;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO User (UserId,Name,PhoneNumber,Email,Company," +
          "CompanyWebSiteFeed,Position,Country,City,State," +
          "ZipCode,CreatedOn,ModifiedOn,IfSync,ProfilePicture) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [this.userIdFromDB, name, phonenumber,
        email, company, companywebfeed, position, country, city, state, zipcode, this.timeNow, this.timeNow, sync, profilepic]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public updateUserInLocalDB (name, companyname, currentlocation, userid) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE User SET Name=?,Company=?," +
          "City=?,ModifiedOn=? WHERE UserId = ?", [name, companyname, currentlocation, this.timeNow, userid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public reminderCheck()
  {
    // this.storage.executeSql()
  }


    public checkWhetherContactExist(ph)
    {
        return new Promise((resolve, reject) => {
            this.storage.executeSql("SELECT * FROM Contact WHERE PhoneNumber=?",[ph]).then((data)=>{
                console.log(data);
                if (data.rows.length>0)
                {
                    if(ph == "" || ph == " " || ph.trim() == "" || ph.trim() == " ")
                    {
                        reject(false);
                    }else
                    {
                        console.log("Contact exist");

                        resolve("true");
                    }
                }else
                {
                    reject("false")
                }

            },(error)=>{
                reject("false")
            })
        });
    }


  public checkWhetherContactExistAcc(ph,first,last)
  {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM Contact WHERE PhoneNumber=?",[ph]).then((data)=>{
        console.log(data);
        if (data.rows.length>0)
        {
          if(ph == "" || ph == " " || ph.trim() == "" || ph.trim() == " ")
          {
            reject(false);
          }else
          {
            console.log("Contact exist");

              let contactid = data.rows.item(0).ContactId;
              let contactidext = data.rows.item(0).ContactIdExt;
              let email = data.rows.item(0).Email;
              let phonenumber = data.rows.item(0).PhoneNumber;
              let officenumber = data.rows.item(0).OfficeNumber;
              let position = data.rows.item(0).Position;
              let company = data.rows.item(0).Company;
              let favorites = data.rows.item(0).Favorites;
              let profession = data.rows.item(0).Profession;
              let anniversary = data.rows.item(0).Anniversary;
              let profilepic = data.rows.item(0).ProfilePicture;
              let birthday = data.rows.item(0).BirthdayOn;
              let relationship = data.rows.item(0).RelationShip;
              let notes = data.rows.item(0).Notes;
              let createdon = data.rows.item(0).CreatedOn;
              let modifiedon = data.rows.item(0).ModifiedOn;
              let ifsync = data.rows.item(0).IfSync;
              let firstname = data.rows.item(0).Firstname
              let lastname = data.rows.item(0).Lastname;
              let location = data.rows.item(0).Location;
              let fav;
              if (favorites > 0) {
                  fav = true;
              } else {
                  fav = false
              }
              if (lastname == null || lastname == "") {
                  lastname = "";
              }
              if (email == null || email == "") {
                  email = "";
              }
              if (phonenumber == null || phonenumber == "" || phonenumber == " ") {
                  phonenumber = "";
              }
              if (officenumber == null || officenumber == "") {
                  officenumber = "";
              }
              if (position == null || position == "") {
                  position = "";
              }
              if (company == null || company == "") {
                  company = "";
              }
              if (birthday == null || birthday == "") {
                  birthday = "";
              }
              if (relationship == null || relationship == "") {
                  relationship = "";
              }
              if (notes == null || notes == "") {
                  notes = "";
              }
              if (profession == null || profession == "") {
                  profession = "";
              }
              if (anniversary == null || anniversary == "") {
                  anniversary = "";
              }
              if (location == null || location == "") {
                  location = "";
              }
              // if(firstname+lastname == first+last)
              // {
              //
              // }else
              // {
              if(first == null || first == "")
              {
                  resolve("true");

              }else
              {
                  let req = this.apiUrl + "Contact/Save?ContactId=" + contactidext + "&UserId=" + this.userIdFromDB +
                      "&FirstName=" + first + "&LastName="+last+"&EMail="+email+"&PhNo=" + ph + "&OfficeNo="+officenumber+"&Position="+position+"&Company="+company+"&Relative="+relationship+"&Profilepic=&DOB="+birthday+"&Fav="+fav+"&FavRating="+favorites+"&Notes="+notes+"&ModifyOn=" + "01-01-2017" + "&Profession="+profession+"&AnnivasaryOn="+anniversary+"&Location="+location;

                  let url = encodeURI(req);


                  console.log(url);
                  this.http.get(url, {}, {})
                      .then(datafrmapi => {
                          console.log("Contact edited through api");
                          console.log("Result from server", datafrmapi);
                          this.updateNameOfContact(first,last,contactidext);

                      }).catch((error)=>{

                  });
              }


              // }

              resolve("true");
          }
        }else
        {
          reject("false")
        }

      },(error)=>{
        reject("false")
      })
    });
  }
  public updateNameOfContact(fistname,lastname,contactidext)
  {
      return new Promise((resolve, reject) => {
          let ifsync = 0;

          this.storage.executeSql("UPDATE Contact SET Firstname=?,Lastname=?,IfSync=?,UpdateSync=? WHERE ContactIdExt = ?", [fistname,lastname,1,1,contactidext]).then((data) => {
              console.log("sqlite result");
              resolve(data);
          }, (error) => {
              console.log("edit sqlite error"+error);
              reject(error);
          });
      });
  }
    public checkWhetherContactExistSync(ph,name,last)
    {
        return new Promise((resolve, reject) => {
            this.storage.executeSql("SELECT * FROM Contact WHERE Firstname=?",[name]).then((data)=>{


                if (data.rows.length>0)

                { for (let i = 0; i < data.rows.length; i++) {

                    console.log(data.rows.item(i));

                    let contactid = data.rows.item(i).ContactId;
                    let contactidext = data.rows.item(i).ContactIdExt;
                    let email = data.rows.item(i).Email;
                    let phonenumber = data.rows.item(i).PhoneNumber;
                    let officenumber = data.rows.item(i).OfficeNumber;
                    let position = data.rows.item(i).Position;
                    let company = data.rows.item(i).Company;
                    let favorites = data.rows.item(i).Favorites;
                    let profession = data.rows.item(i).Profession;
                    let anniversary = data.rows.item(i).Anniversary;
                    let profilepic = data.rows.item(i).ProfilePicture;
                    let birthday = data.rows.item(i).BirthdayOn;
                    let relationship = data.rows.item(i).RelationShip;
                    let notes = data.rows.item(i).Notes;
                    let createdon = data.rows.item(i).CreatedOn;
                    let modifiedon = data.rows.item(i).ModifiedOn;
                    let ifsync = data.rows.item(i).IfSync;
                    let firstname = data.rows.item(i).Firstname
                    let lastname = data.rows.item(i).Lastname;
                    let location = data.rows.item(i).Location;
                    let fav;
                    if (favorites > 0) {
                        fav = true;
                    } else {
                        fav = false
                    }
                    if (lastname == null || lastname == "") {
                        lastname = "";
                    }
                    if (email == null || email == "") {
                        email = "";
                    }
                    if (phonenumber == null || phonenumber == "" || phonenumber == " ") {
                        phonenumber = "";
                    }
                    if (officenumber == null || officenumber == "") {
                        officenumber = "";
                    }
                    if (position == null || position == "") {
                        position = "";
                    }
                    if (company == null || company == "") {
                        company = "";
                    }
                    if (birthday == null || birthday == "") {
                        birthday = "";
                    }
                    if (relationship == null || relationship == "") {
                        relationship = "";
                    }
                    if (notes == null || notes == "") {
                        notes = "";
                    }
                    if (profession == null || profession == "") {
                        profession = "";
                    }
                    if (anniversary == null || anniversary == "") {
                        anniversary = "";
                    }
                    if (location == null || location == "") {
                        location = "";
                    }

                    let n = firstname + lastname;
                    let d = name + last;
                    console.log(firstname);
                    console.log(lastname);
                    console.log(last);
                    console.log(name);

                    if (name != null)
                    {
                        if (last == "" || last == null) {
                            if (firstname == name) {
                                if (ph == phonenumber) {
                                    resolve("");

                                } else {
                                    this.updateContactOnAccSync(firstname, lastname, email, ph, officenumber, position, company, relationship, birthday, fav, favorites, notes, profession, anniversary, location, contactidext);
                                    resolve("");
                                }
                            } else {
                                console.log("first name and last name are not same");
                                reject("");
                            }
                        } else {
                            if (n == d) {
                                if (ph == phonenumber) {
                                    resolve("");

                                } else {
                                    this.updateContactOnAccSync(firstname, lastname, email, ph, officenumber, position, company, relationship, birthday, fav, favorites, notes, profession, anniversary, location, contactidext);
                                    resolve("");
                                }
                            } else {
                                console.log("first name and last name are not same");
                                reject("");
                            }
                        }
                    }else {
                        resolve("");
                    }
                }
                }else
                {
                    reject("false");
                }

            },(error)=>{
                reject("false");
            });
        });
    }
    updateContactOnAccSync(firstname,lastname,email,ph,officenumber,position,company,relationship,birthday,fav,favorites,notes,profession,anniversary,location,contactidext) {

        let req = this.apiUrl + "Contact/Save?ContactId=" + contactidext + "&UserId=" + this.userIdFromDB +
            "&FirstName=" + firstname + "&LastName="+lastname+"&EMail="+email+"&PhNo=" + ph + "&OfficeNo="+officenumber+"&Position="+position+"&Company="+company+"&Relative="+relationship+"&Profilepic=&DOB="+birthday+"&Fav="+fav+"&FavRating="+favorites+"&Notes="+notes+"&ModifyOn=" + "01-01-2017" + "&Profession="+profession+"&AnnivasaryOn="+anniversary+"&Location="+location;

        let url = encodeURI(req);


        console.log(url);
        this.http.get(url, {}, {})
            .then(datafrmapi => {
                console.log("Contact edited through api");
                console.log("Result from server", datafrmapi);
                this.editContactAcc(ph,contactidext);

            }).catch((error)=>{

        });
    }
    public editContactAcc ( phonenumber, contactid) {
        return new Promise((resolve, reject) => {
            let ifsync = 0;

            this.storage.executeSql("UPDATE Contact SET PhoneNumber=?,IfSync=?,UpdateSync=? WHERE ContactIdExt = ?", [phonenumber,1,1,contactid]).then((data) => {
                console.log("sqlite result");
                resolve(data);
            }, (error) => {
                console.log("edit sqlite error"+error);
                reject(error);
            });
        });
    }
  /*
   * @discussion - add new contact
   * @param
   * @return
   */
  public addContact (firstname, lastname, email, phonenumber, officenumber, position, company, dob, relationship, notes, profession, anniversary,location) {
    let fav = 0;
    console.log("Contact added in offline");
    //this.getNumberOfContacts();
    let sync = 0;
    let sam = "assets/Images/profile.jpg";
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO Contact (UserId,Firstname,Lastname," +
          "Email,PhoneNumber,OfficeNumber,Position," +
          "Company,Favorites,BirthdayOn,Profession,Anniversary,RelationShip,ProfilePicture,Notes,CreatedOn,ModifiedOn,IfSync,UpdateSync,Location) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [this.userIdFromDB,
        firstname, lastname, email, phonenumber, officenumber, position, company, fav, dob, profession, anniversary, relationship, sam, notes, this.timeNow, this.timeNow, sync, sync,location]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public addContactWhenOnline (firstname, lastname, email, phonenumber, officenumber, position, company, dob, relationship, notes, contactidExt, profession, anniversary,location) {
    let fav = 0;
    //this.getNumberOfContacts();
    let sync = 1;
    let sam = "assets/Images/profile.jpg";

    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO Contact (UserId,Firstname,Lastname," +
          "Email,PhoneNumber,OfficeNumber,Position," +
          "Company,Favorites,BirthdayOn,Profession,Anniversary,ProfilePicture,RelationShip,Notes,CreatedOn,ModifiedOn,IfSync,UpdateSync,ContactIdExt,Location) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [this.userIdFromDB,
        firstname, lastname, email, phonenumber, officenumber, position, company, fav, dob, profession, anniversary, sam, relationship, notes, this.timeNow, this.timeNow, sync, 0, contactidExt,location]).then((data) => {
        resolve(data);
        // this.sentEmailToServer(email,contactidExt);
      }, (error) => {
        reject("Http error in online contact add" + error);
      });
    });
  }

  /*
   * @discussion - add new contact from device
   * @param
   * @return
   */
  public addContactFrmDevice (firstname,lastname, email, phonenumber, company, dob, notes) {
    let fav = 0;
    let sync = 0;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO Contact (UserId,Firstname,Lastname,Email,PhoneNumber," +
          "Company,Favorites,BirthdayOn,Notes,CreatedOn,ModifiedOn,IfSync,UpdateSync,ProfilePicture) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [this.userIdFromDB,
        firstname,lastname, email, phonenumber, company, fav, dob, notes, this.timeNow, this.timeNow, sync, 0,"assets/Images/profile.jpg"]).then((data) => {
        resolve(data);
      }, (error) => {
        //alert(JSON.stringify(error));
        reject(error);
      });
    });
  }
  public addContactFrmDeviceOnline (contactidext,firstname,lastname, email, phonenumber, company, dob, notes) {
    let fav = 0;
    let sync = 0;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO Contact (UserId,ContactIdExt,Firstname,Lastname,Email,PhoneNumber," +
          "Company,Favorites,BirthdayOn,Notes,CreatedOn,ModifiedOn,IfSync,UpdateSync,ProfilePicture) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [this.userIdFromDB,
        contactidext,firstname,lastname, email, phonenumber, company, fav, dob, notes, this.timeNow, this.timeNow, sync, 0,"assets/Images/profile.jpg"]).then((data) => {
        resolve(data);
      }, (error) => {
        //alert(JSON.stringify(error));
        reject(error);
      });
    });
  }


  /*
   * @discussion - Edit contact
   * @param
   * @return
   */
  public editContact (email, phonenumber, officenumber, position, company, contactid, favnum, birthday, relationship, notes, firstname, lastname, profession, anniversary,location) {
    return new Promise((resolve, reject) => {
      let ifsync = 0;

      this.storage.executeSql("UPDATE Contact SET Email=?,PhoneNumber=?,OfficeNumber=?,Position=?," +
          "Company=?,ModifiedOn=?,Favorites=?,BirthdayOn=?,RelationShip=?,Notes=?,Firstname=?,Lastname=?,Profession=?,Anniversary=?,IfSync=?,UpdateSync=?,Location=? WHERE ContactId = ?", [email, phonenumber,
        officenumber, position, company, this.timeNow.toLocaleString(), favnum, birthday, relationship, notes, firstname, lastname, profession, anniversary, ifsync,0, location,contactid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public editContactOnline (email, phonenumber, officenumber, position, company, contactid, favnum, birthday, relationship, notes, firstname, lastname, profession, anniversary,location) {
    return new Promise((resolve, reject) => {
      let ifsync = 1;
      this.storage.executeSql("UPDATE Contact SET Email=?,PhoneNumber=?,OfficeNumber=?,Position=?," +
          "Company=?,ModifiedOn=?,Favorites=?,BirthdayOn=?,RelationShip=?,Notes=?,Firstname=?,Lastname=?,Profession=?,Anniversary=?,IfSync=?,UpdateSync=?,Location=? WHERE ContactId = ?", [email, phonenumber,
        officenumber, position, company, this.timeNow, favnum, birthday, relationship, notes, firstname, lastname, profession, anniversary, ifsync,1,location, contactid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }


  public editFav (fav, id) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE Contact SET Favorites=? WHERE ContactId = ?", [fav, id]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Edit contact
   * @param
   * @return
   */
  public editGroup (gid, groupname) {
    return new Promise((resolve, reject) => {
      let ifsync = 0;
      this.storage.executeSql("UPDATE GroupTable SET GroupName=?,IfSync=? WHERE GroupId = ?", [groupname, ifsync, gid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public editGroupOnline (gid, groupname) {
    let ifsync = 1;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE GroupTable SET GroupName=?,IfSync=? WHERE GroupId = ?", [groupname, ifsync, gid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Get all contact
   * @param
   * @return
   */
  public getAllContacts () {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM Contact", []).then((data) => {
        let people = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            people.push({
              contactid: data.rows.item(i).ContactId,
              contactidext: data.rows.item(i).ContactIdExt,
              firstname: data.rows.item(i).Firstname,
              lastname: data.rows.item(i).Lastname,
              email: data.rows.item(i).Email,
              phonenumber: data.rows.item(i).PhoneNumber,
              officenumber: data.rows.item(i).OfficeNumber,
              position: data.rows.item(i).Position,
              company: data.rows.item(i).Company,
              favorites: data.rows.item(i).Favorites,
              profession: data.rows.item(i).Profession,
              anniversary: data.rows.item(i).Anniversary,
              profilepic: data.rows.item(i).ProfilePicture,
              birthday: data.rows.item(i).BirthdayOn,
              relationship: data.rows.item(i).RelationShip,
              notes: data.rows.item(i).Notes,
              createdon: data.rows.item(i).CreatedOn,
              modifiedon: data.rows.item(i).ModifiedOn,
              ifsync: data.rows.item(i).IfSync,
              name: data.rows.item(i).Firstname + " " + data.rows.item(i).Lastname,
              location : data.rows.item(i).Location
            });
          }
        }
        resolve(people);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Delete Contact
   * @param
   * @return
   */
  public deleteContact (contactid) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("DELETE  FROM Contact WHERE ContactId = ?", [contactid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Get all fav contacts
   * @param
   * @return
   */
  public getAllFavContacts () {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM Contact WHERE Favorites > 0 ", []).then((data) => {
        let people = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            people.push({
              contactid: data.rows.item(i).ContactId,
              contactidext: data.rows.item(i).ContactIdExt,
              firstname: data.rows.item(i).Firstname,
              lastname: data.rows.item(i).Lastname,
              email: data.rows.item(i).Email,
              phonenumber: data.rows.item(i).PhoneNumber,
              officenumber: data.rows.item(i).OfficeNumber,
              position: data.rows.item(i).Position,
              company: data.rows.item(i).Company,
              favorites: data.rows.item(i).Favorites,
              birthday: data.rows.item(i).BirthdayOn,
              profession: data.rows.item(i).Profession,
              anniversary: data.rows.item(i).Anniversary,
              profilepic: data.rows.item(i).ProfilePicture,
              relationship: data.rows.item(i).RelationShip,
              notes: data.rows.item(i).Notes,
              createdon: data.rows.item(i).CreatedOn,
              modifiedon: data.rows.item(i).ModifiedOn,
              ifsync: data.rows.item(i).IfSync,
              location:data.rows.item(i).Location
            });
          }
        }
        resolve(people);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - add new group
   * @param
   * @return
   */
  public addGroup (groupname, sync) {
    //this.getNumberOfGroups();
    let sam = "assets/Images/profile.jpg";

    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO GroupTable (UserId,GroupName,ProfilePicture,CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?)", [this.userIdFromDB, groupname, sam, this.timeNow, this.timeNow, sync]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public addGroupWithProPic (groupname, sam, sync) {
    //this.getNumberOfGroups();
    //let sam = "assets/Images/profile.jpg";

    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO GroupTable (UserId,GroupName,ProfilePicture,CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?)", [this.userIdFromDB, groupname, sam, this.timeNow, this.timeNow, sync]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public addGroupWhenonline (groupname, sync, groupExt) {
    //this.getNumberOfGroups();
    let sam = "assets/Images/profile.jpg";

    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO GroupTable (UserId,GroupName,GroupIdExt,ProfilePicture,CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?,?)", [this.userIdFromDB, groupname, groupExt, sam, this.timeNow, this.timeNow, sync]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Delete group
   * @param
   * @return
   */
  public deleteGroup (groupid) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("DELETE  FROM GroupTable WHERE GroupId = ?", [groupid]).then((data) => {

        this.storage.executeSql("DELETE  FROM GroupContact WHERE GroupId = ?", [groupid]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });

        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - get all group
   * @param
   * @return
   */
  public getAllgroups () {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM GroupTable", []).then((data) => {
        let people = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            people.push({
              UserId: data.rows.item(i).UserId,
              GroupId: data.rows.item(i).GroupId,
              GroupName: data.rows.item(i).GroupName,
              GroupIdExt: data.rows.item(i).GroupIdExt,
              ProfilePicture: data.rows.item(i).ProfilePicture
            });
          }
        }
        resolve(people);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - add contact to group
   * @param
   * @return
   */
  public addContactToGroup (groupid, contactid, groupname) {
    let sync = 0;
    let contactsExist: boolean = false;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM GroupContact WHERE GroupId =?  ", [groupid]).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            // contacts.push({ContactId : data.rows.item(i).ContactId
            // });
            if (contactid == data.rows.item(i).ContactId) {
              contactsExist = true;
            }
          }
          if (contactsExist === true) {
            // alert("Contact Already Added");
          }
          else {
            this.storage.executeSql("INSERT INTO GroupContact (GroupId,ContactId,GroupName," +
                "CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?)", [groupid,
              contactid, groupname, this.timeNow, this.timeNow, sync]).then((data) => {
              this.numOfCon = this.numOfCon +1;
              resolve(data);
            }, (error) => {
              reject(error);
            });
          }
        }
        else {
          this.storage.executeSql("INSERT INTO GroupContact (GroupId,ContactId,GroupName," +
              "CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?)", [groupid,
            contactid, groupname, this.timeNow, this.timeNow, sync]).then((data) => {
            this.numOfCon = this.numOfCon +1;

            resolve(data);
          }, (error) => {
            reject(error);
          });
        }
      }).then(() => {
      });
    });
  }

  public addContactToGroupWhenOnline (groupid, contactid, groupname, groupidext) {
    let sync = 1;
    let contactsExist: boolean = false;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM GroupContact WHERE GroupId =?  ", [groupid]).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            // contacts.push({ContactId : data.rows.item(i).ContactId
            // });
            if (contactid == data.rows.item(i).ContactId) {
              contactsExist = true;
            }
          }
          if (contactsExist === true) {
            // alert("Contact Already Added");
          }
          else {
            this.storage.executeSql("INSERT INTO GroupContact (GroupId,ContactId,GroupName," +
                "GroupContactIdExt,CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?,?)", [groupid,
              contactid, groupname, groupidext, this.timeNow, this.timeNow, sync]).then((data) => {
              this.numOfCon = this.numOfCon +1;

              resolve(data);
            }, (error) => {
              reject(error);
            });
          }
        }
        else {
          this.storage.executeSql("INSERT INTO GroupContact (GroupId,ContactId,GroupName," +
              "GroupContactIdExt,CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?,?)", [groupid,
            contactid, groupname, groupidext, this.timeNow, this.timeNow, sync]).then((data) => {
            this.numOfCon = this.numOfCon +1;

            resolve(data);
          }, (error) => {
            reject(error);
          });
        }
      }).then(() => {
      });
    });
  }

  public getNoOfGroupContact(id)
  {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM GroupContact WHERE GroupId =?", [id]).then((data) => {
        // resolve(data.rows.length);
        console.log(JSON.stringify(data));
        for (let i = 0; i < data.rows.length; i++) {
          //console.log(i)
          if(i == data.rows.length-1)
          {
            resolve(data.rows.length);
          }
        }
        },(error)=>{
        reject(error);
      })
      })
  }


  /*
   * @discussion - get all group contact
   * @param
   * @return
   */
  public  getAllGroupContactForList(groupid) {
    let groupContactId = [];
    this.contactInGroupContact = [];
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM GroupContact WHERE GroupId =?  ", [groupid]).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            groupContactId.push({
              ContactId: data.rows.item(i).ContactId
            });
          }
          resolve(groupContactId);

        }
      },(err)=>{
        reject(err);
      })
    });
  }

  public getAllGroupContact (groupid) {
    let groupContactId = [];
    this.contactInGroupContact = [];
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM GroupContact WHERE GroupId =?  ", [groupid]).then((dataGrp) => {
        if (dataGrp.rows.length > 0) {
          for (let j = 0; j < dataGrp.rows.length; j++) {
            groupContactId.push({
              ContactId: dataGrp.rows.item(j).ContactId,
              GroupContactId:dataGrp.rows.item(j).GroupContactId,
            });
          }
          if (groupContactId.length > 0) {
            for (let dataGr of groupContactId) {
              this.storage.executeSql("SELECT * FROM Contact   WHERE ContactId = ? ", [dataGr['ContactId']]).then((data) => {
                if (data.rows.length > 0) {
                  for (let i = 0; i < data.rows.length; i++) {
                    this.contactInGroupContact.push({
                      GroupContactId:dataGr['GroupContactId'],
                      contactid: data.rows.item(i).ContactId,
                      contactidext: data.rows.item(i).ContactIdExt,
                      firstname: data.rows.item(i).Firstname,
                      lastname: data.rows.item(i).Lastname,
                      email: data.rows.item(i).Email,
                      phonenumber: data.rows.item(i).PhoneNumber,
                      officenumber: data.rows.item(i).OfficeNumber,
                      position: data.rows.item(i).Position,
                      company: data.rows.item(i).Company,
                      favorites: data.rows.item(i).Favorites,
                      relationship: data.rows.item(i).RelationShip,
                      profession: data.rows.item(i).Profession,
                      anniversary: data.rows.item(i).Anniversary,
                      birthday: data.rows.item(i).BirthdayOn,
                      profilepic: data.rows.item(i).ProfilePicture,
                      notes: data.rows.item(i).Notes,
                      createdon: data.rows.item(i).CreatedOn,
                      modifiedon: data.rows.item(i).ModifiedOn,
                      ifsync: data.rows.item(i).IfSync,
                        location : data.rows.item(i).Location,

                    });
                  }
                }
                resolve(this.contactInGroupContact);
              }, (error) => {
                reject(error);
              });
            }
          }
        }
      });
    });
  }

  /*
   * @discussion - get all set contact based on contact id
   * @param
   * @return
   */
  // public getContactFromContactTable (obj) {
  //   this.contactInGroupContact = [];
  //   return new Promise((resolve, reject) => {
  //
  //     if (obj.rows.length > 0) {
  //       for (let i = 0; i < obj.rows.length; i++) {
  //
  //         this.storage.executeSql("SELECT * FROM Contact WHERE ContactId = ?", [obj.rows.item(i).ContactId]).then((data) => {
  //           if (data.rows.length > 0) {
  //             for (let i = 0; i < data.rows.length; i++) {
  //               this.contactInGroupContact.push({
  //                 ContactId: data.rows.item(i).ContactId,
  //                 firstname: data.rows.item(i).Firstname,
  //                 lastname: data.rows.item(i).Lastname,
  //                 email: data.rows.item(i).Email,
  //                 phonenumber: data.rows.item(i).PhoneNumber,
  //                 officenumber: data.rows.item(i).OfficeNumber,
  //                 position: data.rows.item(i).Position,
  //                 company: data.rows.item(i).Company,
  //                 favorites: data.rows.item(i).Favorites,
  //                 birthday: data.rows.item(i).BirthdayOn,
  //                 relationship: data.rows.item(i).RelationShip,
  //                 profession: data.rows.item(i).Profession,
  //                 anniversary: data.rows.item(i).Anniversary,
  //                 profilepic: data.rows.item(i).ProfilePicture,
  //                 notes: data.rows.item(i).Notes,
  //                 createdon: data.rows.item(i).CreatedOn,
  //                 modifiedon: data.rows.item(i).ModifiedOn,
  //                 ifsync: data.rows.item(i).IfSync,
  //               });
  //             }
  //           }
  //           resolve();
  //         }, (error) => {
  //           reject(error);
  //         });
  //       }
  //     }
  //   });
  // }

  /*
   * @discussion - Delete contact from Group contact table
   * @param
   * @return
   */
  public deleteContactFrmGroupContact (GroupContactId) {
    this.contactInGroupContact = [];
    return new Promise((resolve, reject) => {

      this.storage.executeSql("DELETE  FROM GroupContact WHERE GroupContactId = ?", [GroupContactId]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });

    });
  }

  /*
   * @discussion - Add Remainder
   * @param
   * @return
   */
  public addRemainder (contactid, description, shortnote, date, time, active) {
    return new Promise((resolve, reject) => {
      let ifsync = 0;
      this.storage.executeSql("INSERT INTO RemainderTable (UserId, ContactId , Description," +
          "ShortNote,Date,Time,CreatedOn,ModifiedOn,IsActive,IfSync) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [this.userIdFromDB, contactid, description, shortnote, date, time, this.timeNow, this.timeNow, active, ifsync]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });

    });
  }

  public addRemainderWhenOnline (contactid, description, shortnote, date, time, idExt, active) {
    return new Promise((resolve, reject) => {
      let ifsync = 1;
      this.storage.executeSql("INSERT INTO RemainderTable (UserId, ContactId , Description," +
          "ShortNote,Date,Time,CreatedOn,ModifiedOn,IsActive,IfSync,RemainderIdFrmExt) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
          [this.userIdFromDB, contactid, description, shortnote, date, time, this.timeNow, this.timeNow, active, ifsync, idExt]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Add Remainder
   * @param
   * @return
   */

  public updateRemainder (description, shortnote, date, time, remainderid, active) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE RemainderTable SET Description=?,ShortNote=?," +
          "Date=?,Time=?,ModifiedOn=?,IsActive=?,UpdateSync=0 WHERE RemainderId = ?", [description, shortnote,
        date, time, this.timeNow, active, remainderid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }
  public updateRemainderOnline (description, shortnote, date, time, remainderid, active) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE RemainderTable SET Description=?,ShortNote=?," +
          "Date=?,Time=?,ModifiedOn=?,IsActive=?,UpdateSync=1, WHERE RemainderId = ?", [description, shortnote,
        date, time, this.timeNow, active, remainderid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - get all Remainder for specific contact
   * @param
   * @return
   */
  public getAllRemainder (contactid) {
    return new Promise((resolve, reject) => {
      this.remainderofcontact = [];
      this.storage.executeSql("SELECT * FROM RemainderTable WHERE ContactId = ?", [contactid]).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.remainderofcontact.push({
              UserId: data.rows.item(i).UserId,
              ContactId: data.rows.item(i).ContactId,
              RemainderId: data.rows.item(i).RemainderId,
              RemainderIdFrmExt: data.rows.item(i).RemainderIdFrmExt,
              Description: data.rows.item(i).Description,
              ShortNote: data.rows.item(i).ShortNote,
              Date: data.rows.item(i).Date,
              Time: data.rows.item(i).Time,
              SetTime: data.rows.item(i).SetTime,
              IsActive: data.rows.item(i).IsActive,
            });
          }
        }
        resolve(this.remainderofcontact);
      }, (error) => {
        reject(error);
      });
    });
  }

  // public getAllRemainderDate () {
  //   return new Promise((resolve, reject) => {
  //     this.remainderofcontact = [];
  //     this.storage.executeSql("SELECT * FROM RemainderTable", []).then((data) => {
  //       if (data.rows.length > 0) {
  //         for (let i = 0; i < data.rows.length; i++) {
  //           this.remainderofcontact.push({
  //             UserId: data.rows.item(i).UserId,
  //             ContactId: data.rows.item(i).ContactId,
  //             RemainderId: data.rows.item(i).RemainderId,
  //             RemainderIdFrmExt: data.rows.item(i).RemainderIdFrmExt,
  //             Description: data.rows.item(i).Description,
  //             ShortNote: data.rows.item(i).ShortNote,
  //             SetTime: data.rows.item(i).SetTime,
  //             IsActive: data.rows.item(i).IsActive,
  //           });
  //         }
  //       }
  //       resolve(this.remainderofcontact);
  //     }, (error) => {
  //       reject(error);
  //     });
  //   });
  // }

  /*
   * @discussion - get all Remainder for all contact
   * @param
   * @return
   */
  public getAllRemainderForAllContact () {
    return new Promise((resolve, reject) => {
      let people = [];
      this.storage.executeSql("SELECT * FROM RemainderTable", []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            people.push({
              UserId: data.rows.item(i).UserId,
              ContactId: data.rows.item(i).ContactId,
              RemainderId: data.rows.item(i).RemainderId,
              RemainderIdFrmExt: data.rows.item(i).RemainderIdFrmExt,
              Description: data.rows.item(i).Description,
              ShortNote: data.rows.item(i).ShortNote,
              SetTime: data.rows.item(i).SetTime,
              IsActive: data.rows.item(i).IsActive,
            });

          }
        }
        resolve(people);
      }, (error) => {
        reject(error);
      });
    });
  }

  getIonicDateTime (value: Date): string {
    if (value) {
      let date: Date = new Date(value);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
      return ionicDate.toISOString();
    }
    return null;
  }

  setIonicDateTime (value: string): Date {
    if (value) {
      let date: Date = new Date(value);
      let ionicDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
      return ionicDate;
    }
    return null;
  }

  public getAllRemainderForAllContactHome () {
    return new Promise((resolve, reject) => {
      let people = [];
      let aa: Date = new Date();
      let dat = new Date(aa.getFullYear(), aa.getMonth(), aa.getDay());
      // console.log("dat"+JSON.stringify(dat));
      let strDate = JSON.stringify(this.timeNow).substr(1, 10);
      console.log("dat" + strDate);
      let completeStr = "'" + strDate + "'";
      console.log("Complete string" + completeStr);

      this.storage.executeSql("SELECT * FROM RemainderTable WHERE Date >= '" + strDate + "' ", []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.storage.executeSql("SELECT * FROM Contact WHERE ContactId = ?", [data.rows.item(i).ContactId]).then((dataCon) => {
              people.push({
                UserId: data.rows.item(i).UserId,
                ContactId: data.rows.item(i).ContactId,
                ContactName : dataCon.rows.item(0).Firstname,
                firstname: dataCon.rows.item(0).Firstname,
                lastname: dataCon.rows.item(0).Lastname,

                RemainderId: data.rows.item(i).RemainderId,
                RemainderIdFrmExt: data.rows.item(i).RemainderIdFrmExt,
                Description: data.rows.item(i).Description,
                ShortNote: data.rows.item(i).ShortNote,
                Date: data.rows.item(i).Date,
                Time: data.rows.item(i).Time,
                SetTime: data.rows.item(i).SetTime,
                IsActive: data.rows.item(i).IsActive,
              });
              if(i == data.rows.length -1)
              {
                resolve(people);
              }
            },(err)=>{
              people.push({
                UserId: data.rows.item(i).UserId,
                ContactId: data.rows.item(i).ContactId,
                ContactName : " ",
                RemainderId: data.rows.item(i).RemainderId,
                RemainderIdFrmExt: data.rows.item(i).RemainderIdFrmExt,
                Description: data.rows.item(i).Description,
                ShortNote: data.rows.item(i).ShortNote,
                Date: data.rows.item(i).Date,
                Time: data.rows.item(i).Time,
                SetTime: data.rows.item(i).SetTime,
                IsActive: data.rows.item(i).IsActive,
              });
              if(i == data.rows.length -1)
              {
                resolve(people);
              }
            });
          }
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Delete Remainder
   * @param
   * @return
   */
  public deleteRemainder (remainid) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("DELETE  FROM RemainderTable WHERE RemainderId = ?", [remainid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }


  /*
   * @discussion - add inner circle
   * @param
   * @return
   */
  public addInnerCircle (contactid, firstname, lastname, birthday, profession, relation, anniversary, notes,company) {
    let sync = 0;
    //this.getNumberOfGroups();
    // let contactExist = false;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO InnerCircleTable (ContactId,Firstname,Lastname,BirthdayOn," +
          "Profession,Relation,Anniversary,Notes,CreatedOn,ModifiedOn,IfSync,Company) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
          [contactid, firstname, lastname, birthday, profession, relation, anniversary, notes, this.timeNow, this.timeNow, sync,company]).then((data1) => {
        resolve(data1);
      }, (error) => {
        reject(error);
      });
    });
  }

  public addInnerCircleWhenOnline (contactid, innercircleext, firstname, lastname, birthday, profession, relation, anniversary, notes,company) {
    let sync = 1;
    //this.getNumberOfGroups();
    // let contactExist = false;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO InnerCircleTable (ContactId,Firstname,Lastname,InnerCircleIdExt,BirthdayOn," +
          "Profession,Relation,Anniversary,Notes,CreatedOn,ModifiedOn,IfSync,Company) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [contactid, firstname, lastname, innercircleext, birthday, profession, relation, anniversary, notes, this.timeNow, this.timeNow, sync,company]).then((data1) => {
        resolve(data1);
      }, (error) => {
        reject(error);
      });
    });
  }

  public editInnerCircleInfo (firstname, lastname, birthday, profession, relation, anniversary, notes, id) {
    let ifsync = 0;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE InnerCircleTable SET Firstname=?,Lastname=?," +
          "BirthdayOn=?,Profession=?,Relation=?,Anniversary=?,Notes=?,ModifiedOn=?,IfSync=? WHERE id = ?", [firstname, lastname,
        birthday, profession, relation, anniversary, notes, this.timeNow, ifsync, id]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public editInnerCircleInfoOnline (firstname, lastname, birthday, profession, relation, anniversary, notes, id) {
    let ifsync = 1;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE InnerCircleTable SET Firstname=?,Lastname=?," +
          "BirthdayOn=?,Profession=?,Relation=?,Anniversary=?,Notes=?,ModifiedOn=?,IfSync=? WHERE id = ?", [firstname, lastname,
        birthday, profession, relation, anniversary, notes, this.timeNow, ifsync, id]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });

  }


  /*
   * @discussion - add inner circle
   * @param
   * @return
   */

  public getAllInnerCircle (contactid) {
    let people = [];

    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM InnerCircleTable WHERE ContactId =?  ", [contactid]).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            people.push({
              id: data.rows.item(i).id,
              ContactId: data.rows.item(i).ContactId,
              firstname: data.rows.item(i).Firstname,
              lastname: data.rows.item(i).Lastname,
              birthday: data.rows.item(i).BirthdayOn,
              profession: data.rows.item(i).Profession,
              InnerCircleIdExt: data.rows.item(i).InnerCircleIdExt,
              relationship: data.rows.item(i).Relation,
              anniversary: data.rows.item(i).Anniversary,
              notes: data.rows.item(i).Notes,
              IfSync: data.rows.item(i).IfSync,
              company:data.rows.item(i).Company
            });
          }
        }
        resolve(people);
      }, (error) => {
        reject(error);
      });
    });
  }

  public deleteInnerCirlceContact (id) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("DELETE  FROM InnerCircleTable WHERE id = ?", [id]).then((data) => {

        resolve(data);
      }, (error) => {
        reject(error);
      });

    });
  }

  // public updateInnerCircleContactDetails (id, anniversary, relationship, profession, notes, contactToEdit) {
  //   return new Promise((resolve, reject) => {
  //
  //     this.storage.executeSql("UPDATE Contact SET Anniversary=?,RelationShip=?,Profession=?,Notes=?,ModifiedOn=? " +
  //         "WHERE ContactId = ?", [anniversary, relationship, profession,
  //       notes, this.timeNow, contactToEdit]).then((datacontact) => {
  //
  //       resolve(datacontact);
  //     }, (error) => {
  //
  //       reject(error);
  //     });
  //   });
  // }

  public addInterest (contactid, interestname) {
    return new Promise((resolve, reject) => {
      let ifsync = 1;
      let interestid = 1;
      this.storage.executeSql("INSERT INTO InterestTable (ContactId," +
          "InterestId,InterestName,CreatedOn,IfSync) VALUES (?,?,?,?,?)",
          [contactid, interestid, interestname, this.timeNow, ifsync]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Delete Interest
   * @param
   * @return
   */
  public getAllInterest (contactid) {
    return new Promise((resolve, reject) => {
      this.interestOfContact = [];
      this.storage.executeSql("SELECT * FROM InterestTable WHERE ContactId = ?", [contactid]).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.interestOfContact.push({
              id: data.rows.item(i).id,
              ContactId: data.rows.item(i).ContactId,
              InterestId: data.rows.item(i).InterestId,
              InterestName: data.rows.item(i).InterestName
            });
          }
        }
        resolve(this.interestOfContact);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Delete Interest
   * @param
   * @return
   */
  public deleteInterest (id) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("DELETE  FROM InterestTable WHERE id = ?", [id]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - Sync the new contact to api
   * @param
   * @return
   */
  public checkContactSync () {
    console.log("checkContactSync");
    this.storage.executeSql("SELECT * FROM Contact WHERE IfSync = 0", []).then((data) => {
      let people = [];
      if (data.rows.length > 0) {
        this.checkContactUpdate();

        for (let i = 0; i < data.rows.length; i++) {

          if (i == data.rows.length-1) {
            this.contactEndBool = true;
          } else {
            this.contactEndBool = false;
          }
          people.push({
            contactid: data.rows.item(i).ContactId,
            firstname: data.rows.item(i).Firstname,
            lastname: data.rows.item(i).Lastname,
            email: data.rows.item(i).Email,
            phonenumber: data.rows.item(i).PhoneNumber,
            officenumber: data.rows.item(i).OfficeNumber,
            position: data.rows.item(i).Position,
            company: data.rows.item(i).Company,
            favorites: data.rows.item(i).Favorites,
            birthday: data.rows.item(i).BirthdayOn,
            relationship: data.rows.item(i).RelationShip,
            profession: data.rows.item(i).Profession,
            anniversary: data.rows.item(i).Anniversary,
            notes: data.rows.item(i).Notes,
            createdon: data.rows.item(i).CreatedOn,
            modifiedon: data.rows.item(i).ModifiedOn,
            ifsync: data.rows.item(i).IfSync,
            location : data.rows.item(i).Location
          });
          console.log("http save new contact send");
          let firstname : String = data.rows.item(i).Firstname;
          let lastname : String= data.rows.item(i).Lastname;
          let email : String= data.rows.item(i).Email;
          let phonenumber: String = data.rows.item(i).PhoneNumber;
          let officenumber: String = data.rows.item(i).OfficeNumber;
          let position : String= data.rows.item(i).Position ;
          let company : String= data.rows.item(i).Company;
          let contactid : String= data.rows.item(i).ContactId;
          let birthday : String = data.rows.item(i).BirthdayOn;
          let relationship : String = data.rows.item(i).RelationShip;
          let notes : String = data.rows.item(i).Notes;
          let profession : String = data.rows.item(i).Profession;
          let anniversary : String  = data.rows.item(i).Anniversary;
          let location : String = data.rows.item(i).Location;

          let url = this.sentientApiUrl + "Contact/Save?ContactId=0&UserId=" + this.userIdFromDB +
              "&FirstName=" + firstname + "&LastName=" + lastname + "&EMail=" + email +
              "&PhNo=" + phonenumber + "&OfficeNo=" + officenumber + "&Position=" + position +
              "&Company=" + company + "&Relative=" + relationship + "&Profilepic=test.pic&DOB=" + birthday +
              "&Fav=false&FavRating=0&Notes=" + notes + "&ModifyOn=01-01-2017&Profession=" + profession + "&AnnivasaryOn=" + anniversary + "&Location="+location;
          let encodedUrl = encodeURI(url);
          this.http.get(encodedUrl, {}, {})
              .then(datafrmapi => {

                console.log("Contact send " + data.rows.item(i).Firstname);
                // update contactidext and ifsync
                let intcontact: Int8Array = JSON.parse(datafrmapi.data);
                this.editContactIDSync(contactid, intcontact);

              })
              .catch(error => {
                console.log(error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);
              });
        }
      } else {
        //this.syncAll(this.userIdFromDB,this.userEmail);
        this.checkContactUpdate();

      }
    }, (error) => {
    });
  }

  // public checkDbToApi () {
  //   this.storage.executeSql("SELECT * FROM Contact ", []).then((data) => {
  //     this.http.get(this.apiUrl + "contact/ViewContacts?UserId=" + this.userIdFromDB + "&ContactId=0", {}, {})
  //         .then(datafrmapi => {
  //           let dataApi = JSON.parse(datafrmapi.data);
  //           if (dataApi.length == data.rows.length) {
  //
  //           } else if (dataApi.length < data.rows.length) {
  //             this.checkContactSync();
  //           } else if (dataApi.length > data.rows.length) {
  //             this.addContactFrmExt();
  //           }
  //         })
  //         .catch(error => {
  //           console.log(error.status);
  //           console.log(error.error); // error message as string
  //           console.log(error.headers);
  //         });
  //
  //   });
  // }

  public editContactIDSync (contactid, contactidExt) {
    let ifsync = 1;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE Contact SET ContactIdExt=?,IfSync=? WHERE ContactId = ?", [contactidExt, ifsync,contactid]).then((data) => {
        console.log("id updated");
        resolve(data);
      }, (error) => {
        reject(error);
        console.log(error);
      });
    });
  }

  /*
   * @discussion - get contacts from External db
   * @param
   * @return
   */
    public addContactFrmExt () {

        return new Promise((resolve)=>{


            this.storage.executeSql("SELECT * FROM Contact ", []).then((data) => {
                console.log(data);
                let url = this.apiUrl + "contact/ViewContacts?UserId=" + this.userIdFromDB + "&ContactId=0";
                let encodedUrl  = encodeURI(url);
                console.log(encodedUrl);
                this.http.get(encodedUrl, {}, {})
                    .then(datafrmapi => {
                        let contactFromExt = JSON.parse(datafrmapi.data);
                        console.log(contactFromExt);
                        console.log(contactFromExt.length);
                        if (data.rows.length == contactFromExt.length) {
                            resolve("");
                        }
                        else {
                            for (let i = 0; i < contactFromExt.length; i++) {
                                if (i == contactFromExt.length - 1) {
                                    this.numberOfContactBool = true;
                                }else
                                {
                                    this.numberOfContactBool = false;

                                }

                                this.exceStorateContact(contactFromExt[i].ContactId, contactFromExt[i].FirstName, contactFromExt[i].LastName,
                                    contactFromExt[i].Email, contactFromExt[i].PhoneNumber, contactFromExt[i].OfficeNumber, contactFromExt[i].Position,
                                    contactFromExt[i].CompanyName, contactFromExt[i].Rating, contactFromExt[i].CreatedOn, contactFromExt[i].ModifiedOn,
                                    contactFromExt[i].BirthdayOn, contactFromExt[i].RelationShip, contactFromExt[i].Notes, contactFromExt[i].Profession,
                                    contactFromExt[i].Annivasary,contactFromExt[i].ProfilePicture,contactFromExt[i].Location).then((result)=>{
                                    console.log(i);
                                    if (i == contactFromExt.length - 1) {
                                        console.log("exceStorateContact finished");
                                        resolve("");
                                    }
                                });
                            }
                        }
                    })

                    .catch(error => {

                        console.log("Cannot get contact list"+error.status);
                        console.log(error.error); // error message as string
                        console.log(error.headers);
                        resolve("");

                    });

            }, (error) => {
                console.log(error);
                resolve("");
            });
        });
    }

    /*
     * @discussion - get contacts from External db
     * @param
     * @return
     */
    public exceStorateContact (contactid, firstname, lastname, email, phonenumber, officenumber, position, company, rating, createdon, modifiedon, birthdayon, relationship, notes, profession, anniversary,profilepicture,location) {

        return new Promise((resolve)=>{


            if(profilepicture == "" || profilepicture == null)
            {
                profilepicture = "assets/Images/profile.jpg";
            }
            if(birthdayon == "1900-01-01T00:00:00")
            {
                birthdayon = "";
            }
            if(anniversary == "1900-01-01T00:00:00")
            {
                anniversary = "";
            }
            let sync = 1;
            let sam = "assets/Images/profile.jpg";
            this.storage.executeSql("INSERT INTO Contact (UserId,ContactIdExt,Firstname,Lastname," +
                "Email,PhoneNumber,OfficeNumber,Position," +
                "Company,Favorites,BirthdayOn,RelationShip,ProfilePicture,Profession,Anniversary,Notes,CreatedOn,ModifiedOn,IfSync,Location) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [this.userIdFromDB, contactid,
                firstname, lastname, email, phonenumber, officenumber, position, company, rating, birthdayon, relationship, profilepicture, profession, anniversary, notes, createdon, modifiedon, sync,location]).then((data) => {

                resolve("");
            }, (error) => {
                resolve("");

            });
        });

    }
    //new

    public addReminderFrmExt () {

        return new Promise((resolve)=> {
            let url = this.apiUrl + "Reminder/View?ContactId=0&ReminderId=0&UserId="+this.userIdFromDB;
            let encodedUrl  = encodeURI(url);
            console.log(encodedUrl);
            this.http.get(encodedUrl, {}, {})
                .then(datafrmapi => {
                    let remainFromExt = JSON.parse(datafrmapi.data);
                    if(remainFromExt.length > 0)
                    {

                        for (let i = 0; i < remainFromExt.length; i++) {

                            this.storage.executeSql("SELECT * FROM Contact WHERE ContactIdExt=? ", [remainFromExt[i].ContactId]).then((dataCon) => {
                                if(dataCon.rows.length>0)
                                {

                                    let contactid = dataCon.rows.item(0).ContactId;
                                    this.addRemainToLocal(contactid,remainFromExt[i].ReminderId,remainFromExt[i].Command,remainFromExt[i].Notes,remainFromExt[i].DateOnly,remainFromExt[i].TimeOnly,remainFromExt[i].ReminderON).then((res)=>{

                                        if(i == remainFromExt.length - 1)
                                        {
                                            resolve("");
                                            console.log("reminder finished");
                                        }

                                    },(error)=>{
                                        if(i == remainFromExt.length - 1)
                                        {
                                            resolve("");
                                            console.log("reminder finished");

                                        }                                    });

                                }else
                                {
                                    if(i == remainFromExt.length - 1)
                                    {
                                        resolve("");
                                        console.log("reminder finished");

                                    }
                                }

                            },(err)=>{
                                if(i == remainFromExt.length - 1)
                                {
                                    resolve("");
                                    console.log("reminder finished");

                                }
                            });

                        }


                    }else
                    {
                        resolve("");
                        console.log("reminder finished");

                    }

                }).catch((error)=>{
                resolve("");
            });
        });
    }
    //new
    public addInnerFrmExt () {

        return new Promise((resolve)=> {
            let url = this.apiUrl + "innercircle/GetInnerCircleList?ContactId=0&UserId="+this.userIdFromDB;
            let encodedUrl  = encodeURI(url);
            console.log(encodedUrl);
            this.http.get(encodedUrl, {}, {})
                .then(datafrmapi => {
                    let innerFromExt = JSON.parse(datafrmapi.data);
                    if(innerFromExt.length > 0)
                    {

                        for (let i = 0; i < innerFromExt.length; i++) {

                            this.storage.executeSql("SELECT * FROM Contact WHERE ContactIdExt=? ", [innerFromExt[i].ContactId]).then((dataCon) => {
                                if (dataCon.rows.length > 0) {




                                    let contactid = dataCon.rows.item(0).ContactId;
                                    this.addInnerToLocalDb(contactid, innerFromExt[i].InnerCircleId, innerFromExt[i].FirstName, innerFromExt[i].LastName, innerFromExt[i].Notes, innerFromExt[i].Annivesary, innerFromExt[i].Profession, innerFromExt[i].Birthday, innerFromExt[i].RelationShip, innerFromExt[i].CreatedOn, innerFromExt[i].CreatedOn).then((res) => {
                                        if (i == innerFromExt.length - 1) {
                                            resolve("");
                                            console.log("inner finished");

                                        }
                                    }, (err) => {
                                        if (i == innerFromExt.length - 1) {
                                            resolve("");
                                            console.log("inner finished");

                                        }
                                    })
                                }else
                                {
                                    if (i == innerFromExt.length - 1) {
                                        resolve("");
                                        console.log("inner finished");

                                    }

                                }
                            }, (error) => {
                                if (i == innerFromExt.length - 1) {
                                    resolve("");
                                    console.log("inner finished");

                                }
                            });
                        }
                    }else
                    {
                        resolve("");
                    }
                }).catch((error)=>{
                resolve("");
            });
        });
    }

    //new

    public addInnerToLocalDb(contactid, InnerCircleIdExt, Firstname, Lastname, Notes, Anniversary, Profession, BirthdayOn, Relation, createdon, modifiedon) {
        return new Promise((resolve)=>{

            // let ifsync = 1;
            this.storage.executeSql("INSERT INTO InnerCircleTable (ContactId,InnerCircleIdExt,Firstname,Lastname,Notes,Anniversary,Profession,BirthdayOn,Relation,CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                [contactid, InnerCircleIdExt, Firstname, Lastname, Notes, Anniversary, Profession, BirthdayOn, Relation, createdon, modifiedon]).then((data1) => {
                resolve("");

            }, (error) => {
                resolve("");
            });
        });

    }

    //new
    public addInterestFrmExt () {

        return new Promise((resolve)=> {
            let url = this.apiUrl + "interest/getInterest?GetType=2&Id=0&UserId="+this.userIdFromDB;
            let encodedUrl  = encodeURI(url);
            console.log(encodedUrl);
            this.http.get(encodedUrl, {}, {})
                .then(datafrmapi => {
                    let interestFromExt = JSON.parse(datafrmapi.data);
                    if(interestFromExt.length > 0)
                    {
                        console.log("interestFromExt.length" +interestFromExt.length);
                        for (let i = 0; i < interestFromExt.length; i++) {

                            this.storage.executeSql("SELECT * FROM Contact WHERE ContactIdExt=? ", [interestFromExt[i].ContactId]).then((dataCon) => {
                                if(dataCon.rows.length >0)
                                {
                                    let contactid = dataCon.rows.item(0).ContactId;
                                    this.addInterestToLocal(contactid,interestFromExt[i].ContactId,interestFromExt[i].InterestId,interestFromExt[i].InterestName,1).then((res)=>{
                                        if (i == interestFromExt.length - 1) {
                                            resolve("");
                                            console.log("inner finished");

                                        }
                                    },(err)=>{
                                        if (i == interestFromExt.length - 1) {
                                            resolve("");
                                            console.log("inner finished");

                                        }
                                    })

                                }else
                                {
                                    if (i == interestFromExt.length - 1) {
                                        resolve("");
                                        console.log("inner finished");

                                    }
                                }

                            },(err)=>{
                                if (i == interestFromExt.length - 1) {
                                    resolve("");
                                    console.log("inner finished");

                                }
                            })

                        }


                    }else
                    {
                        resolve("");
                    }

                }).catch((error)=>{
                resolve("");
            });
        });
    }

    public addInterestToLocal(contactid, contactidext,interestidext,interestname,ifsync)
    {
        return new Promise((resolve) => {
            this.storage.executeSql("INSERT INTO InterestTable (ContactId,ContactIdExt,InterestIdExt,InterestName,IfSync) VALUES (?,?,?,?,?)",
                [contactid, contactidext, interestidext,interestname, ifsync]).then((data) => {

                resolve("");
            }, (errorDel) => {
                resolve("");
            });

        });

    }

    //new
    addRemainToLocal(contactid, remainderIdFrmExt, description, shortnote, date,time,act)
    {
        return new Promise((resolve)=>{

            this.storage.executeSql("INSERT INTO RemainderTable (UserId, ContactId , RemainderIdFrmExt , Description," +
                "ShortNote,Date,Time,CreatedOn,ModifiedOn,IsActive) VALUES (?,?,?,?,?,?,?,?,?,?)",
                [this.userIdFromDB, contactid, remainderIdFrmExt, description, shortnote, date,time, this.timeNow, this.timeNow, act]).then((data1) => {
                console.log("sqlite reminder");
                resolve("");
            }, (error1) => {
                resolve("");
            });

        });
    }


  /*
   * @discussion - get remainder from External db
   * @param
   * @return
   */

  public exceStroreExrRemainderToDb (contactFrmExt, remainderIdFrmExt, description, shortnote, date,time, isactive) {
    let act;
    if (isactive == true) {
      act = 1;
    }
    else {
      act = 0;
    }
    this.storage.executeSql("SELECT * FROM Contact WHERE ContactIdExt = ?", [contactFrmExt]).then((data) => {
      let people = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          people.push({
            contactid: data.rows.item(i).ContactId,
          });
          this.storage.executeSql("INSERT INTO RemainderTable (UserId, ContactId , RemainderIdFrmExt , Description," +
              "ShortNote,Date,Time,CreatedOn,ModifiedOn,IsActive) VALUES (?,?,?,?,?,?,?,?,?,?)",
              [this.userIdFromDB, data.rows.item(i).ContactId, remainderIdFrmExt, description, shortnote, date,time, this.timeNow, this.timeNow, act]).then((data1) => {
          }, (error1) => {
          });
        }
      }
    }, (error) => {
    });
  }

  /*
   * @discussion - save contact to be deleted when an condact is deleted in offline
   * @param
   * @return
   */
  public saveContactToDelete (contactid) {
    return new Promise((resolve, reject) => {

      this.storage.executeSql("INSERT INTO  ContactDelete(ContactId) VALUES (?)", [contactid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * @discussion - check contact to be deleted when an user is online
   * @param
   * @return
   */
  public checkContactDeleteTable () {
    this.storage.executeSql("SELECT * FROM ContactDelete ", []).then((data) => {
      for (let i = 0; i < data.rows.length; i++) {

        let url = this.apiUrl + "contact/delete?ContactId=" + data.rows.item(i).ContactId;
        let enncodedUrl = encodeURI(url);

        this.http.get(enncodedUrl, {}, {})
            .then(datafrmapi => {
              console.log(datafrmapi.data);
              this.storage.executeSql("DELETE  FROM ContactDelete WHERE id = ?", [data.rows.item(i).id]).then((dataDel) => {
                console.log("Contact deleted");
              }, (errorDel) => {

              });
            })
            .catch(error => {
              console.log(error.status);
              console.log(error.error); // error message as string
              console.log(error.headers);
            });
      }
    });
  }

  /*
   * @discussion - Sync the new remainder to api
   * @param
   * @return
   */
  public checkRemainderSync () {
    console.log("checkRemainderSync");
    this.storage.executeSql("SELECT * FROM RemainderTable WHERE IfSync = 0", []).then((dataRemain) => {
      if (dataRemain.rows.length > 0) {
          this.checkUpdateInnerCirlce();
        for (let i = 0; i < dataRemain.rows.length; i++) {

          let remainderid = dataRemain.data.rows(i).RemainderId;

          this.storage.executeSql("SELECT * FROM Contact WHERE ContactId = ?", [dataRemain.rows.item(i).ContactId]).then((data) => {
            if (data.rows.length > 0) {
              let active: boolean;
              if (dataRemain.rows.item(0).IsActive == 0) {
                active = false;
              }
              else {
                active = true;
              }
              let contactExtId = data.rows.item(0).ContactIdExt;
              if (contactExtId > 0) {

                let url = this.apiUrl+"Reminder/saveReminder?ReminderId=0&ContactId="+contactExtId+"&Command="+dataRemain.rows.item(0).Description+"&Notes="+dataRemain.rows.item(0).ShortNote+"&SetTime="+dataRemain.rows.item(0).Time+"&SetDate="+dataRemain.rows.item(0).Date+"&ReminderON="+active;
                let encodedUrl = encodeURI(url);

                this.http.get(encodedUrl, {}, {}).then(datafrmapi => {
                  let id = JSON.stringify(datafrmapi.data);
                  this.updateIfSyncOfRemainder(id, remainderid);
                });
              }
            }
          });
        }
      }else
      {
          this.checkUpdateInnerCirlce();

    }
      //http to save remainder
      //inside that update the reaminderidExt and if sync
    });
  }

  // public checkRemainderDbToApi () {
  //   this.storage.executeSql("SELECT * FROM RemainderTable", []).then((dataRemain) => {
  //     this.storage.executeSql("SELECT * FROM Contact", []).then((dataCon) => {
  //       for (let i = 0; i < dataCon.rows.length; i++) {
  //         this.http.get(this.apiUrl + "Reminder/View?ContactId=" + dataCon.rows.item(i).ContactIdExt + "&ReminderId=0", {}, {}).then(datafrmapi => {
  //           let dataApi = JSON.stringify(datafrmapi.data);
  //           if (dataApi.length == dataRemain.rows.length) {
  //
  //           } else if (dataApi.length < dataRemain.rows.length) {
  //             this.checkRemainderSync();
  //           } else if (dataApi.length > dataRemain.rows.length) {
  //             this.syncRemainder();
  //           }
  //         });
  //
  //       }
  //     });
  //
  //   });
  // }

  /*
   * @discussion - Update ifsync of remiander
   * @param
   * @return
   */

  public updateIfSyncOfRemainder (id, remainderToUpdateID) {
    this.storage.executeSql("UPDATE RemainderTable SET RemainderIdFrmExt=?,IfSync=1 WHERE RemainderId = ?", [id, remainderToUpdateID]).then((data) => {
    }, (error) => {
    });
  }

  /*
   * @discussion - updated contact to api based on field modified on
   * @param
   * @return
   */

  // public updateContactToApi () {
  //   this.storage.executeSql("SELECT * FROM Contact WHERE IfSync = 1", []).then((data) => {
  //     if (data.rows.length > 0) {
  //       for (let i = 0; i < data.rows.length; i++) {
  //         let firstname = data.rows.item(i).Firstname;
  //         let lastname = data.rows.item(i).Lastname;
  //         let contactfrmdb = data.rows.item(i).ContactIdExt;
  //         let modifiedon = data.rows.item(i).ModifiedOn;
  //         let email = data.rows.item(i).Email;
  //         let phonenumber = data.rows.item(i).PhoneNumber;
  //         let officenumber = data.rows.item(i).OfficeNumber;
  //         let position = data.rows.item(i).Position;
  //         let company = data.rows.item(i).Company;
  //         let favorites = data.rows.item(i).Favorites;
  //         let profession = data.rows.item(i).Profession;
  //         let anniversary = data.rows.item(i).Anniversary;
  //         let fav;
  //         if (favorites > 0) {
  //           fav = true;
  //         }
  //         else {
  //           fav = false;
  //         }
  //         let relationship = data.rows.item(i).RelationShip;
  //         let birthday = data.rows.item(i).BirthdayOn;
  //         let notes = data.rows.item(i).Notes;
  //
  //         this.http.get("http://182.71.233.135:92/api/contact/ViewContacts?UserId=" + this.userIdFromDB + "&ContactId=" + data.rows.item(i).ContactIdExt, {}, {}).then(datafrmapi => {
  //           let contactFromExt = JSON.parse(datafrmapi.data);
  //           for (let i = 0; i < contactFromExt.length; i++) {
  //             let contactid = contactFromExt[i].ContactId;
  //             let modifiedOnFrmApi = contactFromExt[i].ModifiedOn;
  //             if (data.rows.item(i).ContactIdExt == contactid) {
  //               if (modifiedOnFrmApi != modifiedon) {
  //                 this.http.get("http://182.71.233.135:92/api/Contact/Save?ContactId=" + contactfrmdb +
  //                     "0&UserId=" + this.userIdFromDB + "&FirstName=" + firstname + "&LastName=" + lastname +
  //                     "&EMail=" + email + "&PhNo=" + phonenumber + "&OfficeNo=" + officenumber + "&Position=" + position +
  //                     "&Company=" + company + "&Relative=" + relationship + "&Profilepic=test.pic&DOB=" + birthday +
  //                     "&Fav=" + fav + "&FavRating=" + favorites + "&Notes=" + notes + "&ModifyOn=" + modifiedon + "Profession=" + profession + "&AnniversaryOn=" + anniversary, {}, {}).then(datafrmapi => {
  //
  //                 });
  //               }
  //             }
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  public getallGroupFromApi () {
      // this.getInnerCircleFromApi();

      this.performGroupContactFetch = false;
    this.storage.executeSql("SELECT * FROM GroupTable ", []).then((dataGrp) => {
      let url = this.apiUrl + "group/viewGroups?UserId=" + this.userIdFromDB;
      let encodedUrl = encodeURI(url);
      this.http.get(encodedUrl, {}, {}).then(data => {
        let groupFrmExt = JSON.parse(data.data);
        if (dataGrp.rows.length == groupFrmExt.length) {
        } else {
          let groupFrmApi = [];
          for (let i = 0; i < groupFrmExt.length; i++) {
            groupFrmApi.push({
              GroupId: groupFrmExt[i].GroupId,
              GroupName: groupFrmExt[i].GroupName,
              CreatedOn: groupFrmExt[i].CreatedOn,
              ModifiedOn: groupFrmExt[i].ModifiedOn,
              GroupProfilePicture: groupFrmExt[i].GroupProfilePicture
            });
          }
          for (let j = 0; j < groupFrmApi.length; j++) {
            this.performGroupContactFetch = false;
            if (j == groupFrmApi.length - 1) {
              this.performGroupContactFetch = true;
            }
            this.exceStroreExGroupToDb(groupFrmApi[j].GroupId, groupFrmApi[j].GroupName, groupFrmApi[j].CreatedOn, groupFrmApi[j].ModifiedOn,groupFrmApi[j].GroupProfilePicture);
          }
        }
      }).catch(error => {

        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });


    });

  }

  public exceStroreExGroupToDb (groupidext, groupname, createdon, modifiedon,profilepic) {
    if(profilepic == null || profilepic == "")
    {
      profilepic = "assets/Images/profile.jpg";
    }
    let sync = 1;
    let sam = "assets/Images/profile.jpg";
    this.storage.executeSql("INSERT INTO GroupTable (UserId,GroupIdExt,GroupName,ProfilePicture,CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?,?)", [this.userIdFromDB, groupidext, groupname, profilepic, createdon, modifiedon, sync]).then((data) => {
      if (this.performGroupContactFetch == true) {
        this.performGroupContactFetch = false;
        this.checkGroupContact();
      }

    }, (error) => {
    })
  }

  public checkGroupContact () {

    this.storage.executeSql("SELECT * FROM GroupTable", []).then((data) => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

            let url = this.apiUrl + "group/getGroupContacts?GroupId=" + data.rows.item(i).GroupIdExt;

            let encodedUrl = encodeURI(url);

            this.http.get(encodedUrl, {}, {}).then(data1 => {
              let groupContactFrmExt = JSON.parse(data1.data);
                if (groupContactFrmExt.length > 0) {
                  for (let j = 0; j < groupContactFrmExt.length; j++) {
                    this.exceStorageGroupContactToDb(groupContactFrmExt[j].GroupContactId,
                        data.rows.item(i).GroupId, groupContactFrmExt[j].ContactId, groupContactFrmExt[j].CreatedOn, groupContactFrmExt[j].ModifiedOn);
                  }
                }

            })
                .catch(error => {
                  console.log(error.status);
                  console.log(error.error); // error message as string
                  console.log(error.headers);
                });
        }
      }
    }, (error) => {
    });
  }
  public checkGroupContactSettings () {
    console.log("checkGroupContactSettings");
    this.checkRemainderSync();
    this.storage.executeSql("SELECT * FROM GroupTable", []).then((data) => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.storage.executeSql("SELECT * FROM GroupContact WHERE GroupId =?  ", [data.rows.item(i).GroupId]).then((dataGrpCon) => {
            for (let i = 0; i < dataGrpCon.rows.length; i++) {
              if(dataGrpCon.rows.item(i).IfSync != 1)
              {
                this.storage.executeSql("SELECT * FROM Contact WHERE ContactId =?", [dataGrpCon.rows.item(i).ContactId]).then((dataFrmCon) => {

                  let url = this.apiUrl+"group/importContact?GroupId="+data.rows.item(i).GroupIdExt+"&ContactListId="+dataFrmCon.rows.item(0).ContactIdExt;
                  let encodedUrl = encodeURI(url);

                  this.http.get(encodedUrl, {}, {}).then(data1 => {
                    let groupContactFrmExt = JSON.parse(data1.data);
                    this.updateIfsyncForGroupContact(dataGrpCon.rows.item(i).GroupContactId,groupContactFrmExt);

                  })
                      .catch(error => {
                        console.log(error.status);
                        console.log(error.error); // error message as string
                        console.log(error.headers);
                      });
                });

              }
            }

          });
        }
      }
    }, (error) => {
    });
  }
  public updateIfsyncForGroupContact(GroupContactId,groupContactFrmExt)
  {
      this.storage.executeSql("UPDATE GroupContact SET IfSync=1,GroupContactIdExt=? WHERE GroupContactId = ? ", [,groupContactFrmExt,GroupContactId]).then((data) => {

    },(error)=>{

    });
  }

  public exceStorageGroupContactToDb (groupidExt, groupid, contactid, createdon, modifiedon) {
    let sync = 1;
    this.storage.executeSql("SELECT * FROM Contact WHERE ContactIdExt = ? ", [contactid]).then((data) => {
      if (data.rows.length > 0) {
        let contactidDb = data.rows.item(0).ContactId;
        this.storage.executeSql("INSERT INTO GroupContact (GroupId,ContactId," +
            "CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?)", [groupid,
          contactidDb, createdon, modifiedon, sync]).then((data1) => {
        }, (error1) => {
        });
      }
    }, (error) => {
    });
  }

  /*
   * @discussion - Fetch inner circle details on first launch
   * @param
   * @return
   */

  public getInnerCircleFromApi () {
    this.storage.executeSql("SELECT * FROM Contact", []).then((data) => {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          this.storage.executeSql("SELECT * FROM InnerCircleTable WHERE ContactId =?  ", [data.rows.item(i).ContactId]).then((dataFrmInnerCircle) => {

            let url = this.apiUrl + "innercircle/getInnerCircleList?ContactId=" + data.rows.item(i).ContactIdExt;

            let encodedUrl = encodeURI(url);

            this.http.get(encodedUrl, {}, {}).then(data1 => {
              let innerCircleData = JSON.parse(data1.data);
              if (dataFrmInnerCircle.rows.length == innerCircleData.length) {

              } else if (dataFrmInnerCircle.rows.length < innerCircleData.length) {
                if (innerCircleData.length > 0) {
                  for (let j = 0; j < innerCircleData.length; j++) {

                    this.exceStorageToInnerCircleDb(data.rows.item(i).ContactId, innerCircleData[j].InnerCircleId,
                        innerCircleData[j].FirstName, innerCircleData[j].LastName, innerCircleData[j].Notes,
                        innerCircleData[j].Annivesary, innerCircleData[j].Profession, innerCircleData[j].Birthday, innerCircleData[j].RelationShip, innerCircleData[j].CreatedOn, innerCircleData[j].ModifiedOn);


                  }
                }
              } else if (dataFrmInnerCircle.rows.length > innerCircleData.length) {
                this.addInnerCircleFrmDbtoApi();
              }
            })
                .catch(error => {
                  console.log(error.status);
                  console.log(error.error); // error message as string
                  console.log(error.headers);
                });
          });
        }
      } else {
      }
    }, (error) => {

    });
  }

  public exceStorageToInnerCircleDb (contactid, InnerCircleIdExt, Firstname, Lastname, Notes, Anniversary, Profession, BirthdayOn, Relation, createdon, modifiedon) {
    // let ifsync = 1;
    this.storage.executeSql("INSERT INTO InnerCircleTable (ContactId,InnerCircleIdExt,Firstname,Lastname,Notes,Anniversary,Profession,BirthdayOn,Relation,CreatedOn,ModifiedOn,IfSync) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [contactid, InnerCircleIdExt, Firstname, Lastname, Notes, Anniversary, Profession, BirthdayOn, Relation, createdon, modifiedon]).then((data1) => {

    }, (error) => {
    });
  }

  public saveGroupToDeleteInOffline (groupid) {
    this.storage.executeSql("INSERT INTO GroupDelete (GroupId) VALUES (?)", [groupid]).then((data) => {
      console.log("Group to delete added to grouptodelete table");
    }, (error) => {
    });
  }

  public checkGroupDeleteTable () {
    this.storage.executeSql("SELECT * FROM GroupDelete ", []).then((data) => {
      for (let i = 0; i < data.rows.length; i++) {

        let url = this.apiUrl + "group/delete?GroupId=" + data.rows.item(i).GroupId;
        let encodedUrl = encodeURI(url);

        this.http.get(encodedUrl, {}, {})
            .then(datafrmapi => {
              this.storage.executeSql("DELETE  FROM GroupDelete WHERE id = ?", [data.rows.item(i).id]).then((dataDel) => {
              }, (errorDel) => {
              });
            })
            .catch(error => {
              console.log(error.status);
              console.log(error.error); // error message as string
              console.log(error.headers);
            });
      }
    });
  }

  public saveRemainderToDeleteInOffline (remainderid) {
    this.storage.executeSql("INSERT INTO RemainderDelete (RemianderId) VALUES (?)", [remainderid]).then((data) => {
    }, (error) => {

    });
  }

  public checkRemainderDeleteTable () {
    this.storage.executeSql("SELECT * FROM RemainderDelete ", []).then((data) => {
      for (let i = 0; i < data.rows.length; i++) {

        let url = this.apiUrl + "Reminder/delete?ReminderId=" + data.rows.item(i).RemianderId;

        let encodedUrl = encodeURI(url);

        this.http.get(encodedUrl, {}, {})
            .then(datafrmapi => {
              this.storage.executeSql("DELETE  FROM RemainderDelete WHERE id = ?", [data.rows.item(i).id]).then((dataDel) => {
              }, (errorDel) => {
              });
            })
            .catch(error => {
              console.log(error.status);
              console.log(error.error); // error message as string
              console.log(error.headers);
            });
      }
    });
  }

  /*
   * @discussion - Sync the new group to api
   * @param
   * @return
   */
  public checkGroupSync () {
    console.log("checkGroupSync");
    this.storage.executeSql("SELECT * FROM GroupTable WHERE IfSync = 0", []).then((data) => {
      if (data.rows.length > 0) {
        this.checkGroupContactSettings();

        for (let i = 0; i < data.rows.length; i++) {
          if (i == data.rows.length - 1) {
            this.groupEndBool = true;
          } else {
            this.groupEndBool = false;
          }

          let url = this.apiUrl + "group/save?UserId=" + this.userIdFromDB + "&GName=" + data.rows.item(i).GroupName;

          let encodedUrl = encodeURI(url);

          this.http.get(encodedUrl, {}, {})
              .then(datafrmapi => {
                // update contactidext and ifsync
                let intgroup: Int8Array = datafrmapi.data;
                this.editGroupIDSync(data.rows.item(i).GroupId, intgroup)

              })
              .catch(error => {
                console.log(error.status);
                console.log("group check sync error"+error.error); // error message as string
                console.log(error.headers);
              });

        }
      }else
      {
        this.checkGroupContactSettings();

      }
    }, (error) => {
    });
  }

  public checkGroupDbToapi () {
    this.storage.executeSql("SELECT * FROM GroupTable", []).then((data) => {

      let url = this.apiUrl + "group/viewGroups?UserId=" + this.userIdFromDB;

      let encodedUrl = encodeURI(url);

      this.http.get(encodedUrl, {}, {})
          .then(datafrmapi => {
            // update contactidext and ifsync
            let api = JSON.parse(datafrmapi.data);
            if (api.length == data.rows.length) {

            } else if (api.length < data.rows.length) {
              this.checkGroupSync();
            } else if (api.length > data.rows.length) {
              this.getallGroupFromApi();
            }

          })
          .catch(error => {
            console.log(error.status);
            console.log(error.error); // error message as string
            console.log(error.headers);
          });
    });
  }

  public editGroupIDSync (groupid, groupidExt) {
    let ifsync = 1;
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE GroupTable SET GroupIdExt=?,IfSync=? WHERE GroupId = ?", [groupid, groupidExt, ifsync]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  // public updateGroupToApi () {
  //   this.storage.executeSql("SELECT * FROM GroupTable WHERE IfSync = 1", []).then((data) => {
  //     if (data.rows.length > 0) {
  //       for (let i = 0; i < data.rows.length; i++) {
  //         // let groupid = data.rows.item(i).GroupId;
  //         // let groupidext = data.rows.item(i).GroupIdExt;
  //         let groupname = data.rows.item(i).GroupName;
  //         let modifiedon = data.rows.item(i).ModifiedOn;
  //
  //         this.http.get(this.apiUrl + "api/group/viewGroups?UserId=" + this.userIdFromDB, {}, {}).then(datafrmapi => {
  //           let groupFromExt = JSON.parse(datafrmapi.data);
  //           for (let i = 0; i < groupFromExt.length; i++) {
  //             let groupid = groupFromExt[i].ContactId;
  //             let modifiedOnFrmApi = groupFromExt[i].ModifiedOn;
  //             if (data.rows.item(i).ContactIdExt == groupid) {
  //               if (modifiedOnFrmApi != modifiedon) {
  //                 this.http.get(this.apiUrl + "group/update?GId=" + groupFromExt + "&GName=" + groupname, {}, {}).then(datafrmapi => {
  //                 });
  //               }
  //             }
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  // public updateRemainderToApi () {
  //   this.storage.executeSql("SELECT * FROM RemainderTable WHERE IfSync = 1", []).then((data) => {
  //     if (data.rows.length > 0) {
  //       for (let i = 0; i < data.rows.length; i++) {
  //         // let remainderid = data.rows.item(i).RemainderId;
  //         let contactid = data.rows.item(i).ContactId;
  //         let remainderidext = data.rows.item(i).RemainderIdFrmExt;
  //         let command = data.rows.item(i).Description;
  //         let notes = data.rows.item(i).ShortNote;
  //         let time = data.rows.item(i).SetTime;
  //         let active = data.rows.item(i).IsActive;
  //         let modifiedon = data.rows.item(i).ModifiedOn;
  //         let isActive;
  //         if (active == 0) {
  //           isActive = false;
  //         } else {
  //           isActive = true;
  //         }
  //         this.storage.executeSql("SELECT * FROM Contact WHERE ContactId = ?", [contactid]).then((dataFrmContact) => {
  //
  //           this.http.get(this.apiUrl + "Reminder/ViewReminders?ContactId=" + dataFrmContact.data.rows.item(0).ContactId + "&ReminderId=" + remainderidext, {}, {}).then(datafrmapi => {
  //             let remainderFromExt = JSON.parse(datafrmapi.data);
  //             for (let i = 0; i < remainderFromExt.length; i++) {
  //               let remainidApi = remainderFromExt[i].ContactId;
  //               let modifiedOnFrmApi = remainderFromExt[i].ModifiedOn;
  //               if (data.rows.item(i).ContactIdExt == remainidApi) {
  //                 if (modifiedOnFrmApi != modifiedon) {
  //                   this.http.get(this.apiUrl + "Reminder/saveReminder?ContactId=" + contactid + "&Command=" + command + "&Notes=" + notes + "&SetTime=" + time + "&ReminderId=" + remainderidext + "&ReminderON=" + isActive, {}, {}).then(datafrmapi => {
  //                   });
  //                 }
  //               }
  //             }
  //           });
  //         });
  //       }
  //     }
  //   });
  // }

  public saveGroupContactToDeleteInOffline (groupcontactid, groupid) {
    console.log("Group contact added to groupcontactdelete tabele");
    this.storage.executeSql("INSERT INTO GroupContactDelete (ContactId,GroupId) VALUES (?,?)", [groupcontactid, groupid]).then((data) => {
    }, (error) => {

    });
  }

  public checkGroupContactDeleteTable () {
    this.storage.executeSql("SELECT * FROM GroupContactDelete", []).then((data) => {
      for (let i = 0; i < data.rows.length; i++) {

        let url = this.apiUrl + "group/deleteGroupContacts?GroupId=" + data.rows.item(i).GroupId + "&ContactListId=" + data.rows.item(i).ContactId;
        let encodedUrl = encodeURI(url);

        this.http.get(encodedUrl, {}, {})
            .then(datafrmapi => {
              this.storage.executeSql("DELETE  FROM GroupContactDelete WHERE id = ?", [data.rows.item(i).id]).then((dataDel) => {
              }, (errorDel) => {
              });
            })
            .catch(error => {
              console.log(error.status);
              console.log(error.error); // error message as string
              console.log(error.headers);
            });
      }
    });
  }

  // public updateGroupContactToApi () {
  //   this.storage.executeSql("SELECT * FROM GroupTable", []).then((dataGrpTbl) => {
  //     if (dataGrpTbl.rows.length > 0) {
  //       for (let i = 0; i < dataGrpTbl.rows.length; i++) {
  //         this.storage.executeSql("SELECT * FROM GroupContact WHERE GroupId =?  ", [dataGrpTbl.rows.item(i).GroupId]).then((dataGrpCon) => {
  //
  //           this.http.get(this.apiUrl + "group/getGroupContacts?GroupId=" + dataGrpTbl.rows.item(i).GroupIdExt, {}, {})
  //               .then(dataApi => {
  //                 let dataFrmApi = JSON.parse(dataApi.data);
  //                 if (dataFrmApi.length == dataGrpCon.rows.length) {
  //
  //                 } else if (dataFrmApi.length < dataGrpCon.rows.length) {
  //                   this.saveNewContactsToApi();
  //                 } else if (dataFrmApi.length > dataGrpCon.rows.length) {
  //                   this.checkGroupContact();
  //                 }
  //               })
  //               .catch(error => {
  //                 console.log(error.status);
  //                 console.log(error.error); // error message as string
  //                 console.log(error.headers);
  //               });
  //         });
  //
  //       }
  //     }
  //   });
  // }

  // saveNewContactsToApi () {
  //   this.storage.executeSql("SELECT * FROM GroupTable", []).then((dataGrpTbl) => {
  //
  //     for (let z = 0; z < dataGrpTbl.rows.length; z++) {
  //       this.storage.executeSql("SELECT * FROM GroupContact WHERE IfSync =0  ", []).then((dataGrpCon) => {
  //         if (dataGrpCon.rows.lenght > 0) {
  //           for (let i = 0; i < dataGrpCon.rows.length; i++) {
  //             this.storage.executeSql("SELECT * FROM Contact WHERE ContactId =?  ", [dataGrpCon.rows.item(i).ContactId]).then((dataCon) => {
  //               if (dataCon.rows.length) {
  //                 for (let j = 0; j < dataCon.rows.length; j++) {
  //                   this.http.get(this.apiUrl + "group/importContact?GroupId=" + dataGrpTbl.row.item(z).GroupIdExt + "&ContactListId=" + dataCon.rows.item(i).ContactIdExt, {}, {})
  //                       .then(dataApi => {
  //                         let dataFrmApi = JSON.parse(dataApi.data);
  //                         if (dataFrmApi.length == dataGrpCon.rows.length) {
  //
  //                         } else if (dataFrmApi.length < dataGrpCon.rows.length) {
  //                           this.saveNewContactsToApi();
  //                         } else if (dataFrmApi.length > dataGrpCon.rows.length) {
  //                           this.checkGroupContact();
  //                         }
  //                       })
  //                       .catch(error => {
  //                         console.log(error.status);
  //                         console.log(error.error); // error message as string
  //                         console.log(error.headers);
  //                       });
  //                 }
  //               }
  //             });
  //           }
  //         }
  //       });
  //     }
  //   });
  // }

  public saveInnerCircleToDeleteInOffline (innercircleid) {
    this.storage.executeSql("INSERT INTO InnerCircleDelete (InnerCircleId) VALUES (?)", [innercircleid]).then((data) => {
      console.log("OFFLINE:Inner circle added to InnerCircleDelete table");
    }, (error) => {

    });
  }

  public checkInnerCircleDeleteTable () {
    this.storage.executeSql("SELECT * FROM InnerCircleDelete ", []).then((data) => {
      for (let i = 0; i < data.rows.length; i++) {

        let url = this.apiUrl + "innercircle/delete?InnerCircleId=" + data.rows.item(i).InnerCircleId;

        let encodedUrl = encodeURI(url);

        this.http.get(encodedUrl, {}, {})
            .then(datafrmapi => {
              this.storage.executeSql("DELETE  FROM InnerCircleDelete WHERE id = ?", [data.rows.item(i).id]).then((dataDel) => {

              }, (errorDel) => {
              });
            })
            .catch(error => {
              console.log(error.status);
              console.log(error.error); // error message as string
              console.log(error.headers);
            });
      }
    }, (error) => {
    });
  }

  // public updateInnerCircleToApi() {

  //     this.storage.executeSql("SELECT * FROM Contact", []).then((data) => {
  //       if (data.rows.length > 0) {
  //         for (let i = 0; i < data.rows.length; i++) {
  //           this.storage.executeSql("SELECT * FROM InnerCircleTable WHERE ContactId =?  ", [data.rows.item(i).ContactId]).then((dataFrmInnerCircle) => {

  //             HTTP.get(this.apiUrl + "innercircle/GetInnerCircleList?ContactId=" + data.rows.item(i).ContactIdExt, {}, {}).then(data1 => {
  //               let innerCircleData = JSON.parse(data1.data);

  //               if (dataFrmInnerCircle.rows.length == innerCircleData.length) {
  //               }
  //               else if(dataFrmInnerCircle.rows.length < innerCircleData.length){
  //                 if (innerCircleData.length > 0) {
  //                   for (let j = 0; j < innerCircleData.length; j++) {
  //                     if (dataFrmInnerCircle.rows.item(i).ContactIdExt == innerCircleData[j].RelationshipContactId)
  //                     {

  //                     }else
  //                     {
  //                       this.storage.executeSql("SELECT * FROM Contact WHERE ContactIdExt = ? ", [innerCircleData[j].RelationshipContactId]).then((dataFrmCon) => {
  //                         this.exceStorageToInnerCircleDb(data.rows.item(i).ContactId, dataFrmCon.rows.item(0).ContactId,
  //                             innerCircleData[j].InnerCircleId, innerCircleData[j].CreatedOn, innerCircleData[j].ModifiedOn);
  //                       });
  //                     }
  //                   }
  //                 }
  //               }else if(dataFrmInnerCircle.rows.length > innerCircleData.length)
  //               {
  //                 this.addInnerCircleFrmDbtoApi();
  //               }
  //             })
  //                 .catch(error => {
  //                   console.log(error.status);
  //                   console.log(error.error); // error message as string
  //                   console.log(error.headers);
  //                 });


  //           });
  //         }
  //       } else {
  //       }
  //     }, (error) => {

  //     });
  // }
  public addInnerCircleFrmDbtoApi () {
    this.storage.executeSql("SELECT * FROM InnerCircleTable WHERE IfSync =0", []).then((dataFrmInnerCircle) => {
      for (let j = 0; j < dataFrmInnerCircle.rows.length; j++) {
        this.storage.executeSql("SELECT * FROM Contact WHERE ContactId", [dataFrmInnerCircle.rows.item(j).ContactId]).then((dataFromCon) => {

          if (dataFromCon.rows.item(0).ContactIdExt != null) {

            let url =this.apiUrl + "innercircle/saveContact?InnerCircleId=" + dataFrmInnerCircle.rows.item(j).InnerCircleIdExt + "&ContactId=" + dataFromCon.rows.item(0).ContactIdExt + "&FName=" + dataFrmInnerCircle.rows.item(j).Firstname + "&LName=" + dataFrmInnerCircle.rows.item(j).Lastname + "&Position=" + dataFrmInnerCircle.rows.item(j).Profession;

            let encodedUrl = encodeURI(url);


            this.http.get(encodedUrl, {}, {})
                .then(datafrmapi => {
                  let innerExt = JSON.parse(datafrmapi.data);
                  this.updateIfsyncAndExtOfInnerCircle(innerExt, dataFrmInnerCircle.rows.item(j).Id);
                })
                .catch(error => {
                  console.log(error.status);
                  console.log(error.error); // error message as string
                  console.log(error.headers);
                });
          }

        });
      }
    });
  }
  public checkInnerCircleSettings () {
    console.log("checkInnerCircleSettings");
    this.checkGroupSync();
    this.storage.executeSql("SELECT * FROM InnerCircleTable WHERE IfSync = 0", []).then((dataFrmInnerCircle) => {
      for (let j = 0; j < dataFrmInnerCircle.rows.length; j++) {
        console.log("Inner circle found");
        this.storage.executeSql("SELECT * FROM Contact WHERE ContactId=?", [dataFrmInnerCircle.rows.item(j).ContactId]).then((dataFromCon) => {

          if (dataFromCon.rows.item(0).ContactIdExt != null) {

            // let url = this.apiUrl + "innercircle/saveContact?InnerCircleId=" + dataFrmInnerCircle.rows.item(j).InnerCircleIdExt + "&ContactId=" + dataFromCon.rows.item(0).ContactIdExt + "&FName=" + dataFrmInnerCircle.rows.item(j).Firstname + "&LName=" + dataFrmInnerCircle.rows.item(j).Lastname + "&Position=" + dataFrmInnerCircle.rows.item(j).Profession;
            let url = this.apiUrl+"innercircle/saveContact?InnerCircleId=0&ContactId="
                +dataFromCon.rows.item(0).ContactIdExt+"&FName=" + dataFrmInnerCircle.rows.item(j).Firstname + "&LName=" + dataFrmInnerCircle.rows.item(j).Lastname + "&Profession=" + dataFrmInnerCircle.rows.item(j).Profession+"&Relation="+dataFrmInnerCircle.rows.item(j).Relation+"&Notes="+dataFrmInnerCircle.rows.item(j).Notes+"&DOB="+dataFrmInnerCircle.rows.item(j).BirthdayOn+"&Annivasary="+dataFrmInnerCircle.rows.item(j).Anniversary;
            let encodedUrl = encodeURI(url);
            console.log(encodedUrl);
            this.http.get(encodedUrl, {}, {})
                .then(datafrmapi => {
                  let innerExt = JSON.parse(datafrmapi.data);
                  console.log("Inner circle sent",innerExt);
                  this.updateIfsyncAndExtOfInnerCircle(innerExt, dataFrmInnerCircle.rows.item(j).id);
                })
                .catch(error => {
                  console.log(error.status);
                  console.log(error.error); // error message as string
                  console.log(error.headers);
                });
          }

        },(error)=>{
          console.log(error);
        });
      }
    });
  }
  public updateIfsyncAndExtOfInnerCircle (v, id) {
    let ifsync = 1;
    console.log("inner ext",v);
    console.log("id",id);

    this.storage.executeSql("UPDATE InnerCircleTable SET InnerCircleIdExt=?,IfSync=? WHERE Id = ?", [v, ifsync, id]).then((data) => {
      console.log(data);
    },(err)=>{
      console.log(err);
    });
  }

  public saveWholeInterestList () {

    let url = this.apiUrl + "interest/getInterest?GetType=0&Id=0";

    let encodedUrl = encodeURI(url);

    this.http.get(encodedUrl, {}, {})
        .then(datafrmapi => {

          let data = JSON.parse(datafrmapi.data);
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              this.storage.executeSql("INSERT INTO InterestList (InterestId,InterestName,PictureLocation) VALUES (?,?,?)",
                  [data[i].InterestId, data[i].InterestName, data[i].PictureLocation,]).then((dataDel) => {
              }, (errorDel) => {
              });
            }
          }
          // this.storage.executeSql("DELETE  FROM InnerCircleDelete WHERE id = ?", [data.rows.item(i).id]).then((dataDel) => {
          // }, (errorDel) => {
          // });
        })
        .catch(error => {
          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);
        });
  }

  public getWholeInterestList () {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM InterestList", []).then((data) => {
        let interest = [];
        if (data.rows.length > 0) {

          for (let i = 0; i < data.rows.length; i++) {
            interest.push({
              InterestId: data.rows.item(i).InterestId,
              InterestedId: data.rows.item(i).InterestedId,
              InterestName: data.rows.item(i).InterestName,
              PictureLocation: data.rows.item(i).PictureLocation,
            });
          }
        }
        console.log("interest", interest);
        resolve(interest);
      }, (error) => {
        reject(error);
      });
    });
  }

  public addInterestToContact (contactid, contactidext, interestidext) {
    return new Promise((resolve, reject) => {
      let ifsync = 0;
      this.storage.executeSql("SELECT * FROM InterestList WHERE InterestId=?", [interestidext]).then((dataIntList) => {
        this.storage.executeSql("INSERT INTO InterestTable (ContactId,ContactIdExt,InterestIdExt,InterestName,PictureLocation,IfSync) VALUES (?,?,?,?,?,?)",
            [contactid, contactidext, interestidext, dataIntList.rows.item(0).InterestName, dataIntList.rows.item(0).PictureLocation, ifsync]).then((data) => {

          resolve(data);
        }, (errorDel) => {
          reject(errorDel);
        });
      });
    });
  }
  public addInterestInContact(contactid, contactidext,interestname,ifsync)
  {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO InterestTable (ContactId,ContactIdExt,InterestName,IfSync) VALUES (?,?,?,?)",
          [contactid, contactidext, interestname, ifsync]).then((data) => {

        resolve(data);
      }, (errorDel) => {
        reject(errorDel);
      });

    });

  }
  public addInterestInContactOnline(contactid, contactidext,interestidext,interestname,ifsync)
  {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO InterestTable (ContactId,ContactIdExt,InterestIdExt,InterestName,IfSync) VALUES (?,?,?,?,?)",
          [contactid, contactidext, interestidext,interestname, ifsync]).then((data) => {
      console.log("interest" + data)
        resolve(data);
      }, (errorDel) => {
          console.log("interest" + errorDel)

          reject(errorDel);
      });

    });

  }

  public addInterestToContactWhenOnline (contactid, contactidext, interestidext, InterestedId) {
    return new Promise((resolve, reject) => {
      let ifsync = 1;

      this.storage.executeSql("SELECT * FROM InterestList WHERE InterestId=?", [interestidext]).then((dataIntList) => {
        // this.storage.executeSql("SELECT * FROM InterestTable WHERE ContactIdExt=?", [interestidext]).then((dataIntList) => {
        // });
        let bool: boolean;
        this.storage.executeSql("SELECT * FROM InterestTable WHERE ContactId=?", [contactid]).then((dataCheck) => {
          if (dataCheck.rows.length > 0) {
            bool = false;
            for (let i = 0; i < dataCheck.rows.length; i++) {
              if (dataCheck.rows.item(i).InterestIdExt == interestidext) {
                bool = true;
              }
            }
            if (bool == false) {
              this.storage.executeSql("INSERT INTO InterestTable (ContactId,ContactIdExt,InterestIdExt,InterestedId,InterestName,PictureLocation,IfSync) VALUES (?,?,?,?,?,?,?)",
                  [contactid, contactidext, interestidext, InterestedId, dataIntList.rows.item(0).InterestName, dataIntList.rows.item(0).PictureLocation, ifsync]).then((data) => {
                  console.log("Interest added"+data);
                resolve(data);
              }, (errorDel) => {
                  console.log("Interest added"+errorDel);

                  reject(errorDel);
              });
            }
          } else {
            this.storage.executeSql("INSERT INTO InterestTable (ContactId,ContactIdExt,InterestIdExt,InterestedId,InterestName,PictureLocation,IfSync) VALUES (?,?,?,?,?,?,?)",
                [contactid, contactidext, interestidext, InterestedId, dataIntList.rows.item(0).InterestName, dataIntList.rows.item(0).PictureLocation, ifsync]).then((data) => {
                console.log("Interest added"+data);

              resolve(data);
            }, (errorDel) => {
                console.log("Interest added"+errorDel);

                reject(errorDel);
            });
          }
        });
      });
    });
  }

  public getInterestForContact (contactid) {
    return new Promise((resolve, reject) => {
      // let ifsync = 0;
      let interest = [];
      this.storage.executeSql("SELECT * FROM InterestTable WHERE ContactId=?", [contactid]).then((dataIntList) => {
        if (dataIntList.rows.length > 0) {
          for (let i = 0; i < dataIntList.rows.length; i++) {
            interest.push({
              id: dataIntList.rows.item(i).id,
              ContactId: dataIntList.rows.item(i).ContactId,
              ContactIdExt: dataIntList.rows.item(i).ContactIdExt,
              InterestIdExt: dataIntList.rows.item(i).InterestIdExt,
              InterestName: dataIntList.rows.item(i).InterestName,
              PictureLocation: dataIntList.rows.item(i).PictureLocation,
            });
          }
        }
        resolve(interest);
      }, (errorDel) => {
        reject(errorDel);
      });
    });
  }

  public getInterestForContactFrmApi () {
    return new Promise((resolve, reject) => {

      this.storage.executeSql("SELECT * FROM Contact", []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            let url = this.apiUrl + "interest/getInterest?GetType=2&Id=" + data.rows.item(i).ContactIdExt;
            let encodedUrl = encodeURI(url);
            this.http.get(encodedUrl, {}, {})
                .then(dataFrmApi => {
                  let dataApi = JSON.parse(dataFrmApi.data);
                  if (dataApi.length > 0) {
                    for (let j = 0; j < dataApi.length; j++) {
                      this.addInterestInContactOnline(data.rows.item(i).ContactId, data.rows.item(i).ContactIdExt, dataApi[j].InterestId,dataApi[j].InterestName,1);
                    }
                  }
                  resolve();
                })
                .catch(error => {
                  reject();
                });
          }
        }
        resolve();
      }, (err) => {
        reject();
      });
    });
  }

  public addInterestToDeleteTable (contactid, interestid) {
    this.storage.executeSql("INSERT INTO InterestDelete (ContactId,InterestId) VALUES (?,?)", [contactid, interestid]).then((data) => {
    }, (error) => {
    });
  }

  public checkInterestDelete () {
    this.storage.executeSql("SELECT * FROM InterestDelete  ", []).then((data) => {
      //http
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length - 1; i++) {

          let url = this.apiUrl + "interest/deleteContactInterest?Id=" + data.rows.item(i).InterestId;

          let encodedUrl = encodeURI(url);

          this.http.get(encodedUrl, {}, {})
              .then(data => {
              })
              .catch(error => {
              });
          this.storage.executeSql("DELETE  FROM InterestDelete WHERE id = ?", [data.rows.item(i).id]).then((dataDel) => {
          }, (errorDel) => {
          });
        }
      }
    });
  }

  // public checkInterestTable () {
  //   this.storage.executeSql("SELECT * FROM Contact", []).then((dataIntList) => {
  //     if (dataIntList.rows.length) {
  //       for (let i = 0; i < dataIntList.rows.length - 1; i++) {
  //         this.storage.executeSql("SELECT * FROM InterestTable WHERE ContactId=?", [dataIntList.rows.item(i).ContactId]).then((dataInter) => {
  //           this.http.get(this.apiUrl + "interest/getInterest?GetType=2&Id=" + dataIntList.rows.item(i).ContactIdExt, {}, {})
  //               .then(dataApi => {
  //                 let dataFrmApi = JSON.parse(dataApi.data);
  //                 if (dataFrmApi.length == dataInter.rows.length) {
  //                 } else if (dataFrmApi.length < dataInter.rows.length) {
  //                   this.addInterestToApi();
  //                 } else if (dataFrmApi.length > dataInter.rows.length) {
  //                   this.getInterestForContactFrmApi();
  //                 }
  //               })
  //               .catch(error => {
  //                 console.log(error.status);
  //                 console.log(error.error); // error message as string
  //                 console.log(error.headers);
  //               });
  //         });
  //       }
  //     }
  //   });
  // }

  public addInterestToApi () {
    console.log("addInterestToApi");
    this.syncAll(this.userIdFromDB,this.userEmail);
    this.storage.executeSql("SELECT * FROM InterestTable WHERE IfSync = 0", []).then((dataInter) => {
      if (dataInter.rows.length > 0) {
        for (let i = 0; i < dataInter.rows.length - 1; i++) {

          // let url = this.apiUrl + "interest/AddContactInterest?ContactId=" + dataInter.rows.item(i).ContactIdExt + "&InterestListId=" + dataInter.rows.item(i).InterestIdExt;

          let url = this.apiUrl+"interest/save?ContactId="+dataInter.rows.item(i).ContactIdExt+"&InterestName="+dataInter.rows.item(i).InterestName;
          let encodedUrl = encodeURI(url);

          this.http.get(encodedUrl, {}, {})
              .then(dataApi => {
                let parsedData = JSON.parse(dataApi.data);
                this.updateInterestId(dataInter.rows.item(i).id,parsedData);
              })
              .catch(error => {
                console.log(error.status);
                console.log(error.error); // error message as string
                console.log(error.headers);
              });
        }
      }
    });
  }
  public updateInterestId(id,intExt)
  {
    this.storage.executeSql("UPDATE InterestTable SET InterestIdExt=? WHERE id =? ",[intExt,id]).then((data)=>{

    });

  }
  public updateProfilePic (name, contactid) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE Contact SET ProfilePicture=? WHERE ContactId = ?", [name, contactid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public updateGroupContactPicture (name, groupid) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE GroupTable SET ProfilePicture=? WHERE GroupId = ?", [name, groupid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public updateGroupContactPictureBasedOnExt (name, groupid) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE GroupTable SET ProfilePicture=? WHERE GroupIdExt = ?", [name, groupid]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }



  public updateRemainderFlag (id) {
    this.storage.executeSql("UPDATE RemainderTable SET UpdateSync=1 WHERE RemainderId = ?", [id]).then((data) => {
    }, (error) => {
    });
  }
  public updateInnercircleFlag (id) {
    this.storage.executeSql("UPDATE InnerCircleTable SET UpdateSync=1 WHERE id = ?", [id]).then((data) => {
    }, (error) => {
    });
  }

  public updateFlagCheck (id) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("UPDATE Contact SET UpdateSync=1 WHERE ContactId = ?", [id]).then((data) => {

      }, (error) => {

      });
    });

  }

  public syncAll(userid,email)
  {

    console.log("welcome to sync all"+email,userid);

    let url = this.apiUrl +"Contact/SynchContactInfo?EmailId=" + email+"&UserId="+userid;

    let encodedUrl = encodeURI(url);

    this.http.get(encodedUrl, {}, {})
        .then(dataApi => {

          console.log("Sent to server result" + dataApi.data);

          // console.log("Email sent is" + dataInter.rows.item(i).Email);
          // this.updateSyncEmailCheckSync(dataInter.rows.item(i).ContactId);
          // if (dataInter.rows.length == i)
          // {
          //   resolve(dataInter);
          // }

        })
        .catch(error => {

          // if (dataInter.rows.length == i)
          // {
          //   resolve(dataInter);
          // }
          // console.log(error.status);

          console.log("Error sending to sentient to backup sync"+error.error); // error message as string

          // console.log(error.headers);
        });
  }
  public checkContactUpdate()
  {
    console.log("checkContactUpdate");
    let end = false;
          this.storage.executeSql("SELECT * FROM Contact WHERE UpdateSync=0", []).then((dataInter) => {
              console.log("No of rows" + dataInter.rows.length);
              if (dataInter.rows.length > 0) {
                this.checkInnerCircleSettings();

                for (let i = 0; i < dataInter.rows.length ; i++) {

                    let firstname = dataInter.rows.item(i).Firstname;
                    let lastname = dataInter.rows.item(i).Lastname;
                    let contactfrmdb = dataInter.rows.item(i).ContactIdExt;
                    let modifiedon = dataInter.rows.item(i).ModifiedOn;
                    let email = dataInter.rows.item(i).Email;
                    let phonenumber = dataInter.rows.item(i).PhoneNumber;
                    let officenumber = dataInter.rows.item(i).OfficeNumber;
                    let position = dataInter.rows.item(i).Position;
                    let company = dataInter.rows.item(i).Company;
                    let favorites = dataInter.rows.item(i).Favorites;
                    let profession = dataInter.rows.item(i).Profession;
                    let anniversary = dataInter.rows.item(i).Anniversary;
                    let location = dataInter.rows.item(i).Location;
                    let fav;
                    if (favorites > 0) {
                      fav = true;
                    }
                    else {
                      fav = false;
                    }
                    let relationship = dataInter.rows.item(i).RelationShip;
                    let birthday = dataInter.rows.item(i).BirthdayOn;
                    let notes = dataInter.rows.item(i).Notes;
                    if(lastname == null || lastname == "")
                    {
                        lastname = "";
                    }
                    if(email == null || email == "")
                    {
                        email = "";
                    }
                    if(phonenumber == null || phonenumber == "" || phonenumber == " ")
                    {
                        phonenumber = "";
                    }
                    if(officenumber == null || officenumber == "")
                    {
                        officenumber = "";
                    }
                    if(position == null || position == "")
                    {
                        position = "";
                    }
                    if(company == null || company == "")
                    {
                        company = "";
                    }
                    if(birthday == null || birthday == "")
                    {
                        birthday = "";
                    }
                    if(relationship == null || relationship == "")
                    {
                        relationship = "";
                    }
                    if(notes == null || notes == "")
                    {
                        notes = "";
                    }
                    if(profession == null || profession == "")
                    {
                        profession = "";
                    }
                    if(anniversary == null || anniversary == "")
                    {
                        anniversary = "";
                    }
                    if(location == null || location == "")
                    {
                        location = "";
                    }

                    // console.log(dataInter.rows.item(i).Firstname);
                    // console.log(dataInter.rows.item(i).Lastname);
                    // console.log(dataInter.rows.item(i).ContactIdExt);
                    // console.log(dataInter.rows.item(i).Email);
                    // console.log(dataInter.rows.item(i).PhoneNumber);
                    // console.log(dataInter.rows.item(i).OfficeNumber);
                    // console.log(dataInter.rows.item(i).Position);
                    // console.log(dataInter.rows.item(i).Company);
                    // console.log(dataInter.rows.item(i).Favorites);
                    // console.log(dataInter.rows.item(i).Profession);
                    // console.log(dataInter.rows.item(i).Anniversary);
                    // console.log(dataInter.rows.item(i).RelationShip);
                    // console.log(dataInter.rows.item(i).BirthdayOn);
                    // console.log(dataInter.rows.item(i).Notes);

                  let url = this.apiUrl + "Contact/Save?ContactId="+contactfrmdb+"&UserId="+this.userIdFromDB+
                      "&FirstName="+firstname+"&LastName="+lastname+
                      "&EMail="+email+"&PhNo="+phonenumber+"&OfficeNo="+officenumber+"&Position="+position+
                      "&Company="+company+"&Relative="+relationship+"&Profilepic=test.pic&DOB="+birthday+"&Fav="+fav+
                      "&FavRating="+favorites+"&Notes="+notes+"&ModifyOn="+"01-01-2017"+"&Profession="+profession+"&AnnivasaryOn="+anniversary +"&Location="+location;

                  let encodedUrl = encodeURI(url);

                    this.http.get(encodedUrl, {}, {})
                          .then(dataApi => {
                            console.log("Contact updated through http api  " +firstname);
                              this.updateFlagCheck(dataInter.rows.item(i).ContactId);

                          })
                          .catch(error => {
                              console.log(error.status);
                              console.log("conatct update check error"+error.error); // error message as string
                              console.log(error.headers);
                          });
                  }
              } else {
                  console.log("No contact to sync");
                  this.checkInnerCircleSettings();
              }
          });
  }
  public checkUpdateReminder()
  {
    console.log("checkUpdateReminder");

    this.addInterestToApi();
    this.storage.executeSql("SELECT * FROM RemainderTable WHERE UpdateSync = 0", []).then((dataInter) => {

      if (dataInter.rows.length > 0) {

        for (let i = 0; i < dataInter.rows.length ; i++) {

          let active: boolean;
          if (dataInter.rows.item(0).IsActive == 0) {
            active = false;
          }
          else {
            active = true;
          }
          this.storage.executeSql("SELECT * FROM Contact WHERE ContactId=?", [dataInter.rows.item(i).ContactId]).then((dataCon) => {

            let url = this.apiUrl+"Reminder/saveReminder?ReminderId="+dataInter.rows.item(i).RemainderIdFrmExt+"&ContactId="+dataCon.rows.item(0).ContactIdExt+"&Command="+dataInter.rows.item(i).Description+"&Notes="+dataInter.rows.item(i).ShortNote+"&SetTime="+dataInter.rows.item(i).Time+"&SetDate="+dataInter.rows.item(i).Date+"&ReminderON="+active;

            let encodedUrl = encodeURI(url);


            this.http.get(encodedUrl,{},{}).then(dataApi => {
              this.updateRemainderFlag(dataInter.rows.item(i).RemainderId);
            })
                .catch(error => {

                  console.log(error.status);
                  console.log("reminder check error"+error.error); // error message as string
                  console.log(error.headers);
                });
          });

        }
      } else {
        console.log("No contact to sync");
      }
    });
  }
  public checkUpdateInnerCirlce()
  {
    console.log("checkUpdateInnerCirlce");
    this.storage.executeSql("SELECT * FROM InnerCircleTable WHERE UpdateSync=0", []).then((dataInter) => {

      if (dataInter.rows.length > 0) {
        this.checkUpdateReminder();

        for (let i = 0; i < dataInter.rows.length ; i++) {
          this.storage.executeSql("SELECT * FROM Contact WHERE ContactId = ?", [dataInter.rows.item(i).ContactId]).then((data) => {

            let url = this.apiUrl+"innercircle/saveContact?InnerCircleId=0&ContactId="
                +data.rows.item(0).ContactiIdExt+"&FName="+dataInter.rows.item(i).Firstname
                +"&LName="+dataInter.rows.item(i).Lastname+"&Profession="+dataInter.rows.item(i).Profession
                +"&Relation="+dataInter.rows.item(i).Relation+"&Notes="+dataInter.rows.item(i).Notes
                +"&DOB="+dataInter.rows.item(i).BirthdayOn+"&Annivasary="+dataInter.rows.item(i).Anniversary;

            let encodedUrl = encodeURI(url);

            this.http.get(encodedUrl, {}, {})
                .then(dataApi => {
                  this.updateInnercircleFlag(dataInter.rows.item(i).id);
                })
                .catch(error => {

                  console.log(error.status);
                  console.log(error.error); // error message as string
                  console.log(error.headers);
                });


          });


        }
      } else {
        this.checkUpdateReminder();

        console.log("No contact to sync");
      }
    });
  }
  public checkInterestNameExist(name,contactid)
  {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("SELECT * FROM InterestTable WHERE InterestName=? AND ContactId=?", [name,contactid]).then((dataInter) => {
        if(dataInter.rows.length >0)
        {
          resolve("already exist");
        }else
        {
          resolve("not exist");
        }
      },(error)=>{
        reject("fail");
      });
    })

    }
  public logout()
  {
    this.deleteDatabase();
  }

}

