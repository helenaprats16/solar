import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo'; // Array de plantas de ejemplo
import { Planta } from '../planta'; // Interfaz que define la estructura de una planta
import { PlantesItem } from '../plantes-item/plantes-item'; // Componente para mostrar cada planta


@Component({
  selector: 'app-plantes-list', // Selector para usar este componente en plantillas
  imports: [PlantesItem], // Importa el componente PlantesItem para mostrar cada planta
  templateUrl: './plantes-list.html', // Plantilla HTML asociada
  styleUrl: './plantes-list.css', // Estilos CSS asociados
})
export class PlantesList implements OnInit, OnDestroy{

  // Hook que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Aquí podrías cargar datos desde un servicio si no usas datos de ejemplo
  }

  // Hook que se ejecuta al destruir el componente
  ngOnDestroy(): void {
    // Si tuvieras suscripciones a observables, aquí las cancelarías
    //this.plantesSuscription && this.plantesSuscription.unsubscribe();
  }

  // Array reactivo de plantas que se muestra en la lista
  // Por ahora usa datos de ejemplo, pero podrías obtenerlos de un servicio
  cartes = signal<Planta[]>(PLANTES_DEMO);
}
