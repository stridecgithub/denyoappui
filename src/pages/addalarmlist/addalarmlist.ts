import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlarmlogPage } from '../alarmlog/alarmlog';
import { AlarmlistdetailPage } from '../alarmlistdetail/alarmlistdetail';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { RolePage } from '../role/role';
import { AlarmPage } from '../alarm/alarm';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { OrgchartPage} from '../orgchart/orgchart';

/**
 * Generated class for the AddalarmlistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-addalarmlist',
  templateUrl: 'addalarmlist.html',
})
export class AddalarmlistPage {
 public msgcount: any;
  public notcount: any;
  public loginas: any;
  public companyid: any;
  public form: FormGroup;
  public assigned_to: any;
  public remark: any;
  public userdata = [];
  public subject: any;
  public uname: any;
  public assignedby: any;
  micro_timestamp: any;
  public userId: any;
   public isSubmitted: boolean = false;
  public responseResultCountry: any;
  public responseResultReportTo: any;
  // Flag to be used for checking whether we are adding/editing an entry
  public isEdited: boolean = false;
  public readOnly: boolean = false;
  public unitDetailData: any = {
    hashtag:''
  }

  // Flag to hide the form upon successful completion of remote operation
  public hideForm: boolean = false;
  public hideActionButton = true;
  // public isUploadedProcessing: boolean = false;
  // Property to help ste the page title
  public pageTitle: string;
  // Property to store the recordID for when an existing entry is being edited
  public recordID: any = null;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";

  constructor(public nav: NavController,
    public http: Http,
    public NP: NavParams,
    public fb: FormBuilder,
    public toastCtrl: ToastController) {
    this.loginas = localStorage.getItem("userInfoName");
    // Create form builder validation rules
    this.form = fb.group({
      "assigned_to": ["", Validators.required],
      "remark": ["", Validators.required],
      "subject": ["", Validators.required],
      "assignedby": ["", Validators.required]
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
    this.uname = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyid = localStorage.getItem("userInfoCompanyId");
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddalarmlistPage');
  }
  ionViewWillEnter() {
        this.unitDetailData.unitname = localStorage.getItem("unitunitname");
    this.unitDetailData.location = localStorage.getItem("unitlocation");
    this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
    this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
    console.log("Unit Details Color Code:" + this.unitDetailData.colorcodeindications);
    this.unitDetailData.lat = localStorage.getItem("unitlat");
    this.unitDetailData.lng = localStorage.getItem("unitlng");
    this.unitDetailData.rh = localStorage.getItem("runninghr");
    this.unitDetailData.ns = localStorage.getItem("nsd");
    this.getUserListData();

    if (this.NP.get("record")) {
      console.log(this.NP.get("act"));
      this.isEdited = true;
      this.selectEntry(this.NP.get("record"));
      // this.pageTitle = 'Edit Company Group';
      this.readOnly = false;
      this.hideActionButton = true;
    }
    else {
      this.isEdited = false;
      //this.pageTitle = 'New  Org Chart';
    }

    let //body: string = "loginid=" + this.userId,
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    this.http.get(url, options)
      .subscribe((data) => {
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
  }
  selectEntry(item) {
    this.subject = item.alarm_name;
    this.assignedby = this.uname;
    this.assigned_to = item.assigned_to;
    this.recordID = item.alarm_id;


  }
  getUserListData() {
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL +"/getstaffs?loginid=" + this.userId + "&company_id="+this.companyid;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe(data => {
        res = data.json();
        // console.log(data.json);
        this.responseResultReportTo = res.staffslist;
      });

  }
   address1get(hashtag) {
    console.log(hashtag);
    this.unitDetailData.hashtag = hashtag;
  }
  saveEntry() {
    this.isSubmitted=true;
    let body: string = "is_mobile=1&alarmid=" + this.recordID +
      "&alarm_assigned_by=" + this.userId +
      "&alarm_assigned_to=" + this.assigned_to +
      "&alarm_remark=" + this.remark +
      "&alarm_assigned_date=" + this.micro_timestamp,

      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/alarms/assignalarm";
    console.log(url);
    console.log(body);

    this.http.post(url, body, options)
      .subscribe((data) => {
        //console.log("Response Success:" + JSON.stringify(data.json()));
        // If the request was successful notify the user
        if (data.status === 200) {
          this.hideForm = true;
          this.sendNotification(`successfully Assigned`);
          localStorage.setItem("userPhotoFile", "");
          if(this.NP.get("record")=='alarm')
    {
    this.nav.setRoot(AlarmPage,
    {
      record: this.NP.get("record")
    });
  }
  else
  {
 this.nav.setRoot(CommentsinfoPage);
  }
        }
        // Otherwise let 'em know anyway
        else {
          this.sendNotification('Something went wrong!');
        }
      });
  }
  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }
  previous() {
    if(this.NP.get("from")=='alarm')
    {
    this.nav.setRoot(AlarmlistdetailPage,
    {
      record: this.NP.get("record")
    });
  }
  else
  {
 this.nav.setRoot(CommentsinfoPage);
  }
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
}
