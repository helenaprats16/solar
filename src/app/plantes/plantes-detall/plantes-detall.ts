
// Componente para mostrar el detalle de una planta seleccionada
import { Component, computed, input } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo'; // Datos de ejemplo


@Component({
  selector: 'app-plantes-detall', // Selector para usar este componente
  imports: [],
  templateUrl: './plantes-detall.html',
  styleUrl: './plantes-detall.css',
})
export class PlantesDetall {
  // Recibe el id de la planta como input
  id = input<string>();

  // La planta se calcula automáticamente cada vez que cambia el id
  // Busca la planta correspondiente en el array de ejemplo
  planta = computed(() => {
    const idNum = Number(this.id());
    return PLANTES_DEMO.find(p => p.id === idNum)
  })
}
