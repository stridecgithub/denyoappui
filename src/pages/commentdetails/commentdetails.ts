import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserPage } from '../user/user';
import { CommentsinfoPage } from '../commentsinfo/commentsinfo';
import { UnitgroupPage } from '../unitgroup/unitgroup';
import { RolePage } from '../role/role';
import { CompanygroupPage } from '../companygroup/companygroup';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { Http, Headers, RequestOptions } from '@angular/http';
import { OrgchartPage} from '../orgchart/orgchart';
import 'rxjs/add/operator/map';

/**
 * Generated class for the CommentdetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-commentdetails',
  templateUrl: 'commentdetails.html'

})
export class CommentdetailsPage {
  public msgcount: any;
  public notcount: any;
  isReadyToSave: boolean;
  public photoInfo = [];
  public addedImgListsArray = [];
  public addedImgLists = [];
  progress: number;
  public recordID: any;
  public photo: any;
  public cdate: any;
  public comment_unitid: any;
  public comment_id: any;
  public udetails: any;
  public comments: any;
  public comment_by_name: any;
  public comment_remark: any;
  public comment_subject: any;
  public comment_priority: any;
  public comment_resources: any;
  public service_priority_class1: any;
  public service_priority_class2: any;
  micro_timestamp: any;
  public isUploadedProcessing: boolean = false;
  public isProgress = false;
  public isUploaded: boolean = true;
  item: any;
  public userId: any;
  public isEdited: boolean = false;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  form: FormGroup;
  public addedAttachList;
  public unitDetailData: any = {
    userId: '',
    loginas: '',
    pageTitle: '',
    getremark: '',
    serviced_by: '',
    nextServiceDate: '',
    addedImgLists1: '',
    addedImgLists2: ''
  }
  public hideActionButton = true;
  constructor(public http: Http, public alertCtrl: AlertController, public NP: NavParams, public nav: NavController, public toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController, formBuilder: FormBuilder

  ) {
    this.userId = localStorage.getItem("userInfoId");
    this.service_priority_class1 = "-outline";
    this.service_priority_class2 = "-outline";
    this.unitDetailData.loginas = localStorage.getItem("userInfoName");
    this.unitDetailData.userId = localStorage.getItem("userInfoId");
    this.udetails = localStorage.getItem("unitdetails");
    console.log(JSON.stringify(this.udetails));



    this.comment_priority = 0;
    // Watch the form for changes, and



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
    console.log('ionViewDidLoad CommentdetailsPage');
  }
  ionViewWillEnter() {

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
    this.getPrority(1);
    this.udetails = localStorage.getItem("unitdetails");
    console.log("UD" + JSON.stringify(this.udetails));
    console.log("comment:" + JSON.stringify(this.NP.get("record")));
    if (this.NP.get("record")) {

      if (this.NP.get("act") != 'Push') {
        this.selectEntry(this.NP.get("record"));
        this.comment_id = this.NP.get("record").comment_id;
        if (this.NP.get("act") == 'Add') {
          this.isEdited = false;
          this.unitDetailData.pageTitle = 'Add Comments';
          this.comment_unitid = this.NP.get("unit_id");
        } else {
          this.comment_unitid = this.NP.get("record").comment_unit_id;
          this.unitDetailData.pageTitle = 'Edit Comments';
          this.isEdited = true;
        }
        console.log("Comment Unit Id:" + this.comment_unitid);

        localStorage.setItem("iframeunitId",  this.comment_unitid);
        localStorage.setItem("unitId",  this.comment_unitid);
      } else {
        /*console.log('Push');
        let //body: string = "loginid=" + this.userId,
          type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers1: any = new Headers({ 'Content-Type': type1 }),
          options1: any = new RequestOptions({ headers: headers1 }),
          url1: any = this.apiServiceURL + "getcommentdetails/" + this.NP.get("record");
        console.log(url1);
        this.http.get(url1, options1)
          .subscribe((data) => {
            console.log("getcommentdetails Response Success:" + JSON.stringify(data.json()));
            console.log("comments Details:" + data.json().comments);
            this.selectEntry(data.json().servicedetail);
          });*/

        console.log('Push');
        let body: string = "commentid=" + this.NP.get("record"),
          type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers1: any = new Headers({ 'Content-Type': type1 }),
          options1: any = new RequestOptions({ headers: headers1 }),
          url1: any = this.apiServiceURL + "/getcommentdetails";
        console.log(url1);
        this.http.post(url1, body, options1)
          //this.http.get(url1, options1)
          .subscribe((data) => {
            console.log("servicebyid Response Success:" + JSON.stringify(data.json()));
            console.log("Service Details:" + data.json().comments[0]);
            this.selectEntry(data.json().comments[0]);
          });
      }
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

    //localStorage.setItem("iframeunitId", this.comment_unitid);
   // localStorage.setItem("unitId", this.comment_unitid);
  }
  getPrority(val) {
    this.comment_priority = val
  }
  selectEntry(item) {
    console.log("Comment Unit Id" + JSON.stringify(item));

    this.comments = item.comments;
    this.comment_subject = item.comment_subject;
    localStorage.setItem("unitId", item.comment_unit_id);
    localStorage.setItem("iframeunitId", item.comment_unit_id);
    this.comment_by_name = item.comment_by_name;
    this.comment_priority = item.comment_priority;
    this.comment_remark = item.comment_remark;
    this.photo = item.user_photo;
    this.cdate = item.comment_date_formatted + "(" + item.time_ago + ")";
    console.log("X" + this.comment_priority);
    if (this.comment_priority == "1") {
      this.service_priority_class1 = '';
      console.log("Y");
    } else if (this.comment_priority == "2") {
      this.service_priority_class2 = '';
      console.log("Z");
    }

    this.comment_resources = item.comment_resources;
    this.unitDetailData.nextServiceDate = item.next_service_date;
    this.comment_resources = item.comment_resources;

    if (this.comment_resources != undefined && this.comment_resources != 'undefined' && this.comment_resources != '') {
      let hashhypenhash = this.comment_resources.split("#-#");
      for (let i = 0; i < hashhypenhash.length; i++) {
        let imgDataArr = hashhypenhash[i].split("|");
        let imgSrc;
        imgSrc = this.apiServiceURL + "/commentimages" + '/' + imgDataArr[1];
        this.addedImgLists.push({
          imgSrc: imgSrc,
          imgDateTime: new Date(),
          fileName: imgDataArr[1],
          resouce_id: imgDataArr[0]
        });
      }

      if (this.addedImgLists.length > 9) {
        this.isUploaded = false;
      }
    }
  }
  previous() {
    this.nav.setRoot(CommentsinfoPage, {
      record: this.udetails
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

  redirectToRole() {
    this.nav.setRoot(RolePage);
  }
}
