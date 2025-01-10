import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  city = 'Lyon';
  weatherData: any;
  hourlyForecast: any[] = [];
  dailyForecast: { list: any[] } | null = null;  // D'après la console, c'est un Object et non une liste : any[] = []; 
  errorMessage: string | null = null;


  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeather();
    this.getHourForecast();
    this.getDailyForecast();
  }

  getWeather(): void {
    this.weatherService.getWeather(this.city).subscribe({
      error: (err) => {
        console.error('Erreur lors de la récupération des données météo :', err);
        this.errorMessage = 'Impossible de charger la météo.';
      },
      next: (data) => {
        this.weatherData = data;
        console.log('Météo actuelle :', this.weatherData);
      }
    });
  }

  getHourForecast(): void {
    this.weatherService.getHourForecast(this.city).subscribe({
      error: (err) => {
        console.error('Erreur lors de la récupération des prévisions horaires :', err);
        this.errorMessage = 'Impossible de charger les prévisions horaires.';
      },
      next: (data) => {
        this.hourlyForecast = data.list.slice(0, 6); // liste des prévisions : On accède directement à "list" avec "."
        console.log('Prévisions horaires :', this.hourlyForecast);
      },
    });
  }

  getDailyForecast(): void {
    this.weatherService.getDailyForecast(this.city).subscribe({
      next: (data) => {
        this.dailyForecast = data; 
        console.log('Prévisions à venir :', this.dailyForecast);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des prévisions :', err);
        this.errorMessage = 'Impossible de charger les prévisions des jours à venir. Veuillez réessayer plus tard.';
      }
    });
  }
}
