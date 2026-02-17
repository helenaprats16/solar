# Solar - Gestió de Plantes Renovables

Projecte Angular per a la gestió i visualització de plantes d’energia renovable (solar/eòlica). Permet llistar, consultar detalls i gestionar usuaris amb autenticació Supabase.

## Taula de Continguts
- [Estructura del Projecte](#estructura-del-projecte)
- [Tecnologies Utilitzades](#tecnologies-utilitzades)
- [Components Principals](#components-principals)
- [Serveis](#serveis)
- [Models de Dades](#models-de-dades)
- [Rutes de l’Aplicació](#rutes-de-laplicació)
- [Execució del Projecte](#execució-del-projecte)
- [Autenticació i Control d'Accés](#autenticació-i-control-daccés)
- [Sistema de Cerca i Filtrat](#sistema-de-cerca-i-filtrat)
- [Exemples i Explicacions de Codi](#exemples-i-explicacions-de-codi)
- [Bones Pràctiques i Consells](#bones-pràctiques-i-consells)

---
## Autenticació i Control d'Accés

El projecte utilitza **Supabase Auth** per gestionar l'autenticació d'usuaris. La lògica es basa en:

- **Observable Reactiu**: La sessió es guarda en un `BehaviorSubject` que emet canvis en temps real.
- **Guards**: `canActivate` bloqueja l'accés a rutes si no hi ha sessió.
- **Components Reactius**: Header i Home reaccionen als canvis d'autenticació.

### Flux d'Autenticació
1. L'usuari accedeix a la web i Supabase comprova si hi ha sessió guardada.
2. Si hi ha sessió:
   - El header mostra links protegits (plantes, mapa)
   - El botó "Tancar sessió" apareix
   - Home mostra "Sessió iniciada"
3. Si NO hi ha sessió:
   - El header mostra links públics (login, registre)
   - Home mostra "Inicia sessió o registra't"
4. Quan l'usuari fa login/registre:
   - Supabase crea la sessió
   - L'observable `session$` notifica a tots els components
   - La UI es renderitza automàticament
5. Quan fa tancar sessió:
   - Supabase elimina la sessió
   - L'observable `session$` notifica
   - Els links protegits desapareixen

### Exemple de Servei d'Autenticació (Supaservice)
```typescript
private supabase: SupabaseClient;
private sessionSubject = new BehaviorSubject<Session | null>(null);
session$ = this.sessionSubject.asObservable();

async login(loginData: {email: string, password: string}) {
  let { data, error } = await this.supabase.auth.signInWithPassword(loginData);
  if(error) throw error;
  return data;
}

async registre(registreData: {email: string, password: string}) {
  let { data, error } = await this.supabase.auth.signUp(registreData);
  if(error) throw error;
  return data;
}

async signOut() {
  const { error } = await this.supabase.auth.signOut();
  if (error) throw error;
  this.sessionSubject.next(null);
}
```

### Exemple de Guard
```typescript
export const authGuard: CanActivateFn = async () => {
  const supaservice = inject(Supaservice);
  const router = inject(Router);
  const session = await supaservice.getSession();
  return session ? true : router.createUrlTree(['/home']);
}
```

---

## Sistema de Cerca i Filtrat

El sistema de cerca permet filtrar plantes en temps real des del header. Utilitza un servei global i comunicació reactiva entre components.

### Arquitectura
- **SearchService**: Centralitza el terme de cerca amb un `BehaviorSubject`.
- **Header**: Input de cerca, envia el terme al servei.
- **Plantes-Table/Plantes-List**: S'inscriuen al servei i filtren les dades localment.

### Flux de Cerca
1. L'usuari escriu en l'input del header.
2. Header executa `onSearchChange(term)` i crida `searchService.setSearchTerm(term)`.
3. El servei emet el nou valor a tots els components subscrits.
4. Plantes-Table i Plantes-List filtren les dades segons el terme.

### Exemple de SearchService
```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTerm.asObservable();
  setSearchTerm(term: string): void { this.searchTerm.next(term); }
  getSearchTerm(): string { return this.searchTerm.value; }
}
```

### Exemple d'ús en un component
```typescript
ngOnInit(): void {
  this.searchService.searchTerm$.subscribe(term => {
    this.searchTerm.set(term);
  });
}

plantesFiltered = computed(() => {
  const term = this.searchTerm().toLowerCase();
  return this.plantes().filter(planta =>
    planta.nom.toLowerCase().includes(term)
  );
});
```

---
src/app/
  app.ts                # Componente raíz
  app.routes.ts         # Definición de rutas
  components/           # Componentes visuales (header, home, login, registre)
  plantes/              # Módulo de gestión de plantas (modelos, lista, detalle, tabla)
  service/              # Servicios (conexión a Supabase)
  environments/         # Configuración de entornos


# Solar - Gestió de Plantes Renovables

Projecte Angular per a la gestió i visualització de plantes d’energia renovable (solar/eòlica). Permet llistar, consultar detalls i gestionar usuaris amb autenticació Supabase.

## Taula de Continguts
- [Estructura del Projecte](#estructura-del-projecte)
- [Tecnologies Utilitzades](#tecnologies-utilitzades)
- [Components Principals](#components-principals)
- [Serveis](#serveis)
- [Models de Dades](#models-de-dades)
- [Rutes de l’Aplicació](#rutes-de-laplicació)
- [Execució del Projecte](#execució-del-projecte)
- [Exemples i Explicacions de Codi](#exemples-i-explicacions-de-codi)
- [Bones Pràctiques i Consells](#bones-pràctiques-i-consells)

---

## Estructura del Projecte

```
src/app/
  app.ts                # Component arrel
  app.routes.ts         # Definició de rutes
  components/           # Components visuals (header, home, login, registre)
  plantes/              # Gestió de plantes (models, llista, detall, taula)
  service/              # Serveis (connexió a Supabase)
  environments/         # Configuració d’entorns
```

## Tecnologies Utilitzades
- **Angular**: Framework principal SPA
- **Supabase**: Backend as a Service (autenticació i base de dades)
- **RxJS**: Programació reactiva
- **TypeScript**: Tipatge estàtic

## Components Principals
- **App**: Component arrel, gestiona router i header
- **Header**: Capçalera
- **Home**: Pàgina principal
- **Login**: Formulari d’autenticació
- **Registre**: Formulari de registre
- **PlantesList**: Llista de plantes (targetes)
- **PlantesTable**: Taula de plantes
- **PlantesDetall**: Detall d’una planta
- **PlantesItem / PlantesTableRow**: Subcomponents per a una planta individual

## Serveis
- **Supaservice**: Servei centralitzat per a Supabase (autenticació i dades)

## Models de Dades
- **Planta**: Interfície amb camps: id, nom, ubicació, capacitat, usuari, foto...
- **PLANTES_DEMO**: Array d’exemple per proves

## Rutes de l’Aplicació
- `/home`: Pàgina principal
- `/plantes`: Llista de plantes
- `/plantes_table`: Taula de plantes
- `/planta/:id`: Detall d’una planta
- `/login`: Login d’usuari
- `/registre`: Registre d’usuari
- `**`: Redirecció a home si la ruta no existeix

## Execució del Projecte
1. Instal·la dependències:
   ```bash
   npm install
   ```
2. Executa en mode desenvolupament:
   ```bash
   npm start
   # o
   ng serve -o
   ```
3. Accedeix a `http://localhost:4200`

---

## Exemples i Explicacions de Codi

### Formulari Reactiu (registre)
```typescript
formulario: FormGroup;
formBuilder: FormBuilder = inject(FormBuilder);
```
- `formulario`: representa tot el formulari (FormGroup)
- `formBuilder`: eina per crear i configurar el formulari

### Model Planta
```typescript
export interface Planta {
  id: number;
  nom: string;
  ubicacio: { latitude: number; longitude: number };
  capacitat: number;
  user: string;
  foto?: string;
  created_at?: string;
}
```

### Exemple de ruta
```typescript
{ path: 'planta/:id', component: PlantesDetall }
```

### Exemple d’ús de routerLink
```html
<a [routerLink]="['/planta', carta().id]">Detall</a>
```

---

## Bones Pràctiques i Consells
- Mantén la lògica de negoci als serveis
- Utilitza models i tipatge TypeScript
- Comenta el codi per facilitar el manteniment
- Utilitza assets per a imatges públiques
- Fes servir el router d’Angular per a la navegació
- Valida sempre els formularis

---

## Pendent d’ampliar
- Explicació detallada de cada component, servei i funció
- Exemples avançats d’ús
- Guia de desplegament
- FAQ i resolució d’errors


