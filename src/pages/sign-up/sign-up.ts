import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { DatabaseProvider } from '../../providers/database/database';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  provider = 'email';
  photo = '/assets/imgs/user.png';


  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams, 
    public UTILS: UtilsProvider,
    public LOADER: PreloaderProvider,
    public ANGFIREAUTH: AngularFireAuth,
    public DB: DatabaseProvider) {
  }

  ionViewDidLoad() {
    this.LOADER.hidePreloader();
  }

  validateData() {
    let valid = true;
    if(this.name == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Nome e Sobrenome' deve ser preenchido.", 'error');
    }else if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }else if(this.password == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Senha' deve ser preenchido.", 'error');
    }else if(this.confirmPassword == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Confirmar Senha' deve ser preenchido.", 'error');
    }else if(this.password.length < 6){
      valid = false;
      this.UTILS.showMessage("A senha deve ter, no mínimo, 6 caracteres.", 'error');
    }else if(this.password != this.confirmPassword) {
      valid = false;
      this.UTILS.showMessage("Senha e Confirmar senha não correspondem.", 'error');
    }

    return valid;
  }

  signUp() {
    if(this.validateData()){
      this.LOADER.displayPreloader();
      let _class = this;
      
      //signs up the user in firebase
      this.ANGFIREAUTH.auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(credential => {
          firebase.auth().currentUser.sendEmailVerification()
            .then(success => {
              this.DB.addUser(this.email, this.name, true, '../assets/imgs/user.png')
                .then(success => {
                  _class.UTILS.showMessage('Enviamos um email de validação para o endereço cadastrado. Por favor, acesse sua caixa de emails e clique no link para validar o cadastro.', 'info');
                  _class.NAVCTRL.setRoot(LoginPage);
                }, err => {
                  console.log(err);
                  _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
                  _class.LOADER.hidePreloader();
                });
            }, err => {
              console.log(err);
              _class.UTILS.showMessage(err.message, 'error'); //msg do google é em EN/US. Mudar para mensagem padrão
              _class.LOADER.hidePreloader();
            });  
      }, err => {
        console.log(err);
        if(err.code == 'auth/email-already-in-use') {
          _class.UTILS.showMessage('Usuário já cadastrado.', 'error');  
        } else {
          _class.UTILS.showMessage(err.message, 'error');
        }
        _class.LOADER.hidePreloader();
      }); 
    }
  }

}
