import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { DatabaseProvider } from '../../providers/database/database';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { EventsPage } from '../events/events';

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddEventPage {

  name: string = '';
  description: string = '';
  photo: string = '';
  place: string = '';
  address: string = '';
  date: string = '';
  period: string = '';
  url: string = '';
  event: any;
  title: string = '';

  constructor(
    public NAVCTRL: NavController,
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider,
    public DB: DatabaseProvider,
    public UTILS: UtilsProvider) { }

  ionViewDidLoad() {
    this.event = this.NAVPARAMS.get('event');
    if(this.event != null) {
      this.title = 'Editar Evento';
      this.name = this.event.name;
      this.description = this.event.description;
      this.photo = this.event.photo;
      this.place = this.event.place;
      this.address = this.event.address;
      this.date = this.event.date;
      this.period = this.event.period;
      this.url = this.event.url;
    } else {
      this.title = 'Criar Evento';
    }
    this.LOADER.hidePreloader();
  }

  validateData() {
    let valid = true;
    if(this.name == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Nome do Evento' deve ser preenchido.", 'error');
    } else if(this.description == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Descrição do Evento' deve ser preenchido.", 'error');
    } else if(this.photo == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Url de Imagem do Evento' deve ser preenchido.", 'error');
    } else if(this.place == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Local do Evento' deve ser preenchido.", 'error');
    } else if(this.address == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Url do Endereço do Evento' deve ser preenchido.", 'error');
    } else if(this.date == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Data do Evento' deve ser preenchido.", 'error');
    } else if(this.period == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Período de Duração do Evento' deve ser preenchido.", 'error');
    } else if(this.url == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'URL de Compartilhamento do Evento' deve ser preenchido.", 'error');
    }

    return valid;
  }

  confimEvent() {
    if(this.event == null) {
      this.addEvent();
    } else {
      this.editEvent();
    }
  }

  addEvent() {
    if(this.validateData()) {
      this.LOADER.displayPreloader();
      let _class = this;
      
      this.DB.addEvent(
        this.name,
        this.description,
        this.photo,
        this.place,
        this.address,
        this.date,
        this.period,
        this.url)
        .then(success => {
          this.UTILS.showMessage("Evento adicionado com sucesso.");
          _class.NAVCTRL.setRoot(EventsPage);
      }, err => {
        console.log(err);
        _class.UTILS.showMessage(err.message, 'error');
        _class.LOADER.hidePreloader();
      });
    }
  }

  editEvent() {
    if(this.validateData()) {
      this.LOADER.displayPreloader();
      let _class = this;
      
      this.DB.updateEvent(
        this.event.id,
        this.name,
        this.description,
        this.photo,
        this.place,
        this.address,
        this.date,
        this.period,
        this.url)
        .then(success => {
          this.UTILS.showMessage("Evento atualizado com sucesso.");
          _class.NAVCTRL.setRoot(EventsPage);
      }, err => {
        console.log(err);
        _class.UTILS.showMessage(err.message, 'error');
        _class.LOADER.hidePreloader();
      });
    }
  }

}
