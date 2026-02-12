import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { PlantesItem } from '../plantes-item/plantes-item';
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-plantes-list',
  imports: [PlantesItem],
  templateUrl: './plantes-list.html',
  styleUrl: './plantes-list.css',
})
export class PlantesList implements OnInit {
  private searchService = inject(SearchService);
  
  cartes = signal<Planta[]>(PLANTES_DEMO);
  searchTerm = signal<string>('');

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm.set(term);
    });
  }

  // Plantes filtrades per nom
  cartesFiltered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.cartes();
    }
    return this.cartes().filter(planta =>
      planta.nom.toLowerCase().includes(term)
    );
  });
}
