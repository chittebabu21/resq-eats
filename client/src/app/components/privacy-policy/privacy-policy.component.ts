import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  supportEmail = 'support@resq-eats.com';
  companyAddress = '12 Tai Seng Link #05-01 Singapore 534233';

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onDismiss() {
    this.modalCtrl.dismiss();
  }

}
