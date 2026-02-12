import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { SearchService } from '../../service/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plantes-table',
  imports: [CommonModule],
  templateUrl: './plantes-table.html',
  styleUrl: './plantes-table.css',
})
export class PlantesTable implements OnInit {
  private searchService = inject(SearchService);
  
  // Signals de la taula
  plantes = signal<Planta[]>(PLANTES_DEMO);
  searchTerm = signal<string>('');

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm.set(term);
    });
  }

  // Plantes filtrades per nom
  plantesFiltered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.plantes();
    }
    return this.plantes().filter(planta =>
      planta.nom.toLowerCase().includes(term)
    );
  });
}

