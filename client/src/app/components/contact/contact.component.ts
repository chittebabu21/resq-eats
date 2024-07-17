import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent  implements OnInit {
  supportEmail = 'support@resq-eats.com';
  companyAddress = '12 Tai Seng Link #05-01 S(534233)';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onDismiss() {
    this.modalCtrl.dismiss();
  }

}
