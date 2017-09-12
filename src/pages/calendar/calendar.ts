import { Component, ViewChild } from '@angular/core';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { Alert, NavController, Events, Toast, Modal } from 'ionic-angular';
import * as moment from 'moment';
import { AlarmdetailsPage } from '../alarmdetails/alarmdetails';
import { CalendardetailPage } from '../calendardetail/calendardetail';
import { DatePicker } from '@ionic-native/date-picker';
import { OrgchartPage } from '../orgchart/orgchart';
import { MyaccountPage } from '../myaccount/myaccount';
import { UnitsPage } from '../units/units';
import { NotificationPage } from '../notification/notification';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';
import { EmailPage } from '../email/email';
import { Http, Headers, RequestOptions } from "@angular/http";

import { UnitgroupPage } from '../unitgroup/unitgroup';
import { RolePage } from '../role/role';
import { HomePage } from '../home/home';
import { UserPage } from '../user/user';

import { AddcalendarPage } from '../addcalendar/addcalendar';


@Component({
  //templateUrl: 'build/pages/calendar/calendar.html',
  // directives: [CalendarComponent]
  //Static Events:-[{"data":{},"icon":"alarm","class":"class","iconStyle":{"color":"green"},"style":{"color":"red"},"name":"Item 1","type":"event","startDate":"2017-08-22T22:41:26.675Z","endDate":"2017-08-22T23:41:26.675Z","allDay":false},{"data":{},"class":"class","icon":"jet","name":"Item 2","type":"event","startDate":"2017-08-23T01:41:26.675Z","endDate":"2017-08-26T02:41:26.675Z","allDay":false},{"data":{},"class":"class","icon":"globe","name":"Item 3","type":"event","startDate":"2017-08-23T22:41:26.675Z","endDate":"2017-08-25T01:41:26.675Z","allDay":false}]
  selector: 'page-calendar',
  templateUrl: 'calendar.html',

})
export class CalendarPage {
  @ViewChild(CalendarComponent)
  private calendarComponent: CalendarComponent;
  public pageTitle: string;
  public loginas: any;
  public notcount: any;
  public msgcount: any;
  public eventIdentify = [];
  public serviceIdentify = [];
  public alarmIdentity = [];
  petselection: any;
  daySession: any;
  dateHeaderTitle: any;
  totalCount: any;
  totalCountEvent: any;
  totalCountEventDateWise: any;
  pet: string = "ALL";
  public userId: any;
  public companyId: any;
  calendarResultAll: any;
  calendarResultService: any;
  calendarResultEvent: any;
  calendarResultAlarm: any;
  curDate: any;
  private apiServiceURL: string = "http://denyoappv2.stridecdev.com";
  allselected: any;
  serviceselected: any;
  alarmselected: any;
  eventsselected: any;
  noeventtitle: any;
  now: number = Date.now();
  public currentCalendarDate: any;

  millisInHour: number = 1000 * 60 * 60;
  millisInDay: number = this.millisInHour * 24;

  calEvents = [];


  constructor(private nav: NavController, public events: Events, private http: Http, public navCtrl: NavController) {
    console.log("Static Events:-" + JSON.stringify(this.calEvents));
    this.loginas = localStorage.getItem("userInfoName");
    this.userId = localStorage.getItem("userInfoId");
    this.userId = localStorage.getItem("userInfoId");
    this.companyId = localStorage.getItem("userInfoCompanyId");
    this.pageTitle = "Calendar";
    events.subscribe('calendar-event:item-press', (event: any) => {
      console.log('calendar-event:item-press', event);
      this.onEventPressed(event[0]);
    });
    events.subscribe('calendar-event:month-grid-cell-press', (event: any) => {
      console.log('calendar-event:month-grid-cell-press - calendar', event);
      this.onMonthGridPressed(event[0]);
    });





    // this.calEvents = [];

    //console.log($event.date.toDate())


  }
  eventSource;

  ionViewWillEnter() {/*

    this.eventsselected = true;
    this.allselected = false;
    this.serviceselected = false;
    this.alarmselected = false;
    this.eventsselected = false;

    this.pageTitle = "Calendar";
    this.curDate = new Date();
    console.log('Current Date is now when will enter:' + this.curDate);
    let yearMonth = this.splitDate(this.curDate)
    //this.dateHeaderTitle = yearMonth;
    this.onTimeSelected(this.curDate);

   // this.createRandomEvents();

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

    // Default Enter
   
    // Default Enter*/
  }

