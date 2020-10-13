import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, Platform, AlertController } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
//import { GooglePlus } from '@ionic-native/google-plus';
//import { Facebook } from '@ionic-native/facebook';
import { AuthProvider } from '../../providers/auth/auth';
import { Storage } from '@ionic/storage';
import { EventsPage } from '../events/events';
import { SignUpPage } from '../sign-up/sign-up';
import { RecoverPasswordPage } from '../recover-password/recover-password';
import { UtilsProvider } from '../../providers/utils/utils';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  currentUser: any;
  email: string = "";
  password: string = "";
  keepLogged: boolean = true;
  keepmeLoggedAlias: string = 'UID';

  constructor(
    public NAVCTRL: NavController,  
    public ANGFIREAUTH: AngularFireAuth, 
    //public GOOGLEPLUS: GooglePlus, 
    //public FACEBOOK: Facebook,
    public PLATFORM: Platform,
    public AUTH : AuthProvider, 
    public LOADER: PreloaderProvider,
    public MODALCTRL: ModalController,
    public ALERTCTRL: AlertController,
    public STORAGE: Storage,
    public UTILS: UtilsProvider,
    public DB: DatabaseProvider,
    ) {

      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });

  }

  ionViewDidLoad() {
    this.LOADER.hidePreloader();
  }

  validateData() {
    let valid = true;
    if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    }else if(this.password == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Senha' deve ser preenchido.", 'error');
    }

    return valid;
  }

  loginEmail() {
    if(this.validateData()){
      this.LOADER.displayPreloader();
      let _class = this;
      
      //Signs in firebase
      this.ANGFIREAUTH.auth.signInWithEmailAndPassword(this.email, this.password)
        .then(credential => {
          if(credential.emailVerified){
            let data: any = [];
            data.email = credential.email;
            data.provider = 'email';
            data.uid = credential.uid;
            
            if(_class.keepLogged) {
              _class.setDetailsKeepmeLogged(credential.uid);
            } else {
              _class.clearDetailsKeepmeLogged();
            }

            this.DB.getUser(this.email)
              .then(user => {
                data.name = user.name;
                data.receiveNotification = user.receiveNotification;
                data.photo = user.photo;
                _class.doLogin(data);
              }, err => {
                console.log(err);
                _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
                _class.LOADER.hidePreloader();
              });
          }else{
            _class.resendEmailVerification();
            this.LOADER.hidePreloader();
          }
      }, err => {
        console.log(err);
        _class.UTILS.showMessage(err.message, 'error'); //msg do google é em EN/US. Mudar para mensagem padrão
        _class.LOADER.hidePreloader();
      });
    }
  }

  loginGoogle() {
    if(this.PLATFORM.is('cordova')){
      this.nativeGoogleLogin();
    }else{
      this.webGoogleLogin();
    }
  }

  webGoogleLogin() {
    /*let _class = this;
    this.LOADER.displayPreloader();

    const provider = new firebase.auth.GoogleAuthProvider();
    this.ANGFIREAUTH.auth.signInWithPopup(provider)
      .then(function (credential) {
        _class.HTTPSERVICE.findUser(credential.user.uid)
          .subscribe(data => { 
            _class.doLogin(data);

            if(_class.keepLogged) {
              _class.setDetailsKeepmeLogged(credential.uid);
            } else {
              _class.clearDetailsKeepmeLogged();
            }
          }, err => {
            _class.createUser(credential.user.displayName, credential.user.email, 'google', credential.user.uid, credential.user.photoURL);
          }
        );
    }, function (err) {
      _class.LOADER.hidePreloader();
      _class.UTILS.showMessage(err.message, 'error');
    });*/
  }

  nativeGoogleLogin() {
    /*let _class = this;
    this.LOADER.displayPreloader();

    this.GOOGLEPLUS.login({
      'webClientId': '278302234775-8tdaq06iproa4koqo63haq556b6uv36j.apps.googleusercontent.com'
    })
      .then( res => {
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        firebase.auth().signInWithCredential(googleCredential)
          .then( credential => {
            _class.HTTPSERVICE.findUser(credential.uid)
              .subscribe(data => { 
                _class.doLogin(data);

                if(_class.keepLogged) {
                  _class.setDetailsKeepmeLogged(credential.uid);
                } else {
                  _class.clearDetailsKeepmeLogged();
                }
              }, err => {
                _class.createUser(credential.displayName, credential.email, 'google', credential.uid, credential.photoURL);
              }
        );
      });
    }, err => {
      _class.LOADER.hidePreloader();
      _class.UTILS.showMessage(err, 'error');
    });*/
  }

  loginFacebook() {
    /*this.LOADER.displayPreloader();
    let _class = this;
    
    this.FACEBOOK.login(['public_profile', 'email'])
      .then( res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential)
          .then( user => { 
            _class.HTTPSERVICE.findUser(user.uid)
              .subscribe(data => { 
                _class.doLogin(data);

                if(_class.keepLogged) {
                  _class.setDetailsKeepmeLogged(user.uid);
                } else {
                  _class.clearDetailsKeepmeLogged();
                }
              }, err => {
                _class.createUser(user.displayName, user.email, 'google', user.uid, user.photoURL+'?height=256&width=256');
              }
            );
      }, err => {
        _class.LOADER.hidePreloader();
        _class.UTILS.showMessage(err.message, 'error');
      });
    }, err => {
      _class.LOADER.hidePreloader();
      _class.UTILS.showMessage(JSON.stringify(err), 'error');
    });*/
  }

  doLogin(data) {
    this.currentUser.name = data.name
    this.currentUser.email = data.email;
    this.currentUser.provider = data.provider;
    this.currentUser.uid = data.uid;
    this.currentUser.photo = data.photo;
    this.currentUser.receiveNotification = data.receiveNotification;

    this.AUTH.doLogin(this.currentUser);
    this.NAVCTRL.setRoot(EventsPage); 
  }

  createUser(name, email, provider, providerUid, photo) {
    /*this.HTTPSERVICE.saveUser(name, email, provider, providerUid, photo)
      .subscribe(data => {
        this.doLogin(data);
      }, err => {
        console.log(err);
        this.UTILS.showMessage('Não foi possível completar a requisição. Por favor, entre em contato com um administrador.', 'error');
        this.LOADER.hidePreloader();
      }
    );*/
  }

  goToSignUp() {
    this.LOADER.displayPreloader();
    this.NAVCTRL.push(SignUpPage);
  }

  goToRecoverPassword() {
    this.LOADER.displayPreloader();
    this.NAVCTRL.push(RecoverPasswordPage);
  }

  resendEmailVerification() {
    let alert = this.ALERTCTRL.create({
      title: 'Cadastro não validado. Deseja que o email de validação seja reenviado?',
      buttons: [{
        text: 'Sim',
        cssClass: 'ftc-yes-button ftc-modal-button',
        handler: () => {
          this.LOADER.displayPreloader;
          firebase.auth().currentUser.sendEmailVerification()
            .then(success => {
              this.UTILS.showMessage('Enviamos um email de validação para o endereço cadastrado. Por favor, acesse sua caixa de emails e clique no link para validar o cadastro.', 'info');
              this.LOADER.hidePreloader();
            }, err => {
              console.log(err);
              this.UTILS.showMessage(err.message, 'error'); //msg do google é em EN/US. Mudar para mensagem padrão
              this.LOADER.hidePreloader();
            });  
        }
      }, {
        text: 'Não',
        cssClass: 'ftc-no-button ftc-modal-button',
        handler: () => {
          this.AUTH.doLogout();
        }
      }],
      cssClass: 'ftc-info-color'
    });
    alert.present();
  }

  setDetailsKeepmeLogged(uid) {
    this.STORAGE.set(this.keepmeLoggedAlias, uid);
  }

  clearDetailsKeepmeLogged() {
    this.STORAGE.remove(this.keepmeLoggedAlias);
  }

}
