import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthProvider } from '../../providers/auth/auth';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-friend-list',
  templateUrl: 'friend-list.html',
})
export class FriendListPage {

  currentUser: any;
  event: any = [];
  name: string = '';
  email: string = '';

  constructor(
    public NAVCTRL: NavController,
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider,
    public DB: DatabaseProvider,
    public AUTH: AuthProvider,
    public UTILS: UtilsProvider) {
      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });
  }

  ionViewDidLoad() {
    this.event = this.NAVPARAMS.get('event');
    this.LOADER.hidePreloader();
  }

  validateData() {
    let valid = true;
    if(this.name == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Nome e Sobrenome' deve ser preenchido.", 'error');
    } else if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }

    return valid;
  }

  addNameInFriendList() {
    if(this.validateData()) {
      this.LOADER.displayPreloader();
      let _class = this;
      
      this.DB.addNameInFriendList(this.event.id, this.name, this.email)
        .then(success => { 
          _class.name = '';
          _class.email = '';
          _class.UTILS.showMessage("Nome enviada para Lista Amiga com sucesso!", "info");
          _class.LOADER.hidePreloader();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
          _class.LOADER.hidePreloader();
        });
    }
  }

}
