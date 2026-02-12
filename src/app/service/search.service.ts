import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * SearchService: Servei central per a compartir el término de búsqueda
 * 
 * QUÉ FA:
 *   - Guarda el término de búsqueda en un BehaviorSubject
 *   - Todos los componentes pueden escuchar los cambios
 *   - Data flow: Header → SearchService → Plantes-Table/List
 * 
 * PER QUÉ AQUÍ:
 *   - Una única font de dada (Single Source of Truth)
 *   - Els components no necessiten comunicar-se directament
 *   - Fàcil de testejar i mantenir
 * 
 * EXEMPLE:
 *   Header (user escriu) → searchService.setSearchTerm('arròs')
 *   → SearchService.next('arròs')
 *   → Plantes-Table/List reben la notificació
 */
@Injectable({
  providedIn: 'root'  // Una única instancia a tota l'app (Singleton)
})
export class SearchService {
  
  /**
   * searchTerm: BehaviorSubject que guarda el término
   * 
   * BehaviorSubject vs Subject:
   *   - BehaviorSubject: SEMPRE emet l'últim valor (millor!)
   *   - Subject: Perd valors anteriors a la subscripció
   * 
   * Inicial: '' (string buida)
   * Tipus: string (el text que busca l'usuari)
   */
  private searchTerm = new BehaviorSubject<string>('');
  
  /**
   * searchTerm$: Observable públic
   * 
   * El $ al final = "és un observable" (conveni)
   * .asObservable() = seguritat (no permet .next() de fora)
   * 
   * Els components fan:
   *   this.searchService.searchTerm$.subscribe(term => { ... })
   */
  searchTerm$ = this.searchTerm.asObservable();

  /**
   * setSearchTerm(): Funció per actualitzar el término
   * 
   * PARÀMETRES: term = el nuevo text
   * FUNCIÓ: Emet el valor a TOTS els subscribers
   * 
   * EXEMPLE:
   *   this.searchService.setSearchTerm('arròs')
   *   → Notifica a Header, Plantes-Table, Plantes-List
   */
  setSearchTerm(term: string): void {
    // .next() = "emet un nuevo valor"
    // Tots els .subscribe() reben aquest valor automàticament
    this.searchTerm.next(term);
  }

  /**
   * getSearchTerm(): Obté el término actual
   * 
   * FUNCIÓ: Lectura directa (sin suscripció)
   * .value = valor actual del BehaviorSubject
   * 
   * RÀRAMENT USAT (millor usar .subscribe())
   */
  getSearchTerm(): string {
    return this.searchTerm.value;
  }
}
