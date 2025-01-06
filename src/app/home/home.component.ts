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

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
      this.getWeather();
  }

  getWeather(): void {
    this.weatherService.getWeather(this.city).subscribe(data => {
      this.weatherData = data;
      console.log(this.weatherData);
    });
  }
}
