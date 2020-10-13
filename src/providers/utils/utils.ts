import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
//import * as CryptoJS from 'crypto-js';

@Injectable()
export class UtilsProvider {

  constructor(
    private ALERTCTRL: AlertController) { 
    }

  showMessage(message, messageType?) {
      if(message != null){
        if(messageType == 'error'){
          let alert = this.ALERTCTRL.create(  {
            title: message,
            buttons: [{
              text: 'Fechar',
              cssClass: 'ftc-alert-error-button ftc-modal-button'
            }],
            cssClass: 'ftc-error-color'
          });
          alert.present();
        }else{
          let alert = this.ALERTCTRL.create({
            title: message,
            buttons: [{
              text: 'Fechar',
              cssClass: 'ftc-alert-info-button ftc-modal-button'
            }],
            cssClass: 'ftc-info-color'
          });
          alert.present();
        }
      }
  }

  isEmpty(value){
    if(value == null || value == 'null' || value == '' || value == ""){
      return true;
    }else{
      return false;
    }
  }

  justNumbers(text) {
    return text.replace(/\D/g, '');
  }

  leftPad(number, pad, length) {
    let left = '';
    
    for (let index = 0; index < length; index++) {
      left += pad;
    }

    return number.length >= length ? number :  (left+number).slice(-1*length);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  removeItemArray(arr, value) {
    return arr.filter(function(ele){
        return ele != value;
    });
  }

  /*crypt(rawStr) : string {
    let wordArray = CryptoJS.enc.Utf8.parse(rawStr);
    return CryptoJS.enc.Base64.stringify(wordArray);
   }*/
}
