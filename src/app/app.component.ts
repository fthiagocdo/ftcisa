import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EventsPage } from '../pages/events/events';
import { LoginPage } from '../pages/login/login';
import { AddEventPage } from '../pages/add-event/add-event';
import { ContactPage } from '../pages/contact/contact';
import { ProfilePage } from '../pages/profile/profile';
import { AuthProvider } from '../providers/auth/auth';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { UtilsProvider } from '../providers/utils/utils';
import { DatabaseProvider } from '../providers/database/database';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  pagesGuest: Array<{title: string, icon: string, component: any}>;
  pagesUser: Array<{title: string, icon: string, component: any}>;
  email = 'tiffanydatabase@mail.com';
  password = 'FrbS@197569';
  currentUser: any;

  constructor(
    private PLATFORM: Platform, 
    private STATUSBAR: StatusBar, 
    private SPLASHSCREEN: SplashScreen,
    private AUTH : AuthProvider, 
    private LOADER: PreloaderProvider,
    private UTILS: UtilsProvider,
    private DB: DatabaseProvider,
  ) {
    this.initializeApp();

    this.AUTH.activeUser.subscribe((_user)=>{
      this.currentUser = _user;
    });

    this.pagesGuest = [
      { title: 'Entrar', icon: 'log-in', component: LoginPage },
      { title: 'Eventos', icon: 'calendar', component: EventsPage },
      { title: 'Contato', icon: 'mail', component: ContactPage },
    ];

    this.pagesUser = [
      { title: 'Perfil', icon: 'person', component: ProfilePage },
      { title: 'Eventos', icon: 'calendar', component: EventsPage },
      { title: 'Criar Evento', icon: 'add', component: AddEventPage },
      { title: 'Contato', icon: 'mail', component: ContactPage },
      { title: 'Sair', icon: 'log-out', component: LoginPage },
    ];
  }

  initializeApp() {
    this.PLATFORM.ready().then(() => {
      this.STATUSBAR.backgroundColorByHexString('#e4341c');
      this.SPLASHSCREEN.hide();
    });
  }

  openPage(page) {
    this.LOADER.displayPreloader();
    if(page.title == 'Sair'){
      this.AUTH.doLogout();
      this.nav.setRoot(LoginPage);
    }else{
      this.nav.setRoot(page.component);
    }
  }
}
