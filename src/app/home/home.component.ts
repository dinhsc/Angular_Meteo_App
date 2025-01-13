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
  dailyForecast: { list: any[] } | null = null;  // Ici c'est un Object content une "list" / D'après la console, c'est un Object et non une liste : any[] = []; 
  filteredDailyForecast: any[] = [];
  errorMessage: string | null = null;


  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeather();
    this.getHourForecast();
    this.getDailyForecast();
    if (this.dailyForecast?.list) {
      this.filteredDailyForecast = this.getUniqueDays(this.dailyForecast.list);
    }
  }

  getUniqueDays(forecastList: any[]): any[] {
    const uniqueDays: any[] = []; // On stocke les jours unique ici

    // On parcours toute la liste des 40 prévisions 
    forecastList.forEach((forecast) => {
      // Récupération du jour à comparer
      const day = forecast.dt_txt.split(' ')[0]; // On sépare "2025-01-12 15:00:00" en deux partie et avec [0] on récupère uniquement "2025-01-12", la date du jour
      const time = forecast.dt_txt.split(' ')[1]; // Extrait l'heure
      const existingDayIndex = uniqueDays.findIndex((item) => item.dt_txt.split(' ')[0] === day);

      if (existingDayIndex === -1) {
        // Si le jour n'existe pas encore, ajoute la prévision actuelle
        uniqueDays.push(forecast);
      } else if (time === '12:00:00') {
        // Si le jour existe déjà mais la prévision actuelle est à 12:00, remplace
        uniqueDays[existingDayIndex] = forecast;
      }
    });
    //   // Vérification si le jour actuel existe déjà
    //   const alreadyExists = uniqueDays.some((item) => item.dt_txt.split(' ')[0] === day); // Parcours la liste de uniqueDays et compare la date actuel "item.dt_txt.split(' ')[0]" avec celle stocké précédemment

    //   // Ajoute seulement les nouvelles dates
    //   if (!alreadyExists && time === '12:00:00') {
    //     uniqueDays.push(forecast);
    //   }

    // });

    return uniqueDays;
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
        console.log('Prévisions brutes à venir :', this.dailyForecast);
        // Filtrage des prévisions
        this.filteredDailyForecast = this.getUniqueDays(this.dailyForecast?.list || []); // Contient les prévisions pour chaque jours, obtenu dans "getUniqueDays"
        console.log('Prévisions filtrées :', this.filteredDailyForecast);

      },
      error: (err) => {
        console.error('Erreur lors de la récupération des prévisions :', err);
        this.errorMessage = 'Impossible de charger les prévisions des jours à venir. Veuillez réessayer plus tard.';
      }
    });
  }
}