  /**********************************/
  /* Dropdown Filter onchange event */
  /**********************************/
  onSegmentChanged(val) {
    this.noeventtitle = '';
    this.calendarResultEvent = [];
    this.calendarResultAll = [];
    this.calendarResultService = [];
    this.calendarResultAlarm = [];
    if (val == "ALL") {
      // this.reportData.status = "DRAFT";
      // this.reportData.startindex = 0;
      this.calendarResultAll = [];
      this.petselection = 'ALL';
      this.allselected = true;
      this.pet = 'ALL';

    } else if (val == "SERVICE") {
      this.serviceselected = true;

      //this.reportData.status = val;
      //this.reportData.startindex = 0;
      this.calendarResultService = [];
      this.petselection = 'SERVICE';
      this.pet = 'SERVICE';
    } else if (val == "EVENT") {

      this.eventsselected = true;
      //this.reportData.status = val;
      //this.reportData.startindex = 0;
      this.calendarResultEvent = [];
      this.petselection = 'EVENT';
      this.pet = 'EVENT';
    } else if (val == "ALARM") {
      this.alarmselected = true;
      //this.reportData.status = val;
      //this.reportData.startindex = 0;
      this.calendarResultAlarm = [];
      this.petselection = 'ALARM';
      this.pet = 'ALARM';
    }

    //this.doReport();

    this.onTimeSelected('');
  }
  onTimeSelected(ev) {
    this.currentCalendarDate = ev;
    this.calendarResultAll = [];
    this.calendarResultService = [];
    this.calendarResultEvent = [];
    this.calendarResultAlarm = [];

    // this.createRandomEvents();
    let dateStr;
    let month;
    let year;
    let date;

    if (ev != '') {
      //this.pet = '';
      this.petselection = '';
      this.calendarResultAll = [];
      this.calendarResultService = [];
      this.calendarResultEvent = [];
      this.calendarResultAlarm = [];


      if (ev.selectedTime == undefined) {

        month = ev.getUTCMonth() + 1;
        year = ev.getFullYear();
        date = ev.getDate();
      } else {

        month = ev.selectedTime.getUTCMonth() + 1;
        year = ev.selectedTime.getFullYear();
        date = ev.selectedTime.getDate();
      }
      console.log("Month Vlue" + month);
      console.log("Month Length" + month.length);
      if (this.getlength(month) == 1) {
        month = '0' + month;
      } else {
        month = month;
      }

      console.log("Date Length" + date.length);
      if (this.getlength(date) == 1) {
        date = '0' + date
      } else {
        date = date;
      }

      dateStr = "&date=" + year + "-" + month + "-" + date;
    } else {
      dateStr = "";
    }
    console.log("Date Selection:" + dateStr);
    let type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/calendar?is_mobile=1&loginid=" + this.userId + "&companyid=" + this.companyId + "" + dateStr;
    console.log(url);
    this.http.get(url, options)
      .subscribe((data) => {
        let currentDateArr = new Date();
        let cmonth = currentDateArr.getMonth() + 1;
        let mnstr;
        let dtstr;
        console.log("cmonth.toLocaleString.length" + cmonth.toLocaleString.length);
        console.log("cmonth" + cmonth)
        if (cmonth > 9) {
          cmonth = cmonth;
          mnstr = '';
          console.log("Less than 9 below 10")

        } else {
          console.log("Greater than 9 reach 10")
          cmonth = cmonth;
          mnstr = '0';

        }

        if (currentDateArr.getDate().toLocaleString.length == 1) {
          dtstr = '0';
        } else {
          dtstr = '';

        }
        let curDate = currentDateArr.getFullYear() + "-" + mnstr + cmonth + "-" + dtstr + currentDateArr.getDate();

        let months = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December' };

        let selDate = year + "-" + month + "-" + date;
        let selectdate = year + "-" + month + "-" + date;
        if (year != undefined)
          this.dateHeaderTitle = months[month] + " " + year;
        if (ev != '') {
          console.log("curDate:" + curDate);
          console.log("selDate:" + selDate);
          localStorage.setItem("sdate", selectdate);
          if (curDate == selDate) {
            this.daySession = 'Todays  Event';
            console.log(this.daySession);
          } else {
            this.daySession = selDate;
          }
        } else {
          this.daySession = "";
        }
        console.log("Pet:======>" + this.petselection);
        this.calendarResultEvent = [];
        if (this.petselection == 'ALL') {
          console.log('ALL');
          this.doCalendarResult(data, 0, 0, 0, 'all')
        } else if (this.petselection == 'SERVICE') {
          console.log('SERVICE');
          this.doCalendarResult(data, 0, 0, 0, 'service');//JsonData,Event,Service,Alarm
        } else if (this.petselection == 'EVENT') {
          console.log('EVENT');
          this.doCalendarResult(data, 0, 0, 0, 'event');//JsonData,Event,Service,Alarm
        } else if (this.petselection == 'ALARM') {
          console.log('ALARM');
          this.doCalendarResult(data, 0, 0, 0, 'alarm');//JsonData,Event,Service,Alarm
        } else {
          console.log('EV' + ev);
          if (ev != '') {
            this.doCalendarResult(data, 1, 1, 1, '')//JsonData,Event,Service,Alarm
          }

        }

      });


  }
  getlength(number) {
    return number.toString().length;
  }
  doCalendarResult(data, event, service, alarm, type) {//JsonData,Event,Service,Alarm
    this.serviceIdentify = [];
    this.eventIdentify = [];
    this.alarmIdentity = [];
    if (event > 0 && type == '') {
      console.log("A");
      this.eventIdentify = data.json().events;
    } else {
      console.log("B");
      if (type == 'event') {
        console.log("C");
        this.eventIdentify = data.json().allevents;
      }
      if (type == 'all') {
        console.log("D");
        this.eventIdentify = data.json().allevents;
      }
    }
    for (var i = 0; i < this.eventIdentify.length; i += 1) {
      $('.monthview-primary-with-event').removeClass('monthview-primary-with-event[_ngcontent-c1]');
      $('.monthview-primary-with-event').addClass('eventclass');
      //let eventdate = this.eventIdentify[i]['event_date'] + " " + this.eventIdentify[i]['event_time'];// Check Date and Time
      // let eventdate = this.eventIdentify[i]['event_date'];// Check Date only
      this.calendarResultEvent.push({
        event_id: this.eventIdentify[i]['event_id'],
        event_title: this.eventIdentify[i]['event_title'],
        event_date: this.eventIdentify[i]['event_date'],
        event_time: this.eventIdentify[i]['event_time'],
        event_location: this.eventIdentify[i]['event_location'],
        event_remark: this.eventIdentify[i]['event_remark'],
        event_addedby_name: this.eventIdentify[i]['event_addedby_name'],
        event_type: 'E',
        icon: 'alarm', // Icon of the alert. This is compulsory when using the 
        // calendar on small screens, as the name of the event will
        // not be displayed in the month grid. It has to be a valid
        // IonicIcons icon name.
        class: 'eventclass', // Class of the item in the month grid cell
        iconStyle: { color: 'green' } // Style for the item's icon
        //style: { color: 'red' }, // Style for the item
      });
    }

    if (service > 0 && type == '') {
      console.log("E");
      this.serviceIdentify = data.json().services;
    } else {
      console.log("F");
      if (type == 'service') {
        console.log("G");
        this.serviceIdentify = data.json().allservices;
      }
      if (type == 'all') {
        console.log("H");
        this.serviceIdentify = data.json().allservices;
      }
    }
    for (var j = 0; j < this.serviceIdentify.length; j += 1) {
      let eventdate;

      if (this.serviceIdentify[j]['serviced_datetime'] == '0000-00-00') {
        //eventdate = this.serviceIdentify[j]['next_service_date'] + " " + this.serviceIdentify[j]['serviced_time'];// Check Date and Time
        eventdate = this.serviceIdentify[j]['next_service_date'];// Check Date only
      } else {
        if (this.serviceIdentify[j]['serviced_time'] == null) {
          eventdate = this.serviceIdentify[j]['next_service_date'];
        } else {
          eventdate = this.serviceIdentify[j]['serviced_datetime'];
        }
      }

      this.calendarResultEvent.push({
        event_id: this.serviceIdentify[j]['service_id'],
        event_title: this.serviceIdentify[j]['service_subject'],
        event_unitid: this.serviceIdentify[j]['service_unitid'],
        event_date: this.serviceIdentify[j]['serviced_datetime'],
        event_time: this.serviceIdentify[j]['serviced_time'],
        event_remark: this.serviceIdentify[j]['service_remark'],
        event_location: this.serviceIdentify[j]['service_location'],
        event_addedby_name: this.serviceIdentify[j]['serviced_by_name'],
        event_type: 'S',
        icon: 'service',
        class: 'service'
      });

    }

    if (alarm > 0 && type == '') {
      console.log("I");
      this.alarmIdentity = data.json().alarms;
    } else {
      console.log("J");
      if (type == 'alarm') {
        console.log("K");
        this.alarmIdentity = data.json().allalarms;
      }
      if (type == 'all') {
        console.log("L");
        this.alarmIdentity = data.json().allalarms;
      }
    }

    for (var k = 0; k < this.alarmIdentity.length; k += 1) {

      this.calendarResultEvent.push({

        event_id: this.alarmIdentity[k]['alarm_id'],
        event_title: this.alarmIdentity[k]['alarm_name'],
        event_unitid: this.alarmIdentity[k]['alarm_unit_id'],
        event_date: this.alarmIdentity[k]['alarm_received_date'],

        event_remark: this.alarmIdentity[k]['alarm_remark'],
        event_location: this.alarmIdentity[k]['alarm_location'],
        event_addedby_name: this.alarmIdentity[k]['alarm_assginedby_name'],
        event_t: this.alarmIdentity[k]['date_time'],
        event_type: 'A',
        icon: 'event',
        class: 'event'
      });


    }
    this.totalCountEventDateWise = this.calendarResultEvent.length;
    console.log("Date wise selection calendar response:" + JSON.stringify(this.calendarResultEvent));
    console.log("totalCountEventDateWise++" + this.totalCountEventDateWise);
    if (this.totalCountEventDateWise == 0) {
      this.noeventtitle = 'There is no events';
    }
  }

