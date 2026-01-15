import { Component, computed, input } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';

@Component({
  selector: 'app-plantes-detall',
  imports: [],
  templateUrl: './plantes-detall.html',
  styleUrl: './plantes-detall.css',
})
export class PlantesDetall {

  id = input<string>();

  //La planta se "calcula" automaticamente cunado cambia

  planta= computed(() => {
    const idNum = Number(this.id());
    return PLANTES_DEMO .find(p => p.id === idNum)
  })
}
