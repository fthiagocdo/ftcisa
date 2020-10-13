import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from '../../providers/preloader/preloader';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    public NAVCTRL: NavController, 
    public NAVPARAMS: NavParams,
    private CAMERA: Camera,
    private UTILS: UtilsProvider,
    private LOADER: PreloaderProvider) {
  }

  ionViewDidLoad() {
    this.LOADER.hidePreloader();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.CAMERA.DestinationType.FILE_URI,
      encodingType: this.CAMERA.EncodingType.JPEG,
      mediaType: this.CAMERA.MediaType.PICTURE,
      sourceType : this.CAMERA.PictureSourceType.SAVEDPHOTOALBUM,
      allowEdit: true,
      targetWidth: 50,
      targetHeight: 50,
    }

    let _class = this;
    this.CAMERA.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      _class.UTILS.showMessage(base64Image, 'info');
     }, (err) => {
      _class.UTILS.showMessage(err, 'error');
     });
  }

}
