import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { Supaservice } from '../../service/supaservice';
import { SearchService } from '../../service/search.service';

/**
 * Header Component: Barra de navegació + búsqueda
 * 
 * RESPONSABILITATS:
 *   1. Mostrar navigation links (condicional si logejat)
 *   2. Capturar input de búsqueda
 *   3. Notificar al SearchService quando user escriu
 *   4. Botó de logout
 * 
 * FLUX:
 *   User escriu en input
 *   → (input)="onSearchChange()" event
 *   → this.searchService.setSearchTerm()
 *   → SearchService.next() notifica
 *   → Plantes-Table/List reben cambios
 */
@Component({
  selector: 'app-header',
  imports: [AsyncPipe, RouterLink, FormsModule],  // FormsModule = necessari per [(ngModel)]
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  
  /**
   * inject(): Angular 17+ forma moderna d'obtenir serveis
   * 
   * Equivalent vell: constructor(private supaservice: Supaservice) {}
   * Avantatge: més concís i flexible
   */
  private supaservice = inject(Supaservice);
  private searchService = inject(SearchService);
  
  /**
   * isLoggedIn$: Observable booleà
   * 
   * FUNCIÓ: Indica si l'usuari està autenticat
   * LÒGICA: session$ map: converteix Session|null → true|false
   * ÚS: En template @if (isLoggedIn$ | async) per mostrar links protegits
   * 
   * Veure README_AUTH.md per detalls d'autenticació
   */
  isLoggedIn$ = this.supaservice.session$.pipe(map(session => !!session));
  
  /**
   * searchTerm: STRING simple (variable local)
   * 
   * FUNCIÓ: Guarda el text que user escriu
   * BINDING: [(ngModel)]="searchTerm" en HTML
   *   - HTML → searchTerm: Quando user escriu
   *   - searchTerm → HTML: Cuando program canvia
   * 
   * DIFERÈNCIA:
   *   searchTerm (aquí) = local variable
   *   searchTerm$ (en SearchService) = observable global
   */
  searchTerm: string = '';

  /**
   * onSearchChange(): Funció que s'executa cuando user escriu
   * 
   * EVENT: (input)="onSearchChange(searchTerm)" en HTML
   * PARÀMETRES: term = valor actual de l'input
   * FUNCIÓ: Envia el término al SearchService (notifica a tots els components)
   * 
   * FLUX:
   *   User escriu 'a'
   *   → (input) event
   *   → onSearchChange('a')
   *   → this.searchService.setSearchTerm('a')
   *   → SearchService.next('a')
   *   → Plantes-Table/List.subscribe() reben 'a'
   *   → Computen filtered = se recalcula
   *   → Template renderitza els resultats
   */
  onSearchChange(term: string): void {
    // Envia el término al servicios global
    this.searchService.setSearchTerm(term);
  }

  /**
   * logout(): Función para tancar la sessió
   * 
   * EVENTO: (click)="logout()" en botó
   * PARÀMETRES: cap
   * FUNÇÃO: Crida Supabase signOut() i neteja sessió
   * 
   * Veure README_AUTH.md per detalls de logout
   */
  async logout() {
    await this.supaservice.signOut();
  }
}
