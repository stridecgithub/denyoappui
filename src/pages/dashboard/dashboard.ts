import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { CalendardetailPage } from '../calendardetail/calendardetail';
import { EmailPage } from '../email/email';
import { OrgchartPage } from '../orgchart/orgchart';
import { Http, Headers, RequestOptions } from '@angular/http';
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  public loginas: any;
  public userId: any;
  public msgcount: any;
  public notcount: any;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  constructor(public http: Http, public navCtrl: NavController, public nav: NavController) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
  }

  goPage(page) {
    console.log(page);
    if (page == 'MapsPage') {
    this.nav.setRoot(MapsPage);    
    } else if (page == 'ReportsPage') {
      this.nav.setRoot(ReportsPage);
    } else if (page == 'CalendarPage') {
      this.nav.setRoot(CalendarPage);
    } else if (page == 'UnitsPage') {
      this.nav.setRoot(UnitsPage);
    }

  }


  pushMessagePage() {
    this.nav.setRoot(CalendardetailPage, {
      event_id: 4,
      act: 'Push'
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
    //this.nav.setRoot(DashboardmapPage);
  }
  redirectToSettings() {
    this.nav.setRoot(OrgchartPage);
  }

  ionViewWillEnter() {
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
  }

}
