import { Component } from '@angular/core';
import {  NavController, ToastController, AlertController, NavParams } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AddorgchartonePage } from '../addorgchartone/addorgchartone';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import { DomSanitizer } from '@angular/platform-browser';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { CalendarPage } from '../calendar/calendar';
import { EmailPage } from '../email/email';
import { OrgchartPage} from '../orgchart/orgchart';

/**
 * Generated class for the EnginedetailviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-enginedetailview',
  templateUrl: 'enginedetailview.html',
})
export class EnginedetailviewPage {
 public pageTitle: string;
  public loginas: any;
  public unitid:any;
  public htmlContent;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  public totalCount;
  pet: string = "ALL";
  public reportData: any =
  {
    status: '',
    sort: 'unitgroup_id',
    sortascdesc: 'asc',
    startindex: 0,
    results: 8
  }
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
  public reportAllLists = [];
  public colorListArr: any;
  public userId: any;
  public companyId: any;
  iframeContent: any;
  public msgcount:any;
  public notcount:any;
  constructor( public http: Http, public nav: NavController, private sanitizer: DomSanitizer,
    public toastCtrl: ToastController, public alertCtrl: AlertController, public NP: NavParams, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.unitid =localStorage.getItem("unitId");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnginedetailviewPage');
  }
 doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }


  ionViewWillEnter() {
     if (this.NP.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.NP.get("record")));
      let editItem = this.NP.get("record");
    //this.unitDetailData.unit_id = editItem.unit_id;
    //this.unitDetailData.unitname = editItem.unitname;
    //this.unitDetailData.location = editItem.location;
    //this.unitDetailData.projectname = editItem.projectname;
    this.unitDetailData.runninghr = editItem.runninghr;
    this.unitDetailData.gen_status = editItem.gen_status;
    this.unitDetailData.nextservicedate = editItem.nextservicedate;
let favorite;
		if (this.NP.get("record").favoriteindication == 'favorite') {
			favorite = "favorite";
		}
		else {
			favorite = "unfavorite";

		}
this.unitDetailData.favoriteindication = favorite;

    this.unitDetailData.unit_id = localStorage.getItem("unitId");
    if (this.unitDetailData.unit_id == undefined) {
      this.unitDetailData.unit_id = editItem.unit_id;
    }
    if (this.unitDetailData.unit_id == 'undefined') {
      this.unitDetailData.unit_id = editItem.unit_id;
    }
    this.unitDetailData.unitname = localStorage.getItem("unitunitname");
    this.unitDetailData.location = localStorage.getItem("unitlocation");
    this.unitDetailData.projectname = localStorage.getItem("unitprojectname");
    this.unitDetailData.colorcodeindications = localStorage.getItem("unitcolorcode");
    console.log("Unit Details Color Code:" + this.unitDetailData.colorcodeindications);
    this.unitDetailData.lat = localStorage.getItem("unitlat");
    this.unitDetailData.lng = localStorage.getItem("unitlng");
     this.unitDetailData.rh=localStorage.getItem("runninghr");
     this.unitDetailData.ns=localStorage.getItem("nsd");

    }
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
       this.msgcount=data.json().msgcount;
        this.notcount=data.json().notifycount;
      });
   // this.iframeContent =  "<iframe id='filecontainer' src=" + "http://denyoappv2.stridecdev.com/orgchart?company_id="+this.companyId+"&is_mobile=1&id="+this.userId+" height=350 width=100% frameborder=0></iframe>";
    this.pageTitle = "Org Chart";
    this.reportData.startindex = 0;
    this.reportData.sort = "unitgroup_id";
    
    
    console.log(this.apiServiceURL + "/orgchart?company_id=" + this.companyId + "&is_mobile=1");
    this.iframeContent = "<iframe style='position: absolute;margin-left: -16px;' src=" + "http://denyoappv2.stridecdev.com/"+this.unitid+"/1/enginedetails height=350 frameborder=0></iframe>";
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
  previous()
  {
     this.nav.setRoot(UnitdetailsPage, {
      record: this.NP.get("record")
    });
  }
}
