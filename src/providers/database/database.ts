import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { UtilsProvider } from '../utils/utils';
import * as _ from 'lodash';

@Injectable()
export class DatabaseProvider {
   
   constructor(
      private UTILS: UtilsProvider,
   ) { }

   getVarGlobal(name) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('varGlobals').doc(name).get()
            .then( success => {
               let varGlobal : any = null;

               if(success.exists) {
                  varGlobal = {
                        value: success.data().value,
                     }
                  }

               resolve(varGlobal);
         }, err => {
            reject(err);
            console.log("Promise error: ", err);
            console.dir(err);
         });
      });
   }

   getUser(email) : Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('users').doc(email).get()
         .then( success => {
         let user : any = null;

         if(success.exists) {
            user = {
                  name: success.data().name,
                  photo: success.data().photo,
                  receiveNotification: success.data().receiveNotification,
               }
            }

         resolve(user);
      }, err => {
      reject(err);
      console.log("Promise error: ", err);
      console.dir(err);
      });
    });
   }

   addUser(email, name, receiveNotification, photo) : Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.firestore().collection('users').doc(email)
         .set({
            name: name,
            photo: photo,
            receiveNotification: receiveNotification,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(success => {
               resolve(true);
            }, err => {
               reject(false);
               console.log("Promise error: ", err);
               console.dir(err);
            });
    });
   }

   addEvent(name, description, photo, place, address, date, period, url) : Promise<any> {
      return new Promise((resolve, reject) => {
        firebase.firestore().collection('events')
         .add(this.setFieldsEvent(name, description, photo, place, address, date, period, url))
            .then(success => {
                  resolve(true);
            }, err => {
               reject(false);
               console.log("Promise error: ", err);
               console.dir(err);
            });
         });
   }

   public updateEvent(id, name, description, photo, place, address, date, period, url) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('events').doc(id)
            .update(this.setFieldsEvent(name, description, photo, place, address, date, period, url))
               .then(success => {
                  resolve(true);
               }, err => {
                  reject(false);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
            });
   }

   public deleteEvent(eventId) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('events').doc(eventId).delete()
            .then(success => {
               resolve(true);
            }, err => {
               reject(false);
               console.log("Promise error: ", err);
               console.dir(err);
            });
      });
   }

   getEvents() : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('events').orderBy('date', 'asc').get()
            .then( success => {
               let events : any = [];

               success.forEach((item) => {
                  events.push(this.getFieldsEvent(item));
               });

               resolve(events);
         }, err => {
            reject(err);
            console.log("Promise error: ", err);
            console.dir(err);
         });
      });
   }

   private getFieldsEvent(item) : {} {
      return {
         id: item.id,
         photo: item.data().photo,
         name: item.data().name,
         description: item.data().description,
         place: item.data().place,
         address: item.data().address,
         period: item.data().period,
         date: item.data().date,
         url: item.data().url
      };
   }

   private setFieldsEvent(name, description, photo, place, address, date, period, url) : {} {
      return {
         photo: photo,
         name: name,
         description: description,
         place: place,
         address: address,
         period: period,
         date: date,
         url: url,
         timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
   }

   public addSongSugestion(eventId, name, artist) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('events').doc(eventId).collection('songSuggestions')
            .add({
               artist: artist,
               name: name,
               timestamp: firebase.firestore.FieldValue.serverTimestamp()
               }).then(success => {
                  resolve(success.id);
               }, err => {
                  reject(false);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   public addNameInFriendList(eventId, name, email) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('events').doc(eventId).collection('friendList')
            .add({
               name: name,
               email: email,
               timestamp: firebase.firestore.FieldValue.serverTimestamp()
               }).then(success => {
                  resolve(success.id);
               }, err => {
                  reject(false);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

   public addEventToFavorites(eventId, userId) : Promise<any> {
      return new Promise((resolve, reject) => {
         firebase.firestore().collection('events').doc(eventId).collection('confirmedList')
            .add({
               userId: userId,
               timestamp: firebase.firestore.FieldValue.serverTimestamp()
               }).then(success => {
                  resolve(success.id);
               }, err => {
                  reject(false);
                  console.log("Promise error: ", err);
                  console.dir(err);
               });
      });
   }

}