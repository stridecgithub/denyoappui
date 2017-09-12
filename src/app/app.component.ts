import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, ToastController, AlertController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
//import { DashboardPage } from '../pages/dashboard/dashboard';

import { UnitdetailsPage } from '../pages/unitdetails/unitdetails';
import { Unitgrouplist } from '../pages/unitgrouplist/unitgrouplist';
import { CompanygroupPage } from '../pages/companygroup/companygroup';
import { CompanydetailPage } from '../pages/companydetail/companydetail';
import { UserPage } from '../pages/user/user';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { UnitgroupPage } from '../pages/unitgroup/unitgroup';
import { RolePage } from '../pages/role/role';
import { ReporttemplatePage } from '../pages/reporttemplate/reporttemplate';
import { CalendardetailPage } from '../pages/calendardetail/calendardetail';
import { UnitsPage } from '../pages/units/units';
import { OrgchartPage } from '../pages/orgchart/orgchart';
//import { AlarmPage } from '../pages/alarm/alarm';
import { AlarmlogPage } from '../pages/alarmlog/alarmlog';
import { AddalarmPage } from '../pages/addalarm/addalarm';
//import { MessagesPage } from '../pages/messages/messages';
import { CalendarPage } from '../pages/calendar/calendar';
import { MapsPage } from '../pages/maps/maps';
import { ReportsPage } from '../pages/reports/reports';
import { AddenginedetailPage } from '../pages/addenginedetail/addenginedetail';
import { ServicedetailsPage } from '../pages/servicedetails/servicedetails';
import { AlarmdetailsPage } from '../pages/alarmdetails/alarmdetails';
import { CommentdetailsPage } from '../pages/commentdetails/commentdetails';
import { EnginedetailPage } from '../pages/enginedetail/enginedetail';
import { EmailPage } from '../pages/email/email';
import { EngineviewPage } from '../pages/engineview/engineview';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html',
  providers: [Push, Network, LocalNotifications]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('content') navCtrl: NavController;
  rootPage: any = HomePage;
  pages: any;
  alert: any;
  showLevel1 = null;
  showLevel2 = null;
  ///private push: Push,
  constructor(private localNotifications: LocalNotifications, public alertCtrl: AlertController, private network: Network, private push: Push, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public dataService: DataServiceProvider, public menuCtrl: MenuController,
    public toastCtrl: ToastController) {

    this.initializeApp();
    this.dataService.getMenus()
      .subscribe((response) => {

        this.pages = response;
      });
    this.pages = [

      { title: 'Dashboard', component: HomePage },
      { title: 'Company Group', component: CompanygroupPage },
      { title: 'Users', component: UserPage },
      { title: 'Unit Group', component: UnitgroupPage },
      { title: 'Units', component: UnitsPage },
      { title: 'Role', component: RolePage },
      { title: 'My Account', component: MyaccountPage },
      { title: 'Report Template', component: ReporttemplatePage },
      { title: 'Org Chart', component: OrgchartPage },

      { title: 'Maps', component: MapsPage },
      { title: 'Calendar', component: CalendarPage },
      { title: 'Reports', component: ReportsPage },
      // { title: 'Alarm List', component: AlarmPage },
      { title: 'Alarm', component: AddalarmPage },
      { title: 'Alarm Log', component: AlarmlogPage },
      { title: 'Service Details', component: ServicedetailsPage },
      { title: 'Comment Details', component: CommentdetailsPage },
      { title: 'Alarm Details', component: AlarmdetailsPage },
      { title: 'Engine Details', Component: EnginedetailPage },
      { title: 'Add Engine Details', Component: AddenginedetailPage },
      { title: 'Engine Details', Component: EngineviewPage },
      { title: 'ForgotPassword', Component: ForgotpasswordPage },
      { title: 'Company Group Detail', Component: CompanydetailPage },
      { title: 'Unit Group List', Component: Unitgrouplist },

      // { title: 'Map Demo', component: MapdemoPage },


    ];


  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlertExist();
          }
        }
      });
      this.initPushNotification();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
      /// Set timer for click to edit unit details page
      /*
       var timer = 0;
     setInterval(() => {      
         timer++;       
         console.log("Timer value of " + timer);
         let isclickedtounitdetails = 1;
         let clicked = localStorage.getItem("unitdetailsclicked");
          console.log("Unit  " + JSON.stringify(clicked));
         if (clicked == undefined) {
           isclickedtounitdetails = 0;
         }
         if (clicked == 'undefined') {
           isclickedtounitdetails = 0;
         }
         if (clicked == '') {
           isclickedtounitdetails = 0;
         }
         if (isclickedtounitdetails > 0) {
           timer = 1;
           console.log(JSON.stringify(clicked))
 
           //this.nav.setRoot(HomePage);
           this.callUnitDetails(clicked);
           //this.openPage(UnitsPage);
         }
 
 
       }, 1000);
       setTimeout(function () {
 
       }, 3000);
 */
      /// Set timer for click to edit unit details page
    });


    // watch network for a disconnect
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.sendNotification('network was disconnected :-(');
    });

    // stop disconnect watch
    disconnectSubscription.unsubscribe();


    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.sendNotification('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
          this.sendNotification('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });

    // stop connect watch
    connectSubscription.unsubscribe();
  }

  callUnitDetails(clicked) {
    this.nav.setRoot(UnitdetailsPage, {
      record: clicked
    });
  }

  // Manage notifying the user of the outcome
  // of remote operations
  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 1000
    });
    notification.present();
  }
  openPage(page) {
    if (page.component == 'UnitsPage') {
      this.nav.setRoot(UnitsPage);
    } else if (page.component == 'UnitgroupPage') {
      this.nav.setRoot(UnitgroupPage);
    } else if (page.component == 'MyaccountPage') {
      this.nav.setRoot(MyaccountPage);
    } else if (page.component == 'UserPage') {
      this.nav.setRoot(UserPage);
    } else if (page.component == 'CompanygroupPage') {
      this.nav.setRoot(CompanygroupPage);
    } else if (page.component == 'RolePage') {
      this.nav.setRoot(RolePage);
    } else if (page.component == 'ReporttemplatePage') {
      this.nav.setRoot(ReporttemplatePage);
    } else if (page.component == 'OrgchartPage') {
      this.nav.setRoot(OrgchartPage);
    } else if (page.title == 'Message') {
      this.menuCtrl.close();
      this.nav.setRoot(EmailPage);
    } else if (page.title == 'Logout') {
      this.logout();
      this.menuCtrl.close();
      //this.nav.setRoot(LogoutPage);
    } else if (page.title == 'Dashboard') {
      this.menuCtrl.close();
      this.nav.setRoot(HomePage);
    } else if (page.title == 'Calendar') {
      this.menuCtrl.close();
      this.nav.setRoot(CalendarPage);
    } else if (page.title == 'Maps') {
      this.menuCtrl.close();
      this.nav.setRoot(MapsPage);
    } else if (page.title == 'Reports') {
      this.menuCtrl.close();
      this.nav.setRoot(ReportsPage);
    }
    else if (page.title == 'Alarm') {
      this.menuCtrl.close();
      //this.nav.setRoot(AlarmPage);
    }
    else if (page.component == 'AddalarmPage') {
      this.nav.setRoot(AddalarmPage);
    }
    else if (page.component == 'MapdemoPage') {
      //this.nav.setRoot(MapdemoPage);
    }
    else if (page.component == 'EnginedetailPage') {
      this.nav.setRoot(EnginedetailPage);
    }
  }

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };
  logout() {
    localStorage.setItem("userInfo", "");
    localStorage.setItem("userInfoId", "");
    localStorage.setItem("userInfoName", "");
    localStorage.setItem("userInfoEmail", "");
    localStorage.setItem("userInfoCompanyId", "");
    localStorage.setItem("atMentionedStorage", "");
    localStorage.setItem("userPhotoFile", "");

    localStorage.setItem("DASHBOARD_MAP_VIEW", '');
    localStorage.setItem("DASHBOARD_MAP_CREATE", '');
    localStorage.setItem("DASHBOARD_MAP_EDIT", '');
    localStorage.setItem("DASHBOARD_MAP_DELETE", '');
    localStorage.setItem("DASHBOARD_MAP_HIDE", '');


    localStorage.setItem("DASHBOARD_UNITS_VIEW", '');
    localStorage.setItem("DASHBOARD_UNITS_CREATE", '');
    localStorage.setItem("DASHBOARD_UNITS_EDIT", '');
    localStorage.setItem("DASHBOARD_UNITS_DELETE", '');
    localStorage.setItem("DASHBOARD_UNITS_HIDE", '');


    this.nav.setRoot(HomePage);
  }
  initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    // to initialize push notifications

    const options: PushOptions = {
      android: {
        senderID: '218019355699',
        forceShow: false,
        vibrate: true,
        sound: 'true'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };


    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a new notification', notification);
      //this.sendNotification('Received a new notification' + JSON.stringify(notification));
      //this.showAlert(notification.title, notification.message);
      this.schedule(notification);
    }
    );

    pushObject.on('registration').subscribe((registration: any) => {

      console.log('Device registered', registration);
      console.log('Device Json registered', JSON.stringify(registration));
      localStorage.setItem("deviceTokenForPushNotification", registration.registrationId);
    }
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));




  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }


  showAlertExist() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }
  public schedule(notification) {
    this.localNotifications.schedule({
      title: notification.title,
      text: notification.message,
      at: new Date(new Date()),
      sound: null
    });

    localStorage.setItem("navtype", notification.additionalData.arrayval.type);
    localStorage.setItem("navtid", notification.additionalData.arrayval.id);

    this.localNotifications.on("click", (notification, state) => {
      console.log("Local notification clicked...");
      console.log("1" + notification);
      console.log("2" + state);
      console.log("3" + JSON.stringify(notification));
      console.log("4" + JSON.stringify(state));
      /*console.log("5" + notification.additionalData);
      console.log("6" + notification.additionalData.arrayval.id);
      console.log("7" + notification.additionalData.arrayval.type);
      */
      let navids = localStorage.getItem("navtid");
      let navtypes = localStorage.getItem("navtype");
      console.log(navids);
      console.log(navtypes);

      if (navtypes == 'M') {
        // this.nav.setRoot(EmailPage);

        this.nav.setRoot(EmailPage, {
          record: navids,
          act: 'Push'
        });

      } else if (navtypes == 'OA') {
        this.nav.setRoot(AlarmdetailsPage, {
          record: navids,
          act: 'Push'
        });
      } else if (navtypes == 'A') {
        //this.nav.setRoot(AlarmdetailsPage);

        this.nav.setRoot(AlarmdetailsPage, {
          record: navids,
          act: 'Push'
        });

      } else if (navtypes == 'C') {
        //this.nav.setRoot(CommentdetailsPage);
        this.nav.setRoot(CommentdetailsPage, {
          record: navids,
          act: 'Push'
        });
      } else if (navtypes == 'E') {
        this.nav.setRoot(CalendardetailPage, {
          event_id: navids,
          act: 'Push'
        });
      } else if (navtypes == 'S') {
        // this.nav.setRoot(ServicedetailsPage);
        this.nav.setRoot(ServicedetailsPage, {
          record: navids,
          act: 'Push'
        });
      }
    });

  }



}

