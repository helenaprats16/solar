import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { PlantesItem } from '../plantes-item/plantes-item';

@Component({
  selector: 'app-plantes-list',
  imports: [PlantesItem],
  templateUrl: './plantes-list.html',
  styleUrl: './plantes-list.css',
})
export class PlantesList implements OnInit, OnDestroy{

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    //this.plantesSuscription && this.plantesSuscription.unsubscribe();
  }
      //plantes = toSignal(this.supaservice.getPlantes(),{
     // initialValue: []});

  
  cartes = signal<Planta[]>(PLANTES_DEMO);
}
