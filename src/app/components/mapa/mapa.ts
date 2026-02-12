import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css'],
  standalone: true
})
export class Mapa implements AfterViewInit {
  private mapa: any;

  ngAfterViewInit(): void {
    this.generarMapa();
  }

  generarMapa(): void {
    // Crear el mapa
    this.mapa = L.map('map').setView([40, -3.0], 6);
    
    // Afegir layer de tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mapa);
  }
}