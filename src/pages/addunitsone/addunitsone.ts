import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Keyboard } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/map';
import { AddunitstwoPage } from '../addunitstwo/addunitstwo';
import { UserPage } from '../user/user';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { RolePage } from '../role/role';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { Http, Headers, RequestOptions } from '@angular/http';
import { OrgchartPage } from '../orgchart/orgchart';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

/**
 * Generated class for the AddcompanygroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addunitsone',
  templateUrl: 'addunitsone.html',
  providers: [NativeGeocoder]
})
export class AddunitsonePage {
  // Define FormBuilder /model properties
  public loginas: any;
  public form: FormGroup;
  public location: any;
  public userId: any;
  public lat: any;
  public msgcount: any;
  public notcount: any;
  public lang: any;
  public responseResultCountry: any;
  progress: number;
  public isProgress = false;
  public isUploaded: boolean = true;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public addedImgLists: any;
  public userInfo = [];
  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  public isUploadedProcessing: boolean = false;
  public uploadResultBase64Data;
  showFooter: boolean = true;
  constructor(public http: Http, public keyboard: Keyboard, private nativeGeocoder: NativeGeocoder, public nav: NavController,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, ) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "location": ["", Validators.required]
    });
    this.userId = localStorage.getItem("userInfoId");
    this.keyboardCheck();
  }

  keyboardCheck() {
    if (this.keyboard.isOpen()) {
      // You logic goes here
      this.showFooter = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddunitsonePage');
    this.pageLoadedData();
  }

  pageLoadedData() {

    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    console.log(url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    this.resetFields();
    console.log("this.NP.get('record')" + JSON.stringify(this.NP.get("record")));
    if (this.NP.get("record")) {
      console.log("Add User:" + JSON.stringify(this.NP.get("record")));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      this.pageTitle = 'Edit Units';
      this.readOnly = false;
      this.hideActionButton = true;
      let editItem = this.NP.get("record");
      this.location = editItem.location;
    }
    else {
      if (localStorage.getItem("location")) {
        this.location = localStorage.getItem("location");
      }
      this.isEdited = false;
      this.pageTitle = 'New  Units';
    }

    // Get local
    /* if (localStorage.getItem("location")) {
       this.location = localStorage.getItem("location");
     }*/
    //
  }
  // Determine whether we adding or editing a record
  // based on any supplied navigation parameters
  ionViewWillEnter() {
    this.pageLoadedData();
  }



  // Assign the navigation retrieved data to properties
  // used as models on the page's HTML form
  selectEntry(item) {
    this.location = item.location;
    this.recordID = item.userid;
    this.getGps();
  }



  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(location, createdby) {
    this.userInfo.push({
      location: location,
      createdby: createdby,
      latitude: this.lat,
      longitude: this.lang
    });
    this.nav.setRoot(AddunitstwoPage, {
      accountInfo: this.userInfo
    });

  }



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(location, createdby) {
    this.userInfo.push({
      location: location,
      createdby: createdby,
      latitude: this.lat,
      longitude: this.lang
    });
    this.nav.setRoot(AddunitstwoPage, {
      accountInfo: this.userInfo,
      record: this.NP.get("record")
    });
  }



  // Handle data submitted from the page's HTML form
  // Determine whether we are adding a new record or amending an
  // existing record
  saveEntry() {
    let location: string = this.form.controls["location"].value;

    // Local Storage for Back to Previous for handled that data
    // localStorage.setItem("location", location);
    // Local Storage for Back to Previous for handled that data

    console.log(this.form.controls);
    /*if (this.addedImgLists) {
      this.isUploadedProcessing = true;
    }*/
    if (this.isUploadedProcessing == false) {
      if (this.isEdited) {
        this.updateEntry(location, this.userId);
      }
      else {
        this.createEntry(location, this.userId);
      }
    }
  }



  // Clear values in the page's HTML form fields
  resetFields(): void {
    this.location = "";
  }



  // Manage notifying the user of the outcome
  // of remote operations
  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
  presentLoading(parm) {
    let loader;
    loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    if (parm > 0) {
      loader.present();
    } else {
      loader.dismiss();
    }
  }
  previous() {
    this.nav.setRoot(UnitsPage);
  }

  notification() {
    this.nav.setRoot(NotificationPage);
  }
  redirectToUser() {
    this.nav.setRoot(UnitsPage);
  }
  redirectToMessage() {
    this.nav.setRoot(EmailPage);
  }
  redirectCalendar() {
    this.nav.setRoot(CalendarPage);
  }
  redirectToMaps() {
    this.nav.setRoot(MapsPage);
  }
  redirectToSettings() {
    this.nav.setRoot(OrgchartPage);
  }

  getGps() {
    let locationSplit = this.location.split(",");
    for (let i = 0; i < locationSplit.length; i++) {
      if (i == 0) {
        console.log(locationSplit[i]);
        this.nativeGeocoder.forwardGeocode(locationSplit[i])
          .then((coordinates: NativeGeocoderForwardResult) => {
            console.log('The coordinates are latitude=' + coordinates.latitude + ' and longitude=' + coordinates.longitude)
            this.lat = coordinates.latitude;
            this.lang = coordinates.longitude;
          }
          )
          .catch((error: any) => console.log(error));
      }
    }
  }
}

