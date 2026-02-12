# 📋 DOCUMENTACIÓ DEL SISTEMA DE BÚSQUEDA 🔍

## Índex
1. [Concepte General](#concepte-general)
2. [Architectural](#architectural)
3. [Flux de Búsqueda](#flux-de-búsqueda)
4. [Fitxers i Codi](#fitxers-i-codi)
5. [Com Funciona Realment](#com-funciona-realment)
6. [Resum i Comparació](#resum-i-comparació)

---

## Concepte General

### Què és?

Un **sistema reactiu de filtratge de plantes** on:
- L'usuari escriu en un input de búsqueda (al **header**).
- Els resultats es filtren **automàticament** (sin botó, real-time).
- Els components de plantes (**taula i cartes**) mostren només les que coincideixen amb el nom.

### Diagrama Visual

```
┌─────────────────────────────────────────────┐
│         HEADER (BARRA DE NAVEGACIÓ)         │
│                                             │
│  [Links] ... [Input: "Arròs"] [Botó Search]│
│                    ↓                        │
│     Envia terme de búsqueda "Arròs"        │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
┌──────────────────┐  ┌──────────────────┐
│  PLANTES-TABLE   │  │  PLANTES-LIST    │
│  (Taula)         │  │  (Cartes visuals)│
│                  │  │                  │
│ Filtra per "Arròs"│ Filtra per "Arròs" │
│ Mostra 2 files  │  │ Mostra 2 cartes  │
└──────────────────┘  └──────────────────┘
```

---

## Architectural

### Els 3 Components Principals

```
SearchService (centre de distribució)
       ↑ ↓
       │
   Header (entrada de dades)
       │
       ├→ Plantes-Table (filtra i renderitza)
       └→ Plantes-List (filtra i renderitza)
```

### Com es Comuniquen

```
┌─────────────┐
│   Header    │  User escriu "Tomàquet"
│  component  │
│             │
│  searchTerm │  Variable STRING que guarda el text
└──────┬──────┘
       │
       │ onSearchChange(searchTerm)
       │ (funció quan escribes)
       ↓
┌──────────────────────────────────┐
│  SearchService (serveis global)  │
│                                  │
│  searchTerm$ = BehaviorSubject   │
│  (emet el valor més recent)      │
└──────┬───────────────────────────┘
       │
       ├─→ Plantes-Table
       │   ngOnInit()
       │   S'inscriu: searchService.searchTerm$.subscribe(...)
       │   Rep: "Tomàquet"
       │   computed(): filtra dades local
       │   Template: mostra només els que coincideixen
       │
       └─→ Plantes-List
           ngOnInit()
           S'inscriu: searchService.searchTerm$.subscribe(...)
           Rep: "Tomàquet"
           computed(): filtra dades local
           Template: mostra només els que coincideixen
```

---

## Flux de Búsqueda

### Pas a Pas

#### 1. **User escriu en l'input (Header)**

```
Input HTML: 
  [(ngModel)]="searchTerm"           ← Two-way binding
  (input)="onSearchChange(searchTerm)" ← Quan escribes qualquier lletra
```

#### 2. **Header executa `onSearchChange()`**

```typescript
onSearchChange(term: string): void {
  this.searchService.setSearchTerm(term);  // Envia el text al servei global
}
```

#### 3. **SearchService emet el terme a TOTS els subscribers**

```typescript
setSearchTerm(term: string): void {
  this.searchTerm.next(term);  // BehaviorSubject notifica a tots
}
```

#### 4. **Plantes-Table i Plantes-List reben la notificació**

```typescript
ngOnInit(): void {
  // S'inscriu al SearchService per rebre canvis
  this.searchService.searchTerm$.subscribe(term => {
    this.searchTerm.set(term);  // Actualitza el signal local
  });
}
// Automàticament, computed() es recalcula
```

#### 5. **Signal actualitzat → Computed es recalcula**

```typescript
// Quan searchTerm canvia, computed() s'executa automàticament
plantesFiltered = computed(() => {
  const term = this.searchTerm().toLowerCase();
  
  // Retorna NOMÉS les plantes que coincideixen
  return this.plantes().filter(planta =>
    planta.nom.toLowerCase().includes(term)
  );
});
```

#### 6. **Template renderitza el resultat**

```html
@for(planta of plantesFiltered(); track planta.id){
  <!-- Mostra només les plantes que passen el filtre -->
  <tr app-plantes-table-row [plantaId]="planta"></tr>
}
```

---

## Fitxers i Codi

### 1. `src/app/service/search.service.ts`

**Funció**: Servei global que centralitza la búsqueda.

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// @Injectable: Angular pot injectar aquest servei dins altres components
// providedIn: 'root' = Una única instancia a tot l'app (Singleton Pattern)
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  // BehaviorSubject<string>: 
  //   - Observable que SEMPRE emet l'últim valor
  //   - Inicialment: '' (string buida)
  //   - Cada vegada que algu crida .next(), tothom que s'ha subscrit rep el valor
  private searchTerm = new BehaviorSubject<string>('');
  
  // searchTerm$ (el $ significa "és un observable"):
  //   - Versió pública de searchTerm
  //   - Les components poden fer .subscribe() aquí
  //   - .asObservable() = no permet fer .next() de fora (encapsulació)
  searchTerm$ = this.searchTerm.asObservable();

  // FUNCIÓ: setSearchTerm()
  // ENTRADA: term = new search text from user
  // SORTIDA: notifica a tots els que escolten
  setSearchTerm(term: string): void {
    this.searchTerm.next(term);  // .next() = "emet un nou valor"
  }

  // FUNCIÓ: getSearchTerm() (poc usada, pero útil per obtenir el valor actual)
  getSearchTerm(): string {
    return this.searchTerm.value;
  }
}
```

#### Conceptes Claus

**`@Injectable`**:
- Angular detecta aquest símbol = "puc injectar-lo en altres componente"
- Sin ell, Angualr no sabria que és un servei

**`providedIn: 'root'`**:
- "Crea una única instancia en tota l'app"
- Tots els components que el injecten reben la MATEIXA instancia
- Patern: Singleton

**`BehaviorSubject<string>`**:
- Observable que sempre emet l'últim valor
- Quan algú nou s'hi subscriu, rep automàticament l'últim valor emès
- `Subject` normal: NO emet valors anteriors a la subscripció
- Ús: Perfecte per a dades que varios components necessiten saber en temps real

**`.next()`**:
- "Emet un nou valor a tots els subscribers"
- Tots els que han fet `.subscribe()` reben el valor

**`.asObservable()`**:
- Conversió: BehaviorSubject → Observable (més segur)
- Els consumers no poden fer `.next()` directament
- Només el servei (privat) pot emetre valors

---

### 2. `src/app/components/header/header.ts`

**Funció**: Captura input de búsqueda i l'envia al servei global.

```typescript
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';  // ← Necessari per [(ngModel)]
import { map } from 'rxjs';
import { Supaservice } from '../../service/supaservice';
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  
  // inject(): Angular 17+ forma moderna d'obtenir serveis
  // Equivalent: constructor(private searchService: SearchService) { }
  private supaservice = inject(Supaservice);
  private searchService = inject(SearchService);
  
  // Observable booleà: true si logejat, false si no
  // Veure README_AUTH.md per detalls
  isLoggedIn$ = this.supaservice.session$.pipe(map(session => !!session));
  
  // STRING simple que guarda el text de l'input
  // Binding bidireccional amb [(ngModel)] en HTML
  //   - Quan user escriu → searchTerm s'actualitza
  //   - Quan searchTerm canvia per programa → input mostra el nuevo value
  searchTerm: string = '';

  // FUNCIÓ: onSearchChange()
  // QUAN: Cada vegada que user escriu en l'input (event "input")
  // PARÀMETRES: term = el text actual de l'input
  // FUNCIÓ: Envia el terme al SearchService (que notificarà a tots els components)
  onSearchChange(term: string): void {
    // Crida el servei per notificar a plantes-table i plantes-list
    this.searchService.setSearchTerm(term);
  }

  // FUNCIÓ: logout()
  // PARÀMETRES: cap
  // FUNCIÓ: Tanca la sessió Supabase
  async logout() {
    await this.supaservice.signOut();
  }
}
```

#### Punts Claus

**`[(ngModel)]="searchTerm"`** (Two-way binding):
- `[ngModel]` = Component → HTML (if searchTerm changes in code, input updates)
- `(ngModelChange)` = HTML → Component (if user types, searchTerm updates)
- `[(ngModel)]` = AMBDÓS (bidireccional)
- Exemple:
  ```
  searchTerm = "a" (en code)
  → HTML input shows "a"
  
  User escriu "b"
  → searchTerm = "ab" (en code)
  ```

**`(input)="onSearchChange(searchTerm)"`**:
- Event HTML: s'executa cada vegada que l'input CANVIA
- `input` event = en temps real (no necessita "Enter" o botó)
- Altres opcions: `(keyup)` (més lent), `(change)` (quan es blur)

**`inject()`**:
- Angular 17+ forma moderna
- Equivalent a constructor dependency injection
- Avantatge: més concís, més flexible

**`async`**:
- `.subscribe()` dins template de forma implícita
- Retorna el valor actual del observable

---

### 3. `src/app/components/header/header.html`

**Funció**: Template que mostra barra de navegació + input de búsqueda.

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    
    <!-- Logo / Brand (clicable al home) -->
    <a class="navbar-brand" [routerLink]="['/home']">Solar</a>

    <!-- Menú toggle per als mòbils -->
    <button class="navbar-toggler" type="button" ...>
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Contingut collapsible de la navbar -->
    <div class="collapse navbar-collapse" id="navbarNav">
      
      <!-- Links de navegació a l'esquerra -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" [routerLink]="['/home']">Home</a>
        </li>

        <!-- Links que només apareixen si l'usuari està logejat -->
        @if (isLoggedIn$ | async) {
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/plantes']">Detalls plantes</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/plantes_table']">Taula plantes</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/mapa']">Mapa</a>
          </li>
        } @else {
          <!-- Links si NO està logejat -->
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/login']">Iniciar sessio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/registre']">Registrar-se</a>
          </li>
        }
      </ul>

      <!-- BÚSQUEDA + LOGOUT a la dreta -->
      <div class="ms-auto d-flex gap-2 align-items-center">
        
        <!-- INPUT DE BÚSQUEDA -->
        <input 
          class="form-control form-control-sm"  <!-- Bootstrap estils: control de formulari, tamay petit -->
          type="search"                          <!-- HTML5: input de búsqueda -->
          placeholder="Buscar per nom..."         <!-- Text quan està buit -->
          aria-label="Search"                    <!-- Accessibility: etiqueta per a screen readers -->
          [(ngModel)]="searchTerm"               <!-- Two-way binding amb component.ts -->
          (input)="onSearchChange(searchTerm)"   <!-- Event: crida funció cada lletra -->
          name="search"                          <!-- Required per [(ngModel)] -->
          style="width: 180px;"                  <!-- Ancho fixa en píxels -->
        >

        <!-- BOTÓ DE BÚSQUEDA (decoratiu, sin funcionalitat extra) -->
        <button class="btn btn-outline-success btn-sm" type="submit">
          Search
        </button>

        <!-- BOTÓ DE LOGOUT (només si està logejat) -->
        @if (isLoggedIn$ | async) {
          <button 
            type="button" 
            class="btn btn-outline-danger btn-sm"  <!-- Bootstrap: button outline roig -->
            (click)="logout()"                     <!-- Event: crida funció logout() -->
          >
            Tancar sessio
          </button>
        }

      </div>

    </div>
  </div>
</nav>
```

#### CSS Bootstrap Classes Explicades

| Class | Significat |
|-------|-----------|
| `navbar` | Contenidor de la barra de navegació |
| `navbar-expand-lg` | Expandeix-se (mostra els liens) en pantalla large, collapse en mobile |
| `navbar-light` | Color clar (fons blanc, text negre) |
| `bg-light` | Background clar |
| `container-fluid` | 100% d'amplada |
| `navbar-brand` | Logo/marca |
| `nav-item` | Element dintre `<ul class="navbar-nav">` |
| `nav-link` | Link dintre `nav-item` |
| `form-control` | Input de formulari estilat |
| `form-control-sm` | Input PEQUENyet |
| `btn` | Base per a buttons |
| `btn-outline-success` | Button verd outline (NO ple) |
| `btn-outline-danger` | Button roig outline |
| `btn-sm` | Button PEQUENyet |
| `ms-auto` | Margin-start: auto (push a la dreta) |
| `d-flex` | Display: flex (fila hoirizontal) |
| `gap-2` | Espai entre elements flexbox (8px) |
| `align-items-center` | Align verticalment al center |

#### HTML/Angular Explicat

**`[(ngModel)]="searchTerm"`**:
- Two-way binding bidireccional
- HTML ↔ Component
- Funció: mantenir sincronitzat l'input amb la variable

**`(input)="onSearchChange(searchTerm)"`**:
- Event HTML "input" (cada vegada que cambia el value)
- Crida la funció `onSearchChange()`
- Paràmetres: `searchTerm` actual

**`name="search"`**:
- Atribut required per a `[(ngModel)]`
- Identifica el control en formularis

**`type="search"`**:
- HTML5 input type
- Addiciona una "X" pels esborrar el text (depenent el navegador)

**`[routerLink]="['/home']"`**:
- Property binding
- Array avec la ruta
- Sin recarrega de pàgina (SPA navigation)

**`@if (isLoggedIn$ | async)`**:
- Renderitza NOMÉS si la condició és true
- `isLoggedIn$` = observable booleà
- `| async` = subscriu automàticament i emet el valor

---

### 4. `src/app/plantes/plantes-table/plantes-table.ts`

**Funció**: Renderitza una taula de plantes filtrada per búsqueda.

```typescript
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PLANTES_DEMO } from '../plantes_demo';
import { Planta } from '../planta';
import { PlantesTableRow } from "../plantes-table-row/plantes-table-row";
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-plantes-table',
  imports: [PlantesTableRow],
  templateUrl: './plantes-table.html',
  styleUrl: './plantes-table.css',
})
export class PlantesTable implements OnInit {
  
  // inject(): Obté accés al servei global de búsqueda
  private searchService = inject(SearchService);
  
  // SIGNAL: Array estàtic de dades
  // signal<Planta[]>() = Observable local (no necessita suscripció)
  // PLANTES_DEMO = import de dummy data (array de plantes)
  // Nota: En una app real, aquí vendria del servei (dades remotas de DB)
  plantes = signal<Planta[]>(PLANTES_DEMO);
  
  // SIGNAL: Termo de búsqueda actual
  // Inicialment: '' (string buida)
  // S'actualitzarà quan el header emet un valor (via SearchService)
  searchTerm = signal<string>('');

  // ngOnInit(): Hook que s'executa QUAN ES CARGA EL COMPONENT
  // Angular lifecycle:
  //   constructor() → es crea l'instancia
  //   ngOnInit() → Angular ha inicialitzat les propietats
  //   Template → es renderitza
  // Funció: Subscripció al SearchService per rebre canvis de búsqueda
  ngOnInit(): void {
    // .subscribe(callback): "Escolta els canvis de searchTerm$"
    // Cada vegada que SearchService fa .next(newTerm)
    // Aquesta arrow function s'executa amb el nuevo terme
    this.searchService.searchTerm$.subscribe(term => {
      // .set(): Actualitza el signal local
      // Això AUTOMÀTICAMENT farà que computed() es recalculi
      this.searchTerm.set(term);
    });
  }

  // COMPUTED: Derived value (depén de signals)
  // Quan aquesta funció s'executa:
  //   1. Agafa el valor actual de searchTerm()
  //   2. Filtra l'array de plantes
  //   3. Retorna el resultat
  // Angular detecta dependencies: si searchTerm canvia → recalcula
  // Memoization: si searchTerm no ha canviat → usa el resultado cached
  plantesFiltered = computed(() => {
    // Obté el valor actual del signal searchTerm
    // () = per a signals (similar a .value per a BehaviorSubject)
    const term = this.searchTerm().toLowerCase();  // "arròs" (minúscules)
    
    // Si el terme és buit (''), mostra TOTES les plantes
    if (!term) {
      return this.plantes();
    }
    
    // .filter(callback): JavaScript array method
    // Retorna un novo array NOMÉS amb elements que cumpleixen la condició
    // Iteració: per cada planta dins l'array
    return this.plantes().filter(planta =>
      // .toLowerCase(): converteix a minúscules
      // .includes(searchString): true si el string conté el substring
      // Exemple:
      //   planta.nom = "Arròs Blanca"
      //   term = "arròs"
      //   "arròs blanca".includes("arròs") = TRUE ✓ planta inclosa
      planta.nom.toLowerCase().includes(term)
    );
  });
}
```

#### Conceptes Claus

**`ngOnInit()`**:
```
Cicle de vida d'un component:
1. constructor() → Crea l'instancia, injecta serveis
2. ngOnInit() → Angular ha acabat de configurar el component
                 BON lloc per a:
                 - HTTP requests
                 - Observable subscriptions
                 - Inicialitzacions complexes
3. Template render → Es mostra al DOM
4. ngAfterViewInit() → Después que el template es render
5. ngOnDestroy() → Quan es destrueix el component (cleanup)
```

**`signal<Planta[]>()`**:
- Valor reactiu local del component
- Diferència observable:
  - Signal: ràpid, synchronos, sin suscripció
  - Observable: asincron, millor per dades remotes

**`computed()`**:
```
Derived value = propietat que depén d'altres signals

Exemple mental:
  x = 5
  y = x * 2  // Cada vegada que x canvia, y se recalcula

Angular signals:
  searchTerm = signal('ar')
  plantesFiltered = computed(() => {
    // Depén de searchTerm
    // Si searchTerm canvia → recalcula automàticament
    return filtra(searchTerm)
  })
```

**`.filter()` i `.includes()`**:
```typescript
// .filter(): Retorna novo array
[1, 2, 3, 4].filter(n => n > 2)  // [3, 4]

// .includes(): Boolean
"arròs blanca".includes("arròs")  // true
"arròs blanca".includes("tomate") // false

// Combinat:
plantes.filter(p => p.nom.toLowerCase().includes(term))
// Retorna: només les plantes que el nom conté el terme
```

---

### 5. `src/app/plantes/plantes-table/plantes-table.html`

**Funció**: Renderitza la taula HTML amb dades filtrades.

```html
<!-- TABLE elemento HTML -->
<table class="table table-striped">
  
  <!-- THEAD: Cap de la taula -->
  <thead>
    <tr>
      <th scope="col">Nom</th>
      <th scope="col">Ubicacio</th>
      <th scope="col">User</th>
      <th scope="col">Capacitat</th>
    </tr>
  </thead>

  <!-- TBODY: Cos de la taula (dades) -->
  <tbody>
    
    <!-- @if: Renderitza condicionalment -->
    <!-- sintaxi angular moderna (>= 17) -->
    @if (plantesFiltered().length > 0) {
      
      <!-- @for: Itera sobre dades -->
      <!-- @for(item of array; track uniqueKey) -->
      <!-- plantesFiltered(): Crida la funció computed() per obtenir l'array filtrat -->
      <!-- track planta.id: Clau única per Angular (millora rendimiento) -->
      @for(planta of plantesFiltered(); track planta.id){
        
        <!-- <tr>: Table row (fila de taula) -->
        <!-- [plantaId]: Property binding (passem l'object planta al component fill) -->
        <tr app-plantes-table-row [plantaId]="planta"></tr>

      }
    
    } @else {
      <!-- Renderitza si NO hi ha resultats -->
      <tr>
        <td colspan="4" class="text-center text-muted">
          No s'ha trovada cap planta
        </td>
      </tr>
    }

  </tbody>
</table>
```

#### Angular Control Flow

**`@if ... @else`** (modern Angular >= 17):
```html
@if (condicio) {
  <!-- Renderitza si true -->
} @else {
  <!-- Renderitza si false -->
}
```
- Equivalent vell: `*ngIf ... *ngIf else`
- Nou és més llegible i performant

**`@for`** (modern Angular >= 17):
```html
@for(item of array; track id_unica) {
  <!-- Renderitza per cada item -->
}
```
- Equivalent vell: `*ngFor`
- `track`: clau per a diffing (Angular sap quins items cambiaren)
- Sense `track`: Angular recreará TOTS els ítems (lent)

**`plantesFiltered()`**:
- Crida la funció `computed()` per obtenir l'array filtrat
- Angular usa `()` per a signals i funcions
- Cada vegada que `searchTerm` canvia → `computed()` es recalcula

**`[plantaId]="planta"`**:
- Property binding: passel l'object `planta` a la propietat `@Input() plantaId` del component fill
- Component fill (`PlantesTableRow`) rebre el object planta y pot renderitza-la

---

### 6. `src/app/plantes/plantes-list/plantes-list.ts`

**Funció**: Renderitza cartes visuals de plantes filtrades (similar a plantes-table, pero més visual).

```typescript
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
  
  // Obté accés al servei de búsqueda global
  private searchService = inject(SearchService);
  
  // Dades estàtiques (array de plantes)
  cartes = signal<Planta[]>(PLANTES_DEMO);
  
  // Termo de búsqueda que es sincronitza amb header
  // S'actualitza via SearchService
  searchTerm = signal<string>('');

  // Escolta els canvis del SearchService
  ngOnInit(): void {
    // S'inscriu per rebre valors del header
    this.searchService.searchTerm$.subscribe(term => {
      // Actualitza el signal local
      this.searchTerm.set(term);
    });
  }

  // Filtra per nom (igual que plantes-table)
  // Depén de searchTerm: si canvia → recalcula
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
```

**Nota**: Idèntic a `plantes-table.ts`, pero amb nom diferent (`cartes` instead of `plantes`) i renderitza com cartes instead de taula.

---

### 7. `src/app/plantes/plantes-list/plantes-list.html`

```html
<!-- Contenidor de cartes visuals -->
<div class="cards-container">
  
  <!-- Si hi ha resultats -->
  @if (cartesFiltered().length > 0) {
    
    <!-- Renderitza una carta per cada planta -->
    @for(carta of cartesFiltered(); track carta.id){
      <!-- Component custom que renderitza una carta visual -->
      <app-plantes-item [plantaId]="carta"></app-plantes-item>
    }
  
  } @else {
    
    <!-- Si la búsqueda no té resultats -->
    <div class="alert alert-info w-100">
      No s'ha trovada cap planta
    </div>
  }

</div>
```

**Similar a `plantes-table.html`, pero mostra cartes en lloc de taula.**

---

## Com Funciona Realment

### Exemple Complet Pas a Pas

#### Escenari: User busca "arròs"

**TIME 0s: App es carrega, user navega a /plantes_table**

```
Angular initialization:
1. Header component es crea
   - searchTerm = '' (empty)
   - searchService està injectatt

2. Plantes-table component es crea
   - plantes = [Arròs, Tomate, Tomàquet, Arant]
   - searchTerm = '' (empty)
   - plantesFiltered = [Arròs, Tomate, Tomàquet, Arant] (tots)

3. ngOnInit() s'executa
   - subscribe() al SearchService
   - "Si algú emet, me lo diga"

4. Template renders
   - @for mostra 4 files (tots els plantes)
```

**TIME 1s: User escriu "a" en l'input**

```
Event a HTML:
  <input (input)="onSearchChange('a')">

Header.onSearchChange('a'):
  this.searchService.setSearchTerm('a')

SearchService.setSearchTerm('a'):
  this.searchTerm.next('a')  // BehaviorSubject emet 'a'

Plantes-table.subscribe():
  Rep 'a'
  this.searchTerm.set('a')  // Actualitza el signal
  
Computed() s'executa:
  term = 'a'.toLowerCase() = 'a'
  plantes.filter(p => p.nom.toLowerCase().includes('a'))
  
  Arròs → "arròs".includes("a") = TRUE ✓
  Tomate → "tomate".includes("a") = TRUE ✓
  Tomàquet → "tomàquet".includes("a") = FALSE ✗
  Arant → "arant".includes("a") = TRUE ✓
  
  plantesFiltered = [Arròs, Tomate, Arant]

Template ens ren deritza:
  @for mostra 3 files
```

**TIME 2s: User afegeix "rròs" (escriu "arròs")**

```
Header.onSearchChange('arròs'):
  this.searchService.setSearchTerm('arròs')

SearchService.setSearchTerm('arròs'):
  this.searchTerm.next('arròs')

Plantes-table.subscribe():
  Rep 'arròs'
  this.searchTerm.set('arròs')

Computed() s'executa:
  term = 'arròs'
  plantes.filter(p => p.nom.toLowerCase().includes('arròs'))
  
  Arròs → "arròs".includes("arròs") = TRUE ✓
  Tomate → "tomate".includes("arròs") = FALSE ✗
  Tomàquet → "tomàquet".includes("arròs") = FALSE ✗
  Arant → "arant".includes("arròs") = FALSE ✗
  
  plantesFiltered = [Arròs]

Template renderitza:
  @for mostra 1 fila
  
Plantes-list (si estás nella mateixa pàgina):
  Rebi 'arròs' via SearchService
  cartesFiltered = [Arròs]
  Mostra 1 carta
```

**TIME 3s: User neteja l'input (borra tot)**

```
Header.onSearchChange(''):
  this.searchService.setSearchTerm('')

Plantes-table.subscribe():
  Rep ''
  this.searchTerm.set('')

Computed() s'executa:
  term = ''
  if (!term) return this.plantes()  // TRUE!
  
  plantesFiltered = [Arròs, Tomate, Tomàquet, Arant]

Template renderitza:
  @for mostra 4 files (novament tots)
```

### Timeline Visual

```
Input text:     ""        →   "a"      →   "ar"    →   "arròs"   →   ""
                                                                        
plantesFiltered 4 items   →   3 items  →   2 items →   1 item    →   4 items
(Arròs,         (Arròs,      (Arròs,   →   (Arròs)    (tots novament)
Tomate,         Tomate,      Tomate,
Tomàquet,       Arant)       Arant)
Arant)
```

---

## Resum i Comparació

### Conceptes Claus

| Concepte | Significat | Ús |
|----------|-----------|-----|
| **BehaviorSubject** | Observable que emet l'últim valor | Compartir dades entre components (SearchService) |
| **Observable** | Flux de dades que canvia | Subscriber-based (event-driven) |
| **Signal** | Valor reactiu local | Estado-component local (més ràpid) |
| **Computed** | Valor derivat de signals | Filtratge, transformacions locals |
| **subscribe()** | "Escolta els canvis" | Observable → signal |
| **@if / @else** | Control de flux en template | Renderitzar condicionalment |
| **@for** | Iterar sobre array | Renderitzar llistes |
| **[property]** | Property binding | Passel dades component fill |
| **(event)** | Event binding | Capturar eventos HTML |
| **[(ngModel)]** | Two-way binding | Formularis |

### Per Què Aquí Arquitectura?

| Capa | Responsabilitat |
|------|-----------------|
| **SearchService** | Centralitza la búsqueda (BehaviorSubject global) |
| **Header** | Captura input i envia al servei |
| **Plantes-Table** | Escolta SearchService, filtra localment, renderitza taula |
| **Plantes-List** | Escolta SearchService, filtra localment, renderitza cartes |

### Flux Resumit

```
Header (input) 
   ↓ (onSearchChange)
SearchService (.next)
   ↓ (observable)
Plantes-Table (subscribe)
   ↓ (signal.set)
Computed (recalcula)
   ↓ (plantesFiltered)
Template (@for)
   ↓
Render HTML
```

---

## Problemes Comuns i Solucions

### ❌ "La búsqueda no funciona"

**Causa 1**: FormsModule no importat
```typescript
// ✗ INCORRECTE
imports: [PlantesTableRow]

// ✓ CORRECTE (per a header.ts)
imports: [AsyncPipe, RouterLink, FormsModule]
```

**Causa 2**: SearchService no injectada
```typescript
// ✗ INCORRECTE
export class Header {
  // ...
}

// ✓ CORRECTE
export class Header {
  private searchService = inject(SearchService);
}
```

**Causa 3**: ngOnInit no implementat
```typescript
// ✗ INCORRECTE
export class PlantesTable {
  ngOnInit(): void { ... }  // No funcionará!
}

// ✓ CORRECTE
export class PlantesTable implements OnInit {
  ngOnInit(): void { ... }
}
```

### ❌ "Tots els components veuen la mateixa búsqueda"

**Causa**: SearchService és Singleton (`providedIn: 'root'`)

**Solució**: Eso és CORRECTE (és la intenció). Si vols búsquedes independents:
- Mou la lògica de filtratge a cada component (local)
- No uses SearchService global

### ❌ "Filtre no funciona per a majúscules/minúscules"

**Causa**: No convertis a lowercase

```typescript
// ✗ INCORRECTE
p.nom.includes(term)  // "Arròs".includes("arròs") = false

// ✓ CORRECTE
p.nom.toLowerCase().includes(term.toLowerCase())
// "arròs".includes("arròs") = true
```

---

## Conclusió

El **sistema de búsqueda** és:
- **Global**: Usa `SearchService` per a compartir entre components
- **Reactiu**: Observable `BehaviorSubject` emet canvis automàticament
- **Eficient**: Signals i computed per a filtratge local
- **Modern**: Control flow `@if` i `@for` de Angular 17+

**Flux simple**:
```
User escriu → Header → SearchService → Subscribers → Filter → Render
```

**Arxius principals**:
- `search.service.ts` — Llògica central
- `header.ts / header.html` — Entrada de dades
- `plantes-table.ts / plantes-table.html` — Taula filtrada
- `plantes-list.ts / plantes-list.html` — Cartes filtrades

---

**Dubtes?** Revisa els comentaris al codi o demana ajuda!
