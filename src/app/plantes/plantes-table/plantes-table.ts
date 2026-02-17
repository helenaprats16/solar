import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { SearchService } from '../../service/search.service';
import { Supaservice } from '../../service/supaservice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plantes-table',
  imports: [CommonModule],
  templateUrl: './plantes-table.html',
  styleUrl: './plantes-table.css',
})
export class PlantesTable implements OnInit {
  private searchService = inject(SearchService);
  private supaservice = inject(Supaservice);

  // Signals de la taula
  plantes = signal<Planta[]>(PLANTES_DEMO);
  searchTerm = signal<string>('');
  plantaEditada = signal<Planta | null>(null);

  // Formulari com a signal
  formulario = signal({
    nom: '',
    capacitat: '',
    user: '',
    ubicacio: {
      latitude: '',
      longitude: '',
    },
    // afegeix més camps si cal
  });

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe((term) => {
      this.searchTerm.set(term);
    });
  }

  // Plantes filtrades per nom
  plantesFiltered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.plantes();
    }
    return this.plantes().filter((planta) => planta.nom.toLowerCase().includes(term));
  });

  editarPlanta(planta: Planta) {
    this.formulario.set({
      nom: planta.nom,
      capacitat: planta.capacitat.toString(),
      user: planta.user,
      ubicacio: {
        latitude: planta.ubicacio.latitude.toString(),
        longitude: planta.ubicacio.longitude.toString(),
      },
    });
    this.plantaEditada.set(planta); // Aquesta línia és clau!
  }

  async guardar() {
    const form = this.formulario();
    const editada = this.plantaEditada();

    if (editada) {
      await this.supaservice.updatePlanta(editada.id, {
        nom: form.nom,
        capacitat: Number(form.capacitat),
        user: form.user,
        ubicacio: {
           latitude: Number(form.ubicacio.latitude),
          longitude: Number(form.ubicacio.longitude),
        }
       
      });
      // Actualitza l'array local si vols
      // Neteja formulari i plantaEditada
      this.formulario.set({
        nom: '',
        capacitat: '',
        user: '',
        ubicacio: { latitude: '', longitude: '' },
      });
      this.plantaEditada.set(null);
    }
  }
  async eliminarPlanta(planta: Planta) {
    await this.supaservice.deletePlanta(planta.id);
    // Actualitza l'array local si vols
  }
}
