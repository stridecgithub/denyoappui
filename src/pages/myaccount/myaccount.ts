import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { EditprofilesteponePage } from '../editprofilestepone/editprofilestepone';
import { HomePage } from '../home/home';
import { UserPage } from '../user/user';
import { UnitsPage } from '../units/units';
import { RolePage } from '../role/role';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage } from '../orgchart/orgchart';
import { CompanygroupPage } from '../companygroup/companygroup';
import { ReporttemplatePage } from '../reporttemplate/reporttemplate';


/**
 * Generated class for the MyaccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {
  public pageTitle: string;
  public photo: any;
  public name: any;
  public msgcount: any;
  public notcount: any;
  public userid: any;
  public password: any;
  public hashtag: any;
  public loginas: any;
  public role: any;
  public email: any;
  public country: any;
  public job_position: any;
  public accountcreatedby: any;
  public userId: any;
  public item: any;
  public VIEWACCESS: any;
  public CREATEACCESS: any;
  public companyId: any;
  public EDITACCESS: any;
  public DELETEACCESS: any;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  constructor(public http: Http, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
    this.pageTitle = 'My Account';
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.VIEWACCESS = localStorage.getItem("SETTINGS_MYACCOUNT_VIEW");
    console.log("Role Authority for Unit Listing View:" + this.VIEWACCESS);
    this.CREATEACCESS = localStorage.getItem("SETTINGS_MYACCOUNT_CREATE");
    console.log("Role Authority for Unit Listing Create:" + this.CREATEACCESS);
    this.EDITACCESS = localStorage.getItem("SETTINGS_MYACCOUNT_EDIT");
    console.log("Role Authority for Unit Listing Edit:" + this.EDITACCESS)
    this.DELETEACCESS = localStorage.getItem("SETTINGS_MYACCOUNT_DELETE");
    console.log("Role Authority for Unit Listing Delete:" + this.DELETEACCESS);
    this.companyId = localStorage.getItem("userInfoCompanyId");
  }

  //[{"userid":"1","userdetailsid":"1","username":"webkannan","password":"webkannan","role":"1","hashtag":"@welcome","first_name":"Kannan","last_name":"Nagarathinam","email":"kannan@gmail.com","contact":"123456789","country":"2","photo":"1496647262537.jpg","job_position":"At prog","report_to":"0","company_group":"1","companygroup_name":"Denyo"}]
  ionViewWillEnter() {
    localStorage.setItem("userPhotoFile", '');
    // body: string = "key=myaccount&userId=" + this.userId,
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/settings/profile?is_mobile=1&loggedin_id=" + this.userId;
    console.log(url);
    let res;
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.settings.length);
        console.log("2" + res.settings);
        if (res.settings.length > 0) {
          this.userid = res.settings[0].username;
          this.password = res.settings[0].password;
          this.hashtag = "@" + this.userid;
          this.role = res.settings[0].role_name;
          this.email = res.settings[0].email;
          this.country = res.settings[0].country_name;
          this.job_position = res.settings[0].job_position;
          this.accountcreatedby = res.settings[0].report_to;
          console.log("A" + res.settings[0].photo_filename);
          if (res.settings[0].photo_filename != 'undefined' && res.settings[0].photo_filename != undefined) {
            console.log("B");
            this.photo = this.apiServiceURL + "/staffphotos/" + res.settings[0].photo_filename;
          } else {
            console.log('No photo available');
            this.photo = 'img/undefined.png';
          }
        }
        // [{ "userid": "1", "userdetailsid": "1", "username": "denyov2", "password": "e3b81d385ca4c26109dfbda28c563e2b", "firstname": "Super Admin", "lastname": "Denyo", "email": "balamurugan@webneo.in", "contact_number": "9597645985", "country_id": "99", "photo": "1496647262537.jpg", "job_position": "Country Manager", "report_to": "0", "company_id": "1", "companygroup_name": "Denyo" }]



      });
    let //body: string = "loginid=" + this.userId,
      type1: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers1: any = new Headers({ 'Content-Type': type1 }),
      options1: any = new RequestOptions({ headers: headers1 }),
      url1: any = this.apiServiceURL + "/msgnotifycount?loginid=" + this.userId;
    console.log(url1);
    // console.log(body);

    this.http.get(url1, options1)
      .subscribe((data) => {
        console.log("Count Response Success:" + JSON.stringify(data.json()));
        this.msgcount = data.json().msgcount;
        this.notcount = data.json().notifycount;
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad My Account Page');
  }
  doEdit(userid) {
    this.nav.setRoot(EditprofilesteponePage, {
      userId: userid
    });
  }


  viewOrgChart() {
    this.nav.setRoot(OrgchartPage, {
      companyId: this.companyId
    });
  }
  previous() {
    this.nav.setRoot(HomePage);
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

  user() {
    this.nav.setRoot(UserPage);
  }
  cgroup() {
    this.nav.setRoot(CompanygroupPage);
  }
  urole() {
    this.nav.setRoot(RolePage);
  }
  orgchart() {
    this.nav.setRoot(OrgchartPage);
  }
  report() {
    this.nav.setRoot(ReporttemplatePage);
  }
}