  createRandomEvents() {

    let today = new Date();
    console.log("Today is " + today);
    console.log("Month wise Current Date:-" + this.currentCalendarDate);

    // let currentdateArr=this.currentCalendarDate.split(" ");

    //Sun Oct 01 2017
    let curdate = this.currentCalendarDate.getDate();
    let curmonth = this.currentCalendarDate.getMonth() + 1;

    let mnstr;
    if (curmonth > 9) {
      curmonth = curmonth;
      mnstr = '';
      console.log("Less than 9 below 10")

    } else {
      console.log("Greater than 9 reach 10")
      curmonth = curmonth;
      mnstr = '0';

    }


    let curyear = this.currentCalendarDate.getFullYear();
    let currentdate = curyear + "-" + mnstr + curmonth + "-" + curdate;
    var events = [];

    let
      type: string = "application/x-www-form-urlencoded; charset=UTF-8",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiServiceURL + "/calendar? is_mobile=1&loginid=" + this.userId + "&date=" + currentdate + "&companyid=" + this.companyId;
    console.log("All Events calling API URL" + url);

    // console.log(url);
    let colors: string[] = ['primary', 'warning', 'danger', 'success'];
    this.http.get(url, options)
      .subscribe((data) => {
        let res = data.json();
        this.eventIdentify = res.allevents;
        for (var i = 0; i < this.eventIdentify.length; i += 1) {
          var startTime;
          var endTime;
          var event_date_array = this.eventIdentify[i]['event_date'].split('-');
          console.log("DATE FORMAT" + this.eventIdentify[i]['event_date']);
          var yearstr = event_date_array[0];
          var monthstr = parseInt(event_date_array[1], 10) - 1;
          var datestr = parseInt(event_date_array[2], 10);
          console.log("Month String:-" + monthstr);
          console.log("Date String:-" + datestr);
          // var startMinute = Math.floor(Math.random() * 24 * 60);
          // var endMinute = Math.floor(Math.random() * 1) + startMinute;
          var startMinute = 20;
          var endMinute = 10 + startMinute;
          startTime = new Date(yearstr, monthstr, datestr, 10, 0 + startMinute);
          endTime = new Date(yearstr, monthstr, datestr, 10, 0 + endMinute);
          //console.log("TEST CALENDAR-1"+startTime+"//"+endTime);

          // startTime = new Date(event_date_array[0], event_date_array[1], event_date_array[2], 0, 0,0);
          // endTime = new Date(event_date_array[0], event_date_array[1], event_date_array[2], 0, 0,0);


          /*events.push({
            title: this.eventIdentify[i]['event_title'],
            startTime: startTime,
            endTime: endTime,
            allDay: true,
            icon: 'event',
            class: 'event'
          });*/
          events.push({
            "data": {},
            "icon": "clock",
            "class": "event",
            "iconStyle": { "color": "green" }
            , "style": { "color": "red" }
            , "name": this.eventIdentify[i]['event_title'],
            "type": "event",
            "startDate": startTime,
            "endDate": endTime,
            "allDay": false
          });
          // "data":{},"icon":"alarm","class":"class","iconStyle":{"color":"green"},"style":{"color":"red"},"name":"Item 1","type":"event","startDate":"2017-08-27T12:22:34.252Z","endDate":"2017-08-27T13:22:34.252Z","allDay":false


        }


        this.serviceIdentify = res.allservices;
        for (var j = 0; j < this.serviceIdentify.length; j += 1) {
          var startTime;
          var endTime;
          var service_date_array;
          if (this.serviceIdentify[j]['serviced_datetime'] == '0000-00-00') {
            service_date_array = this.serviceIdentify[j]['next_service_date'].split('-');
          } else {
            if (this.serviceIdentify[j]['serviced_time'] == null) {
              service_date_array = this.serviceIdentify[j]['next_service_date'].split('-');
            } else {
              service_date_array = this.serviceIdentify[j]['serviced_datetime'].split('-');
            }
          }




          console.log("DATE FORMAT" + this.serviceIdentify[j]['serviced_datetime']);
          var yearstr = service_date_array[0];
          var monthstr = parseInt(service_date_array[1], 10) - 1;
          var datestr = parseInt(service_date_array[2], 10);
          // var startMinute = Math.floor(Math.random() * 24 * 60);
          // var endMinute = Math.floor(Math.random() * 1) + startMinute;
          var startMinute = 20;
          var endMinute = 10 + startMinute;
          startTime = new Date(yearstr, monthstr, datestr, 10, 0 + startMinute);
          endTime = new Date(yearstr, monthstr, datestr, 10, 0 + endMinute);
          // console.log("TEST CALENDAR-2"+startTime+"//"+endTime);
          // startTime = new Date(service_date_array[0], service_date_array[1], service_date_array[2], 0, 0,0);
          //endTime = new Date(service_date_array[0], service_date_array[1], service_date_array[2], 0, 0,0);
          /*events.push({
            title: this.serviceIdentify[j]['service_subject'],
            startTime: startTime,
            endTime: endTime,
            allDay: true,
            icon: 'service',
            class: 'service'
          });*/

          events.push({
            "data": {},
            "icon": "camera",
            "class": "event",
            "iconStyle": { "color": "green" }
            , "style": { "color": "green" }
            , "name": this.serviceIdentify[j]['service_subject'],
            "type": "event",
            "startDate": startTime,
            "endDate": endTime,
            "allDay": false
          });



        }


        this.alarmIdentity = res.allalarms;
        for (var k = 0; k < this.alarmIdentity.length; k += 1) {
          // $('.monthview-primary-with-event').removeClass('monthview-primary-with-event[_ngcontent-c1]');
          //$('.monthview-primary-with-event').addClass('eventclass');
          var startTime;
          var endTime;
          var substrdt = this.alarmIdentity[k]['alarm_received_date'];//.substring(0, 10)'
          console.log("DATE FORMAT" + this.alarmIdentity[k]['alarm_received_date']);

          console.log("Date Substr result" + substrdt);
          var service_date_array = substrdt.split('-');
          var yearstr = service_date_array[0];
          var monthstr = parseInt(service_date_array[1], 10) - 1;
          var datestr = parseInt(service_date_array[2], 10);
          //var startMinute = Math.floor(Math.random() * 24 * 60);
          var startMinute = 20;
          var endMinute = 10 + startMinute;

          startTime = new Date(yearstr, monthstr, datestr, 10, 0 + startMinute);
          endTime = new Date(yearstr, monthstr, datestr, 10, 0 + endMinute);
          ///console.log("TEST CALENDAR-3"+startTime+"//"+endTime);
          // startTime = new Date(service_date_array[0], service_date_array[1], service_date_array[2], 0, 0,0);
          // endTime = new Date(service_date_array[0], service_date_array[1], service_date_array[2], 0, 0,0);
          /*events.push({
            title: this.alarmIdentity[k]['alarm_name'],
            startTime: startTime,
            endTime: endTime,
            allDay: true,
            icon: 'alarm',
            class: 'alarm'
          });
          */

          events.push({
            "data": {},
            "icon": "alarm",
            "class": "event",
            "iconStyle": { "color": "orange" }
            , "style": { "color": "orange" }
            , "name": this.alarmIdentity[k]['alarm_name'],
            "type": "event",
            "startDate": startTime,
            "endDate": endTime,
            "allDay": false
          });

        }


        // If the request was successful notify the user
        if (data.status === 200) {


        }
        // Otherwise let 'em know anyway
        else {

        }



        this.eventSource = events;

        console.log("Calendar response new collection:" + JSON.stringify(this.eventSource));
      });

  }

