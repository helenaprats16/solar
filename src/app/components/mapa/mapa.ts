import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class Mapa implements AfterViewInit {
  
  private mapa: any;

  ngAfterViewInit(): void {
    console.log('Iniciando mapa...');
    
    // Espera suficiente tiempo
    setTimeout(() => {
      this.crearMapa();
    }, 400);
  }

  crearMapa(): void {
    try {
      // 1. Crear mapa
      this.mapa = L.map('map', {
        zoomControl: true,
        dragging: true
      }).setView([40, -3.0], 6);
      
      // 2. Añadir capa
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(this.mapa);
      
      console.log('Mapa creado');
      
      // 3. Forzar ajuste de tamaño
      setTimeout(() => {
        if (this.mapa) {
          this.mapa.invalidateSize();
          console.log('Tamaño ajustado');
        }
      }, 600);
      
    } catch (error) {
      console.error('Error:', error);
    }
  }
}