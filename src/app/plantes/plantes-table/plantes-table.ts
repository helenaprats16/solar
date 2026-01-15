import { Component, signal } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { PlantesTableRow } from "../plantes-table-row/plantes-table-row";

@Component({
  selector: 'app-plantes-table',
  imports: [PlantesTableRow],
  templateUrl: './plantes-table.html',
  styleUrl: './plantes-table.css',
})
export class PlantesTable {

  //plantes: Planta[] = PLANTES_DEMO;

  plantes = signal<Planta[]>(PLANTES_DEMO);
}