  /*viewTitle;
  isToday: boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };*/
  splitDate(curdate) {
    //var splitDt = curdate.split("@");
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let monthYear = monthNames[curdate.getMonth()] + " " + curdate.getUTCFullYear();
    return monthYear;
  }
  callingSwipe($event) {
    /*console.log('swiped callendar' + JSON.stringify($event));
    console.log("offsetDirection Left is 4 is from left to right=" + $event.offsetDirection);
    console.log("offsetDirection Left is 2 is right to left=" + $event.offsetDirection);
    if ($event.offsetDirection == 2) {
      this.calendarComponent.plusMonth(1);
    }
    if ($event.offsetDirection == 4) {
      this.calendarComponent.plusMonth(-1);
    }
*/

  }

  onEventPress($event) {
    console.log('event moved parent', $event);
  }

  onEventDoubletap($event) {
    console.log('on event double tab', $event);
  }
  afterEventMoved($event) {
    console.log('event moved parent', $event);
    /*this.nav.present(Toast.create({
      message: `Moved ${$event.element.name} to ${moment($event.element.startDate).format('MMM Do')}`,
      duration: 3000,
      position: 'top'
    }));
    */
    // alert(`Moved ${$event.element.name} to ${moment($event.element.startDate).format('MMM Do')}`)
  }

