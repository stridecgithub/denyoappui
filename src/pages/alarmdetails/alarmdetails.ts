import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { AddalarmPage } from '../addalarm/addalarm';
import { TrendlinePage } from '../trendline/trendline';
import { AlarmlogPage } from '../alarmlog/alarmlog';
import { OrgchartPage} from '../orgchart/orgchart';
import { Http, Headers, RequestOptions } from '@angular/http';
/**
 * Generated class for the AlarmdetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-alarmdetails',
  templateUrl: 'alarmdetails.html',
})
export class AlarmdetailsPage {
  public loginas: any;
  public pageTitle: string;
  public msgcount: any;
  public notcount: any;
  public totalCount;
  public alarm_unitid: any;
  pet: string = "ALL";
  public sortby = 2;
   public unitDetailData: any = {
    hashtag:''
  }
  public userId: any;
  public alarmid: any;
  public alarm_assginedby_name: any;
  public alarm_assginedto_name: any;
  public alarm_name: any;
  public estatus;
  public vendorsort = "asc";
  public ascending = true;
  public colorListArr: any;
  public companyId: any;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  public reportData: any =
  {
    status: '',
    sort: 'unit_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
  public reportAllLists = [];
  constructor(public http: Http, public nav: NavController,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public NP: NavParams) {
    this.pageTitle = 'Units';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
  }
  trendlineInfo(alarmid) {
    this.nav.setRoot(TrendlinePage, {
      alarmid: alarmid
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AlarmdetailsPage');
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
     this.unitDetailData.favoriteindication = localStorage.getItem("unitfav");
    if (this.NP.get("record")) {
      if (this.NP.get("act") != 'Push') {
        console.log("Alarm Details" + JSON.stringify(this.NP.get("record")));
        console.log(this.NP.get("record").alarm_name);
        this.alarmid = this.NP.get("record").alarm_id;
        this.alarm_name = this.NP.get("record").alarm_name;
        this.alarm_unitid = this.NP.get("record").alarm_name;
        this.alarm_assginedby_name = this.NP.get("record").alarm_assginedby_name;
        this.alarm_assginedto_name = this.NP.get("record").alarm_assginedto_name;
        if (this.alarm_assginedby_name == "") {
          this.estatus = 1;
        }
      } else {
        console.log('Push');
        let body: string = "alarmid=" + this.NP.get("record"),
          type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
          headers1: any = new Headers({ 'Content-Type': type1 }),
          options1: any = new RequestOptions({ headers: headers1 }),
          url1: any = this.apiServiceURL + "/getalarmdetails";
        console.log(url1);
        this.http.post(url1, body, options1)
          //this.http.get(url1, options1)
          .subscribe((data) => {
            console.log("servicebyid Response Success:" + JSON.stringify(data.json()));
            console.log("Alarm Details:" + data.json().alarms[0]);
            this.selectEntry(data.json().alarms[0]);
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

  }
  selectEntry(item) {
    console.log("selectEntry Array" + JSON.stringify(item.alarm_unit_id));
    console.log("item.alarm_unit_id" + item.alarm_unit_id);
    localStorage.setItem("unitId", item.alarm_unit_id);
    localStorage.setItem("iframeunitId", item.alarm_unit_id);
    this.alarm_name = item.alarm_name;
    this.alarm_assginedby_name = item.alarm_assginedby_name;
    this.alarm_assginedto_name = item.alarm_assginedto_name;

  }
  editalarm() {
    this.nav.setRoot(AddalarmPage,
      {
        record: this.NP.get("record")
      });
  }
  previous() {
    this.nav.setRoot(AlarmlogPage);
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
