import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonInput, NavController } from '@ionic/angular';

import { FoodService } from '../../services/food.service';
import { Food } from '../../interfaces/food';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, fromEvent, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: false }) searchInput!: IonInput;
  food!: Food[];
  filteredFood!: Food[];
  vendorNames: { [key: number]: string } = {};
  searchQuery$!: Observable<String>;

  constructor(
    private navCtrl: NavController,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.getAllFood();
  }

  ngAfterViewInit(): void {
    console.log(this.searchInput);
    // use rxjs to handle search input
    this.searchInput.getInputElement().then((inputElement) => {
      if (inputElement) {
        fromEvent(inputElement, 'input').pipe(
          map((event: any) => event.target.value.toLowerCase()),
          tap((event) => console.log(event)),
          debounceTime(300), // wait for 300ms before handling next event
          distinctUntilChanged(), // only look for unique values
          catchError(() => EMPTY) // return nothing if error
        ).subscribe({
          next: (searchTerm: string) => {
            this.filterFoodList(searchTerm);
          },
          error: (err) => {
            throw new Error(err);
          }
        });
      } else {
        console.log('No inputs detected...');
      }
    }).catch((err) => {
      throw new Error(err);
    });
  }

  onMapClick() {
    this.navCtrl.navigateForward('/home/map');
  }

  getAllFood() {
    this.foodService.getAllFood().subscribe({
      next: (response: Food[]) => {
        this.food = response;
        this.filteredFood = [...this.food];
        
        this.food.forEach(item => {
          if (item.image_url === 'http://localhost:4000/uploads/null') {
            item.image_url = '/assets/placeholder-images/food.png';
          }
          this.getFoodByVendorId(item.vendor_id);
        });
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  getFoodByVendorId(id: number) {
    this.foodService.getFoodByVendorId(id).subscribe({
      next: (response: any) => {
        const jsonResponse = response as any;
        this.vendorNames[id] = jsonResponse.vendor_name;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  filterFoodList(searchTerm: string) {
    if (searchTerm) {
      this.filteredFood = this.food.filter((food: Food) => {
        return food.food_name.toLowerCase().includes(searchTerm);
      });
    } else {
      this.filteredFood = [...this.food];
    }
  }

  onSearch() {
    // use rxjs to handle search input
    this.searchInput.getInputElement().then((inputElement) => {
      fromEvent(inputElement, 'ionInput').pipe(
        map((event: any) => event.target.value.toLowerCase()),
        debounceTime(300), // wait for 300ms before handling next event
        distinctUntilChanged(), // only look for unique values
        catchError(() => EMPTY) // return nothing if error
      ).subscribe({
        next: (searchTerm: string) => {
          this.filterFoodList(searchTerm);
          console.log(this.filteredFood);
        },
        error: (err) => {
          throw new Error(err);
        }
      });
    });
  }

  navigateToFoodDetail(id: number) {
    this.navCtrl.navigateForward(`home/food-detail/${id}`);
  }
}
