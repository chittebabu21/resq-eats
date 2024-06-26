import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from '../services/food.service';
import { Food } from '../interfaces/food';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fillList = 'solid';
  fillMap = 'outline';
  food!: Food[];

  constructor(
    private router: Router,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.getAllFood();
  }

  onListClick() {
    this.fillList = 'solid';
    this.fillMap = 'outline';

    this.router.navigateByUrl('/home');
  }

  onMapClick() {
    this.fillList = 'outline';
    this.fillMap = 'solid';

    this.router.navigateByUrl('/home/map');
  }

  getAllFood() {
    this.foodService.getAllFood().subscribe({
      next: (response: Food[]) => {
        this.food = response;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
