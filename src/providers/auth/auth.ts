import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';

@Injectable()
export class AuthProvider {
  activeUser = new BehaviorSubject({ 
    isLogged: false,
    provider: '',
    uid: '',
    name: '',
    email: '',
    photo: '',
    receiveNotification: true,
  });

  constructor(
    public ANGULARFIREAUTH: AngularFireAuth, 
    public GOOGLEPLUS: GooglePlus, 
    public PLATFORM: Platform,
    public STORAGE: Storage) { }

  doLogin(user) {
    this.activeUser.next({ 
      isLogged: true,
      provider: user.provider,
      uid: user.uid,
      name: user.name,
      email: user.email,
      photo: user.photo,
      receiveNotification: user.receiveNotification,
    });
  }

  doLogout() {
    this.activeUser.next({ 
      isLogged: false,
      provider: '',
      uid: '',
      name: '',
      email: '',
      photo: '',
      receiveNotification: true,
     });

    this.STORAGE.remove("UID");
    this.ANGULARFIREAUTH.auth.signOut();
    if(this.PLATFORM.is('cordova')){
      this.GOOGLEPLUS.logout();
    }
  }

}
