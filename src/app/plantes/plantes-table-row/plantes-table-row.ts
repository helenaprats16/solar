import { Component, input } from '@angular/core';
import { Planta } from '../planta';

@Component({
  selector: '[app-plantes-table-row]', // en [] perque es un atribut
  imports: [],
  templateUrl: './plantes-table-row.html',
  styleUrl: './plantes-table-row.css',
})
export class PlantesTableRow {


  //planta!: Planta;
  planta = input.required<Planta>({alias:'plantaId'});
}
