import { Component, ViewChild, NgZone } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { UserPage } from '../user/user';
import { ServicinginfoPage } from '../servicinginfo/servicinginfo';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { RolePage } from '../role/role';
import { DatePicker } from '@ionic-native/date-picker';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage} from '../orgchart/orgchart';
/**
 * Generated class for the AddserviceinfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-addrequestsupport',
  templateUrl: 'addrequestsupport.html',
  providers: [Camera, Transfer, DatePicker]
})
export class AddrequestsupportPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  public photoInfo = [];
  public addedImgListsArray = [];
  public addedImgListsRequest = [];
  progress: number;
  public recordID: any;
  public service_unitid: any;
  public service_subject: any;
  public service_remark: any;
  public service_resources: any;
  public service_id: any;
  micro_timestamp: any;
  public msgcount: any;
  public notcount: any;
  public isSubmitted: boolean = false;
  public isUploadedProcessing: boolean = false;
  public isProgress = false;
  public isUploaded: boolean = true;
  item: any;
  public isEdited: boolean = false;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  form: FormGroup;
  public addedAttachList;
  public unitDetailData: any = {
    userId: '',
    loginas: '',
    pageTitle: '',
    getremark: '',
    addedImgLists1: '',
    addedImgLists2: ''
  }
  public hideActionButton = true;
  constructor(public http: Http, public alertCtrl: AlertController, private datePicker: DatePicker, public NP: NavParams, public nav: NavController, public toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, private transfer: Transfer,
    private ngZone: NgZone) {
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.unitDetailData.serviced_by = localStorage.getItem("userInfoName");
    this.addedImgListsRequest = [];
    this.form = formBuilder.group({
      profilePic: [''],
      service_subject: ['', Validators.required],
      service_remark: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });


    let already = localStorage.getItem("microtime");
    if (already != undefined && already != 'undefined' && already != '') {
      this.micro_timestamp = already;
    } else {
      let dateStr = new Date();
      let yearstr = dateStr.getFullYear();
      let monthstr = dateStr.getMonth();
      let datestr = dateStr.getDate();
      let hrstr = dateStr.getHours();
      let mnstr = dateStr.getMinutes();
      let secstr = dateStr.getSeconds();
      this.micro_timestamp = yearstr + "" + monthstr + "" + datestr + "" + hrstr + "" + mnstr + "" + secstr;

    }
    localStorage.setItem("microtime", this.micro_timestamp);
  }

  ionViewDidLoad() {
    this.addedImgListsRequest = [];
    console.log('ionViewDidLoad AddrequestsupportPage');
  }
  ionViewWillEnter() {
    this.addedImgListsRequest = [];
    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + localStorage.getItem("userInfoId");
    console.log(url);
    // console.log(body);

    this.http.get(url, options)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
    this.unitDetailData.unit_id = localStorage.getItem("unitId");
    if (this.unitDetailData.unit_id == undefined) {
      this.unitDetailData.unit_id = this.NP.get("record").unit_id;
    }
    if (this.unitDetailData.unit_id == 'undefined') {
      this.unitDetailData.unit_id = this.NP.get("record").unit_id;
    }
    if (this.NP.get("record")) {
      console.log("Np record param from previous" + JSON.stringify(this.NP.get("record")));
      this.selectEntry(this.NP.get("record"));


      if (this.NP.get("act") == 'Add') {
        this.service_remark = "";
        this.service_subject = "";

        this.isEdited = false;
        this.unitDetailData.pageTitle = 'Request Support Add';
        this.service_unitid = this.unitDetailData.unit_id;
      } else {
        this.service_unitid = this.unitDetailData.unit_id;
        this.unitDetailData.pageTitle = 'Request Support Edit';
        this.isEdited = true;
      }

      console.log("Service Unit Id:" + this.service_unitid);
    }




    this.unitDetailData.unit_id = localStorage.getItem("unitId");
    this.unitDetailData.unitname = localStorage.getItem("unitunitname");
    this.unitDetailData.location = localStorage.getItem("unitlocation");
    this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
    this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
    this.unitDetailData.favoriteindication = localStorage.getItem("unitfav");
    console.log("Add Comment Color Code:" + this.unitDetailData.colorcodeindications);
    this.unitDetailData.lat = localStorage.getItem("unitlat");
    this.unitDetailData.lng = localStorage.getItem("unitlng");
     this.unitDetailData.rh=localStorage.getItem("runninghr");
     this.unitDetailData.ns=localStorage.getItem("nsd");


  }



  takePictureURL(micro_timestamp) {
    this.isUploadedProcessing = true;
    const options: CameraOptions = {
      quality: 25,
      destinationType: this.camera.DestinationType.FILE_URI,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData);
      this.fileTrans(imageData, micro_timestamp);
      this.addedAttachList = imageData;
    }, (err) => {
      // Handle error
      this.sendNotification(err);
    });
  }

  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }

  fileTrans(path, micro_timestamp) {
    const fileTransfer: TransferObject = this.transfer.create();
    let currentName = path.replace(/^.*[\\\/]/, '');
    console.log("File Name is:" + currentName);

    //YmdHis_123_filename
    let dateStr = new Date();
    let year = dateStr.getFullYear();
    let month = dateStr.getMonth();
    let date = dateStr.getDate();
    let hr = dateStr.getHours();
    let mn = dateStr.getMinutes();
    let sec = dateStr.getSeconds();
    let d = new Date(),
      n = d.getTime(),
      newFileName = year + "" + month + "" + date + "" + hr + "" + mn + "" + sec + "_123_" + n + ".jpg";

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: newFileName,
      headers: {},
      chunkedMode: false,
      mimeType: "text/plain",
    }




    //  http://127.0.0.1/ionic/upload_attach.php
    //http://amahr.stridecdev.com/getgpsvalue.php?key=create&lat=34&long=45
    fileTransfer.onProgress(this.onProgress);
    fileTransfer.upload(path, this.apiServiceURL + '/fileupload.php?micro_timestamp=' + micro_timestamp, options)
      .then((data) => {

         console.log("Upload Response is" + JSON.stringify(data))
        let res = JSON.parse(data.response);
        console.log(res.id);
        console.log(JSON.stringify(res));

        let imgSrc;
        imgSrc = this.apiServiceURL + "/serviceimages" + '/' + newFileName;
        this.addedImgListsRequest.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: newFileName,
          resouce_id:res.id
        });

        //loading.dismiss();
        if (this.addedImgListsRequest.length > 9) {
          this.isUploaded = false;
        }
        this.progress += 5;
        this.isProgress = false;
        this.isUploadedProcessing = false;
        return false;



        // Save in Backend and MysQL
        //this.uploadToServer(data.response);
        // Save in Backend and MysQL
      }, (err) => {
        //loading.dismiss();
        console.log("Upload Error:" + JSON.stringify(err));
        this.sendNotification("Upload Error:" + JSON.stringify(err));
      })
  }

  onProgress = (progressEvent: ProgressEvent): void => {
    this.ngZone.run(() => {
      if (progressEvent.lengthComputable) {
        let progress = Math.round((progressEvent.loaded / progressEvent.total) * 95);
        this.isProgress = true;
        this.progress = progress;
      }
    });
  }

  saveEntry() {
    console.log(this.form.controls);
    if (this.isUploadedProcessing == false) {
      /* let name: string = this.form.controls["lat"].value,
         description: string = this.form.controls["long"].value,
         photos: object = this.addedImgLists;*/


      let service_remark: string = this.form.controls["service_remark"].value,
        service_subject: string = this.form.controls["service_subject"].value;

      console.log("service_remark:" + service_remark);

      console.log("service_subject:" + service_subject);
      console.log("nextServiceDate:" + this.unitDetailData.nextServiceDate);
      console.log("Image Data" + JSON.stringify(this.addedImgListsRequest));
      //let d = new Date();
      //let micro_timestamp = d.getFullYear() + "" + d.getMonth() + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
      if (this.isEdited) {
        this.updateEntry(service_remark, service_subject, this.addedImgListsRequest, this.unitDetailData.hashtag, this.unitDetailData.nextServiceDate, this.micro_timestamp);
      }
      else {
        this.createEntry(service_remark, service_subject, this.addedImgListsRequest, this.unitDetailData.hashtag, this.unitDetailData.nextServiceDate, this.micro_timestamp);
      }
    }
  }

  // Save a new record that has been added to the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of create followed by the key/value pairs
  // for the record data
  createEntry(service_remark, service_subject, addedImgLists, remarkget, nextServiceDate, micro_timestamp) {
    this.isSubmitted = true;
    let body: string = "is_mobile=1" +
      "&service_unitid=" + this.service_unitid +
      "&service_remark=" + service_remark +
      "&service_subject=" + service_subject +
      "&micro_timestamp=" + micro_timestamp +
      "&serviced_by=" + this.unitDetailData.userId +
      "&is_denyo_support=1" +
      "&uploadInfo=" + JSON.stringify(this.addedImgListsRequest),
      //"&contact_number=" + this.contact_number +
      //"&contact_name=" + this.contact_name +
      //"&nextServiceDate=" + nextServiceDate,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/store";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          localStorage.setItem("microtime", "");
          this.sendNotification(`Servicing info was successfully added`);
          localStorage.setItem("atMentionResult", '');
          this.nav.setRoot(ServicinginfoPage, {
            record: this.NP.get("record")
          });
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }



  // Update an existing record that has been edited in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of update followed by the key/value pairs
  // for the record data
  updateEntry(service_remark, service_subject, addedImgLists, remarkget, nextServiceDate, micro_timestamp) {
    this.isSubmitted = true;
    let body: string = "is_mobile=1&service_id=" + this.service_id +
      "&service_unitid=" + this.service_unitid +
      "&service_remark=" + service_remark +
      "&next_service_date=" + nextServiceDate +
      "&serviced_by=" + this.unitDetailData.userId +
      "&service_subject=" + service_subject +
      "&is_denyo_support=1" +
      "&micro_timestamp=" + micro_timestamp +
      "&uploadInfo=" + JSON.stringify(this.addedImgListsRequest),

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/services/update";
    console.log(url);
    console.log(body);
    this.http.post(url, body, options)
      .subscribe(data => {
        console.log(data);
        // If the request was successful notify the user
        if (data.status === 200) {
          localStorage.setItem("microtime", "");
          this.sendNotification(`Servicing info  was successfully updated`);
          localStorage.setItem("atMentionResult", '');
          this.nav.setRoot(ServicinginfoPage, {
            record: this.NP.get("record")
          });
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }

  getNextDate(val, field) {
    console.log('1' + val);
    let date;
    if (val > 0) {
      date = this.addDays(val);
    } else {
      this.showDatePicker();
    }

  }



  addDays(days) {
    let result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }
  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        this.unitDetailData.nextServiceDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        console.log('Got date: ', date)
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }
  address1get(hashtag) {
    console.log(hashtag);
    this.unitDetailData.hashtag = hashtag;
  }





  selectEntry(item) {

    this.service_subject = item.service_subject;
    this.service_remark = item.service_remark;
    this.service_resources = item.service_resources;
    this.unitDetailData.nextServiceDate = item.next_service_date;
    this.service_resources = item.service_resources;

    if (this.service_resources != undefined && this.service_resources != 'undefined' && this.service_resources != '') {
      let hashhypenhash = this.service_resources.split("#-#");
      for (let i = 0; i < hashhypenhash.length; i++) {
        let imgDataArr = hashhypenhash[i].split("|");
        let imgSrc;
        imgSrc = this.apiServiceURL + "/serviceimages" + '/' + imgDataArr[1];
        this.addedImgListsRequest.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: imgDataArr[1],
          resouce_id: imgDataArr[0]
        });
      }
      console.log("this.addedImgListsRequest" + JSON.stringify(this.addedImgListsRequest));
      console.log("Length is:" + this.addedImgListsRequest.length);

      if (this.NP.get("act") == 'Add') {
        console.log("Fresh Clear add request support info.ts start...");
        this.addedImgListsRequest = [];
        this.addedImgListsRequest.length = 0;
        this.service_subject = '';
        this.service_remark = '';
      }
      if (this.addedImgListsRequest.length > 9) {
        this.isUploaded = false;
      }
    }
  }
  doRemoveResouce(id, item) {
    console.log("Deleted Id" + id);
    let confirm = this.alertCtrl.create({
      message: 'Are you sure you want to delete this file?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteEntry(id);
          for (let q: number = 0; q < this.addedImgListsRequest.length; q++) {
            if (this.addedImgListsRequest[q] == item) {
              this.addedImgListsRequest.splice(q, 1);
            }
          }
        }
      },
      {
        text: 'No',
        handler: () => { }
      }]
    });
    confirm.present();
  }


  // Remove an existing record that has been selected in the page's HTML form
  // Use angular's http post method to submit the record data
  // to our remote PHP script (note the body variable we have created which
  // supplies a variable of key with a value of delete followed by the key/value pairs
  // for the record ID we want to remove from the remote database
  deleteEntry(recordID) {
    let
      //body: string = "key=delete&recordID=" + recordID,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/" + recordID + "/removeresource";
    this.http.get(url, options)
      .subscribe(data => {
        // If the request was successful notify the user
        if (data.status === 200) {
          this.sendNotification(`Congratulations file was successfully deleted`);
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }
  previous() {
    this.nav.setRoot(ServicinginfoPage, {
      record: this.NP.get("record")
    });
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

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Attention',

      message: 'Be requesting for Denyo Service Support',
      buttons: [
        {
          text: 'Confirm',
          handler: () => {
            this.saveEntry();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.isSubmitted = false;
            console.log('Cancel clicked');
          }
        }
      ],
      cssClass: 'alertDanger'
    });
    confirm.present();
  }

}

