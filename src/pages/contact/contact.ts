import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PreloaderProvider } from '../../providers/preloader/preloader';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  email: string = '';
  name: string = '';
  subject: string = '';
  message: string = '';

  constructor(
    public NAVCTRL: NavController,
    public NAVPARAMS: NavParams,
    public LOADER: PreloaderProvider,
    public DB: DatabaseProvider,
    public UTILS: UtilsProvider,
    public SOCIALSHARING: SocialSharing) { }

  ionViewDidLoad() { 
    this.LOADER.hidePreloader();
  }

  validateData() {
    let valid = true;
    if(this.email == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Email' deve ser preenchido.", 'error');
    } else if(this.name == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Nome' deve ser preenchido.", 'error');
    } else if(this.subject == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Assunto' deve ser preenchido.", 'error');
    } else if(this.message == ''){
      valid = false;
      this.UTILS.showMessage("O campo 'Mensagem' deve ser preenchido.", 'error');
    }

    return valid;
  }

  sendMessage() {
    if(this.validateData()) {
      this.LOADER.displayPreloader();
      let _class = this;
    
      this.DB.getVarGlobal('email_contact')
        .then(success => { 
          let emailContact = success.value;

          _class.SOCIALSHARING.shareViaEmail(_class.message, _class.name+' - '+_class.subject, emailContact, null, null, null);
          _class.LOADER.hidePreloader();
        }, err => {
          console.log(err);
          _class.UTILS.showMessage("Não foi possível completar a requisição. Por favor, tente novamente mais tarde...", 'error');
          _class.LOADER.hidePreloader();
        });
    }
  }

}
