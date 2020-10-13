import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FriendListPage } from '../friend-list/friend-list';
import { SendSongsPage } from '../send-songs/send-songs';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AddEventPage } from '../add-event/add-event';
import { EventsPage } from '../events/events';

@IonicPage()
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {

  currentUser: any;
  event: any = [];
  description: string = '';

  constructor(
    public NAVCTRL: NavController,
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider,
    public DB: DatabaseProvider,
    public AUTH: AuthProvider,
    public UTILS: UtilsProvider,
    public ALERTCTRL: AlertController,
    public SOCIALSHARING: SocialSharing) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.event = this.NAVPARAMS.get('event');
    this.description = this.event.description.replace(/\n/g, '<br />');
  }

  addEventToFavorites() {
    if(this.isUserLogged()) {
      this.LOADER.displayPreloader();
      let _class = this;
      
      this.DB.addEventToFavorites(this.event.id, this.currentUser.id)
        .then(success => { 
          _class.UTILS.showMessage("Sua presença foi confirmada com sucesso!", "info");
          _class.LOADER.hidePreloader();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
          _class.LOADER.hidePreloader();
        });
    }
  }

  goToFriendList() {
    if(this.isUserLogged()) {
      this.NAVCTRL.push(FriendListPage, {
        event: this.event,
      });
    }
  }

  goToSendSongs() {
    if(this.isUserLogged()) {
      this.NAVCTRL.push(SendSongsPage, {
        event: this.event,
      });
    }
  }

  shareEvent() {
    this.SOCIALSHARING.share(null, this.event.name, null, this.event.url);
  }

  isUserLogged() {
    if(this.currentUser.isLogged){
      return true;
    }else{
      let alert = this.ALERTCTRL.create({
        title: 'Por favor, conecte-se à sua conta.',
        buttons: [{
          text: 'Cancelar',
          cssClass: 'ftc-info-color'
        }, {
          text: 'Conectar',
          cssClass: 'ftc-info-color',
          handler: () => {
            this.NAVCTRL.setRoot(LoginPage);
          },
        }],
        cssClass: 'ftc-info-color'
      });
      alert.present();
    }
  }

  editEvent() {
    this.NAVCTRL.setRoot(AddEventPage, {
      event: this.event,
    });
  }

  deleteEvent() {
    this.LOADER.displayPreloader();
    let _class = this;

    this.DB.deleteEvent(this.event.id)
        .then(success => { 
          _class.UTILS.showMessage("Evento excluído com sucesso!", "info");
          _class.NAVCTRL.setRoot(EventsPage);
        }, err => {
          console.log(err);
          _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
          _class.LOADER.hidePreloader();
        });
  }

}
