import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventDetailPage } from '../event-detail/event-detail';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  private currentUser: any;
  private events: any;

  constructor(
    private NAVCTRL: NavController,
    private LOADER: PreloaderProvider,
    private DB: DatabaseProvider,
    private AUTH: AuthProvider,
    private UTILS: UtilsProvider) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.LOADER.displayPreloader();
    this.renderEvents();
  }

  renderEvents() {
    let _class = this;

    this.DB.getEvents()
      .then(success => { 
        _class.events = success;
        _class.LOADER.hidePreloader();
      }, err => {
        console.log(err);
        _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
        _class.LOADER.hidePreloader();
      });
  }

  goToEventDetail(event) {
    this.NAVCTRL.push(EventDetailPage, {
      event: event
    });
  }

}