  onEventTap($event) {
    console.log('GENERIC ON EVENT TAP', $event);
    /* this.nav.present(Alert.create({
       title: `Clicked: ${$event.name}`,
       message: `From ${moment($event.startDate).calendar()} to ${moment($event.endDate).calendar()}`,
       buttons: ['Ok']
     }));
     */
    //alert(`From ${moment($event.startDate).calendar()} to ${moment($event.endDate).calendar()}`);
  }

  onEventPressed($event) {
    console.log('GENERIC ON EVENT PRESS', $event);
  }

  onMonthGridPressed($event) {
    console.log('GENERIC ON MONTHGRID PRESS', $event);
    this.showNewEventModal($event.date.toDate());
  }

  showNewEventModal(date?: Date) {
    if (!date) {
      date = new Date();
    }
    //console.log('Date is ' + date);
    /* let newEventModal = Modal.create(CalendarNewEventModal, { date: date });
     newEventModal.onDismiss(data => {
       if (data) {
         this.calendarComponent.addCalendarEvent(data);
       }
     });
     this.nav.present(newEventModal);
     */
  }

  previous() {
    this.navCtrl.setRoot(HomePage);
  }
  notification() {
    this.navCtrl.setRoot(NotificationPage);
  }
  redirectToUser() {
    this.navCtrl.setRoot(UnitsPage);
  }
  redirectToMessage() {
    this.navCtrl.setRoot(EmailPage);
  }
  redirectCalendar() {
    this.navCtrl.setRoot(CalendarPage);
  }
  redirectToMaps() {
    this.navCtrl.setRoot(MapsPage);
  }
  redirectToSettings() {
    this.navCtrl.setRoot(OrgchartPage);
  }
}
