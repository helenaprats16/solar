import { Component, input } from '@angular/core';
import { Planta } from '../planta';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-plantes-item',
  imports: [RouterLink], //es deu de importar RouterLink perque en el .html em enllaçat el boto a plantes-detall
  templateUrl: './plantes-item.html',
  styleUrl: './plantes-item.css',
})
export class PlantesItem {
  carta = input.required<Planta>({alias:'plantaId'});

}
