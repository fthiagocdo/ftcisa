import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { EventsPage } from '../pages/events/events';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { RecoverPasswordPage } from '../pages/recover-password/recover-password';
import { ProfilePage } from '../pages/profile/profile';
import { ContactPage } from '../pages/contact/contact';
import { FriendListPage } from '../pages/friend-list/friend-list';
import { SendSongsPage } from '../pages/send-songs/send-songs';
import { AddEventPage } from '../pages/add-event/add-event';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AuthProvider } from '../providers/auth/auth';
import { DatabaseProvider } from '../providers/database/database';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { UtilsProvider } from '../providers/utils/utils';
import { IonicStorageModule } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { SocialSharing } from '@ionic-native/social-sharing';

var firebaseConfig = {
  apiKey: "AIzaSyBl6j8IgWGaCHd99chRm9wvCyXpueaWUlY",
  authDomain: "ftc-isa-gandaia.firebaseapp.com",
  databaseURL: "https://ftc-isa-gandaia.firebaseio.com",
  projectId: "ftc-isa-gandaia",
  storageBucket: "ftc-isa-gandaia.appspot.com",
  messagingSenderId: "139829262836",
  appId: "1:139829262836:web:97c746f672333bc2eaa1a1",
  measurementId: "G-QSRFRJT8N3"
};

@NgModule({
  declarations: [
    MyApp,
    EventsPage,
    EventDetailPage,
    LoginPage,
    SignUpPage,
    RecoverPasswordPage,
    ProfilePage,
    ContactPage,
    FriendListPage,
    SendSongsPage,
    AddEventPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot({name: '__gandaiabd'}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EventsPage,
    EventDetailPage,
    LoginPage,
    SignUpPage,
    RecoverPasswordPage,
    ProfilePage,
    ContactPage,
    FriendListPage,
    SendSongsPage,
    AddEventPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    PreloaderProvider,
    UtilsProvider,
    GooglePlus,
    Facebook,
    DatabaseProvider,
    SocialSharing,
  ]
})
export class AppModule {}
