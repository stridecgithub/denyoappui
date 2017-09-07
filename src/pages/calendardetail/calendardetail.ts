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
  selector: 'page-calendardetail',
  templateUrl: 'calendardetail.html',
})
export class CalendardetailPage {
  public loginas: any;
  public pageTitle: string;
  public msgcount: any;
  public notcount: any;
  public totalCount;
  public event_location: any;
  pet: string = "ALL";
  public sortby = 2;
  public userId: any;
  public event_id: any;
  public event_addedby_name: any;
  public event_remark: any;
  public event_title: any;
  public event_date: any;
  public event_time: any;
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
  trendlineInfo(event_id) {
    this.nav.setRoot(TrendlinePage, {
      event_id: event_id
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendardetailPage');
  }
  ionViewWillEnter() {
    if (this.NP.get("event_id")) {
      console.log('Push');
      let body: string = "eventid=" + this.NP.get("event_id"),
        type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
        headers1: any = new Headers({ 'Content-Type': type1 }),
        options1: any = new RequestOptions({ headers: headers1 }),
        url1: any = this.apiServiceURL + "/eventdetailbyid";
      console.log(url1);
      this.http.post(url1, body, options1)
        //this.http.get(url1, options1)
        .subscribe((data) => {
          console.log("eventdetailbyid Response Success:" + JSON.stringify(data.json()));
          console.log("Event Details:" + data.json().eventslist[0]);
          this.selectEntry(data.json().eventslist[0]);
        });
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
    localStorage.setItem("iframeunitId", this.event_location);
  }
  selectEntry(item) {
    localStorage.setItem("unitId", item.alarm_unit_id);
    this.event_title = item.event_title;
    this.event_addedby_name = item.event_addedby_name;
    this.event_remark = item.event_remark;
    this.event_date = item.event_date;
    this.event_time = item.event_time;
  }
  editalarm() {
    this.nav.setRoot(AddalarmPage,
      {
        event_id: this.NP.get("event_id")
      });
  }
  previous() {
    this.nav.setRoot(CalendarPage);
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

