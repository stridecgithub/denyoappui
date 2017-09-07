import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { UnitdetailsPage } from '../unitdetails/unitdetails';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';


/**
 * Generated class for the ViewunitsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-viewunits',
  templateUrl: 'viewunits.html',
})
export class ViewunitsPage {

 public pageTitle: string;
  public loginas: any;
  
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  public totalCount;
  pet: string = "ALL";
  public userId: any;
  public sortby = 2;
  public ulist:any;
  public detailvalue:any;
  public vendorsort = "asc";
  public ascending = true;
  public colorListArr: any;
  public companyId: any;
  public str: any;
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
    public toastCtrl: ToastController, public alertCtrl: AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.pageTitle = 'Units';
    this.str = '';
    this.loginas = localStorage.getItem("userInfoName");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.userId = localStorage.getItem("userInfoId");
    this.ulist = localStorage.getItem("viewlist");
  }
 ionViewWillEnter() {
   this.doUnit();
     if (this.navParams.get("record")) {
      console.log("Service Info Record Param Value:" + JSON.stringify(this.navParams.get("record")));
    }
 }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewunitsPage');
  }
exit()
{
    this.nav.setRoot(UnitdetailsPage, {
      record: this.navParams.get("record")
    });
}
 doUnit() {
    this.colorListArr = [
      "FBE983",
      "5584EE",
      "A4BDFD",
      "47D6DC",
      "7AE7BE",
      "51B749",
      "FBD75C",
      "FFB878",
      "FF877C",
      "DC2128",
      "DAADFE",
      "E1E1E1"
    ];
    this.presentLoading(1);
    if (this.reportData.status == '') {
      this.reportData.status = "DRAFT";
    }
    if (this.reportData.sort == '') {
      this.reportData.sort = "vendor";
    }
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
    //  http://denyoappv2.stridecdev.com/unitlistaction?action=view&unitid=1,2&is_mobile=1&loginid=4
      url: any = this.apiServiceURL + "/unitlistaction?action=view&unitid="+this.ulist+"&is_mobile=1&loginid="+this.userId;
    let res;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        res = data.json();
        console.log(JSON.stringify(res));
        console.log("1" + res.unitdetails.length);
        console.log("2" + res.unitdetails);
        if (res.unitdetails.length > 0) {
          for (let unit in res.unitdetails) {
            let colorcode;
            let favorite;
            let index = this.colorListArr.indexOf(res.unitdetails[unit].colorcode); // 1
            console.log("Color Index:" + index);
            let colorvalincrmentone = index + 1;
            colorcode = "button" + colorvalincrmentone;
            console.log("Color is" + colorcode);
            if (res.unitdetails[unit].favorite == 1) {
              favorite = "favorite";
            }
            else {
              favorite = "unfavorite";

            }
            this.reportAllLists.push({
              unit_id: res.unitdetails[unit].unit_id,
              unitname: res.unitdetails[unit].unitname,
              location: res.unitdetails[unit].location,
              projectname: res.unitdetails[unit].projectname,
              colorcode: res.unitdetails[unit].colorcode,
              contacts: res.unitdetails[unit].contacts,
              nextservicedate: res.unitdetails[unit].nextservicedate,
              colorcodeindications: colorcode,
              controllerid: res.unitdetails[unit].controllerid,
              neaplateno: res.unitdetails[unit].neaplateno,
              companys_id: res.unitdetails[unit].companys_id,
              unitgroups_id: res.unitdetails[unit].unitgroups_id,
              models_id: res.unitdetails[unit].models_id,
              alarmnotificationto: res.unitdetails[unit].alarmnotificationto,
              lat: res.unitdetails[unit].lat,
              lng: res.unitdetails[unit].lng,
              genstatus: res.unitdetails[unit].genstatus,
              favoriteindication: favorite
            });
          }
          //this.reportAllLists = res.units;
          this.totalCount = res.totalCount;
          this.reportData.startindex += this.reportData.results;
        } else {
          this.totalCount = 0;
        }
        console.log("Total Record:" + this.totalCount);

      });
    this.presentLoading(0);
  }
    doRefresh(refresher) {
    console.log('doRefresh function calling...');
    this.reportData.startindex = 0;
    this.reportAllLists = [];
    this.doUnit();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
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
}
