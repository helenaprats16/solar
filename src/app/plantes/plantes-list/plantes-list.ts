import { Component, signal } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { PlantesItem } from '../plantes-item/plantes-item';

@Component({
  selector: 'app-plantes-list',
  imports: [PlantesItem],
  templateUrl: './plantes-list.html',
  styleUrl: './plantes-list.css',
})
export class PlantesList {
  cartes = signal<Planta[]>(PLANTES_DEMO);
}
