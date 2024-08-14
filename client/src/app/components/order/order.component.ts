import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, AlertController } from '@ionic/angular';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { Food } from '../../interfaces/food';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { User } from '../../interfaces/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { switchMap, tap } from 'rxjs';
import { CurrencyPipe } from '@angular/common';

interface SelectedVendor {
  vendorName: string,
  contactNumber: string,
  address: string
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent; 
  @Input() selectedFood!: Food;
  @Input() selectedVendor!: SelectedVendor;
  paymentForm!: FormGroup;
  user!: User
  errorMsg = '';

  public cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontWeight: 400,
        fontFamily: 'Circular',
        fontSize: '18px',
        iconColor: '#666EE8',
        color: '#002333',
        '::placeholder': {
          color: '#919191'
        }
      },
      invalid: {
        iconColor: '#ffc7ee',
        color: '#ffc7ee'
      }
    }
  };

  public elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private userService: UserService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    const userId = this.userService.get('userId')
    console.log(typeof userId);

    if (userId) {
      const parsedId = parseInt(userId);
      this.userService.getUserById(parsedId).subscribe({
        next: (response: any) => {
          const jsonResponse = response as any;
          this.user = jsonResponse;
          this.updateForm(this.user);

          this.paymentForm.controls['username'].disable();
          this.paymentForm.controls['email_address'].disable();
          this.paymentForm.controls['amount'].disable();
          console.log(this.user);
        },
        error: (error) => {
          throw new Error(error);
        }
      });

      this.paymentForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        email_address: new FormControl('', [Validators.required, Validators.email]),
        amount: new FormControl('', [Validators.required, Validators.pattern(/d+/)]),
        quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(this.selectedFood.quantity)])
      });    
    }
  }

  updateForm(user: User) {
    this.paymentForm.patchValue({
      username: user.username,
      email_address: user.email_address,
      amount: this.selectedFood.price
    });
  }

  pay(): void {
    const paymentAmount = this.paymentForm.get('amount')?.value;
    const username = this.paymentForm.get('username')?.value;

    this.paymentService.createPaymentIntent(paymentAmount * 100).pipe(
      tap((pi: any) => console.log(pi.data)),
      switchMap((pi: any) => this.stripeService.confirmCardPayment(pi.data.client_secret as string, {
        payment_method: {
          card: this.card.element,
          billing_details: {
            name: username
          }
        }
      })
    )).subscribe({
      next: (result: any) => {
        console.log(result);

        if (result.error) {
          console.log(result.error.message);

          this.errorMsg = result.error.message;
        } else if (result.paymentIntent.status === 'succeeded') {
          const body = {
            user_id: this.user.user_id,
            food_id: this.selectedFood.food_id,
            quantity: this.paymentForm.get('quantity')?.value
          };
          this.orderService.insertOrderWithOrderDetails(body).subscribe({
            next: (response: any) => {
              console.log(response.data);
            },
            error: (error) => {
              throw new Error(error);
            }, 
            complete: async () => {
              const amount = this.paymentForm.get('amount')?.value;
              const formattedAmount = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'SGD'
              }).format(amount);

              const successAlert = await this.alertCtrl.create({
                header: 'SUCCESS!',
                message: `You have paid $${formattedAmount}.`,
                backdropDismiss: false,
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.modalCtrl.dismiss();
                    this.navCtrl.navigateBack('/home/main');
                  }
                }]
              });
          
              await successAlert.present();
            }
          });
        }
      },
      error: (error) => {
        console.log(error.message);
        this.errorMsg = 'Payment failed. Please try again.';
        throw new Error(error.message);
      }
    });
  }

  add() {
    let orderQuantity = this.paymentForm.get('quantity')?.value;
    if (orderQuantity < this.selectedFood.quantity) {
      orderQuantity++;
      this.paymentForm.get('quantity')?.setValue(orderQuantity);

      if (this.selectedFood) {
        const newAmount = orderQuantity * this.selectedFood.price!;
        this.paymentForm.get('amount')?.setValue(newAmount);
      }
    }
  }

  remove() {
    let orderQuantity = this.paymentForm.get('quantity')?.value;
    if (orderQuantity > 1) {
      orderQuantity--;
      this.paymentForm.get('quantity')?.setValue(orderQuantity);

      if (this.selectedFood) {
        const newAmount = orderQuantity * this.selectedFood.price!;
        this.paymentForm.get('amount')?.setValue(newAmount);
      }
    }
  }

  onDismiss() {
    this.modalCtrl.dismiss();
  }
}
