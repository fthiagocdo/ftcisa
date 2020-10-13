import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { AngularFireAuth } from 'angularfire2/auth';
import { UtilsProvider } from '../../providers/utils/utils';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {

  private email: string = "";
  
  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams, 
    public UTILS: UtilsProvider,
    public LOADER: PreloaderProvider,
    public ANGFIREAUTH: AngularFireAuth
  ) {
  }

  ionViewDidLoad() {
    this.LOADER.hidePreloader();
  }

  validateData() {
    let valid = true;
    if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }

    return valid;
  }

  recoverPassword() {
    if(this.validateData()) {
      this.LOADER.displayPreloader();
      let _class = this;
      
      //Signs in firebase
      this.ANGFIREAUTH.auth.sendPasswordResetEmail(this.email)
        .then(success => {
          this.UTILS.showMessage("Por favor, verifique sua caixa de entrada e clique no link para redefinir sua senha.");
          _class.NAVCTRL.setRoot(LoginPage);
      }, err => {
        console.log(err);
        if(err.code == 'auth/invalid-email') {
          _class.UTILS.showMessage('Email inválido.', 'error');  
        } else if(err.code == 'auth/user-not-found') {
          _class.UTILS.showMessage('Email não encontrado.', 'error');  
        } else {
          _class.UTILS.showMessage(err.message, 'error');
        }
        _class.LOADER.hidePreloader();
      });
    }
  }

}
