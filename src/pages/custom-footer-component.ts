import { Component,Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { UnitsPage } from '../pages/units/units';
import { MapsPage } from '../pages/maps/maps';
import { CalendarPage } from '../pages/calendar/calendar';
import { EmailPage } from '../pages/email/email';
@Component({
  selector: 'custom-footer',
  templateUrl: 'custom-footer.html'
})
export class CustomFooterComponent {
  footer_data: any;
  constructor(public navCtrl: NavController) {}
  @Input()
  set footer(footer_data: any) {
    this.footer_data=footer_data;
  }
  get footer() {
    return this.footer_data;
  }
   redirectToUnits() {
    this.navCtrl.setRoot(UnitsPage);
  }
  redirectToMessage() {
    this.navCtrl.setRoot(EmailPage);
  }
  redirectToCalendar() {
    this.navCtrl.setRoot(CalendarPage);
  }
  redirectToMaps() {
    this.navCtrl.setRoot(MapsPage);
  }
  redirectToSettings() {
    this.navCtrl.setRoot(MyaccountPage);
  } 
}