import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendSongsPage } from './send-songs';

@NgModule({
  declarations: [
    SendSongsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendSongsPage),
  ],
})
export class SendSongsPageModule {}
