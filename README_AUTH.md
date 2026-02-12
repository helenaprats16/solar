# Documentació d'Autenticació i Control d'Accés

## Índex
1. [Arquitectura General](#arquitectura-general)
2. [Flux d'Autenticació](#flux-dautenticació)
3. [Servei de Supabase](#servei-de-supabase)
4. [Rutes i Guards](#rutes-i-guards)
5. [Header Reactiu](#header-reactiu)
6. [Home Component](#home-component)
7. [Login i Registre](#login-i-registre)

---

## Arquitectura General

El projecte usa **Angular Standalone Components** amb **Supabase Auth** per gestionar l'autenticació. La lògica es basa en:

1. **Observable Reactiu**: La sessió es guarda en un `BehaviorSubject` que emit canvis en temps real.
2. **Guards**: `canActivate` bloqueja l'accés a rutes si no hi ha sessió.
3. **Componentes Reactius**: Header i Home reaccionen als canvis d'autenticació.

---

## Flux d'Autenticació

### Seqüència d'Accions

```
1. L'usuari accedeix a la web
   ↓
2. Supabase comprova si hi ha sessió guardada al navegador
   ↓
3. Si hi ha sessió:
   - El header mostra links protegits (plantes, mapa)
   - El botó "Tancar sessió" apareix
   - Home mostra "Sessió iniciada"
   ↓
   Si NO hi ha sessió:
   - El header mostra links públics (login, registre)
   - Home mostra "Inicia sessió o registra't"
   ↓
4. Quan l'usuari fa login/registre:
   - Supabase crea la sessió
   - L'observable `session$` notifica a tots els components
   - La UI es renderitza automàticament
   ↓
5. Quan els fa tancar sessió:
   - Supabase elimina la sessió
   - L'observable `session$` notifica
   - Els links protegits desapareixen
```

---

## Servei de Supabase

### Fitxer: `src/app/service/supaservice.ts`

#### 1. Propietats

```typescript
private supabase: SupabaseClient;
private sessionSubject = new BehaviorSubject<Session | null>(null);
session$ = this.sessionSubject.asObservable();
```

**`private supabase: SupabaseClient`**
- **Què és**: Client de Supabase per accedir a la base de dades i autenticació.
- **Funció**: Comunica amb els servidors de Supabase.
- **Paràmetres**: Inicialitzat amb `createClient(url, key)`.

**`private sessionSubject: BehaviorSubject<Session | null>`**
- **Què és**: Observable que guarda l'estat de la sessió actual.
- **Funció**: Permet que altres components s'inscriguin als canvis de sessió.
- **Paràmetres**: 
  - `Session | null`: Pot ser l'objecte de sessió o `null` si no hi ha sessió.
- **Avantatge**: `BehaviorSubject` sempre emet el valor més recent als nous subscritors.

**`session$ = this.sessionSubject.asObservable()`**
- **Què és**: Observable públic que els components poden veure.
- **Funció**: Els components ens fan `.subscribe()` o usen `| async` per rebre canvis.

---

#### 2. Constructor

```typescript
constructor(){
  this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  // Carrega la sessio inicial i escolta canvis
  this.supabase.auth.getSession().then(({ data }) => {
    this.sessionSubject.next(data.session ?? null);
  });

  this.supabase.auth.onAuthStateChange((_event, session) => {
    this.sessionSubject.next(session ?? null);
  });
}
```

**Línia 1**: Crea el client de Supabase.

**Línia 4-6**: `getSession()`
- **Què fa**: Busca si hi ha una sessió guardada al navegador (cookie/localStorage).
- **Retorna**: 
  - `{ data: { session: Session } }` si hi ha sessió.
  - `{ data: { session: null } }` si no hi ha.
- **`.then()`**: Quan obté la resposta, usa `.next()` per notificar el `sessionSubject`.
- **`?? null`**: Si `data.session` és `undefined`, usa `null`.

**Línia 8-10**: `onAuthStateChange()`
- **Què fa**: Escolta **tots els canvis d'autenticació** (login, logout, refresh, etc.).
- **Paràmetres**:
  - `_event`: Tipus de canvi (login, logout, unlock, etc.). No ens interessa aquí.
  - `session`: La nova sessió (o `null` si logout).
- **Funció**: Cada vegada que passa, actualitza el `sessionSubject` per notificar tots els components.

---

#### 3. Mètode `login()`

```typescript
async login(loginData: {email: string, password: string}){
  let { data, error } = await this.supabase.auth.signInWithPassword({
    email: loginData.email,
    password: loginData.password
  })
  if(error){
    console.error("error signin in");
    throw error;
  }
  return data;
}
```

**Paràmetres**:
- `loginData: {email: string, password: string}` = Correu i contrasenya de l'usuari.

**Funció**:
- Crida `supabase.auth.signInWithPassword()` per validar les credencials.
- Si hi ha error, el llança (catch al component).
- Si va bé, retorna les dades de la sessió.

**Nota**: Supabase guarda automàticament la sessió. El `onAuthStateChange()` la detecta.

---

#### 4. Mètode `registre()`

```typescript
async registre(registreData: {email: string, password: string}) {
  let { data, error } = await this.supabase.auth.signUp({
    email: registreData.email,
    password: registreData.password
  });
  if(error){
    throw error;
  }
  return data;
}
```

**Paràmetres**:
- `registreData: {email: string, password: string}` = Correu i contrasenya nova.

**Funció**:
- Crida `supabase.auth.signUp()` per crear un compte nou.
- Si l'usuari ja existeix, retorna error `"User already registered"`.

**Nota**: Si tens "Email Verification" activada a Supabase, l'usuari ha de confirmar l'email abans de poder fer login.

---

#### 5. Mètode `getSession()`

```typescript
async getSession() {
  const { data, error } = await this.supabase.auth.getSession();
  if (error) {
    console.error('error obtenint la sessio');
    return null;
  }
  return data.session;
}
```

**Funció**: Retorna la sessió actual (o `null`).

**Ús**: El guard l'usa per comprovar si l'usuari està autenticat.

---

#### 6. Mètode `signOut()`

```typescript
async signOut() {
  const { error } = await this.supabase.auth.signOut();
  if (error) {
    console.error('error tancant la sessio');
    throw error;
  }
  this.sessionSubject.next(null);
}
```

**Funció**: Tanca la sessió i notifica tots els components.

**Línia 7**: `this.sessionSubject.next(null)` és important:
- Supabase ja ha esborrat la sessió del servidor.
- Però local, necessitem notificar que la sessió és `null`.
- Sense eixa línia, els components no actualitzarien la UI.

---

## Rutes i Guards

### Fitxer: `src/app/guards/auth.guard.ts`

```typescript
export const authGuard: CanActivateFn = async () => {
  const supaservice = inject(Supaservice);
  const router = inject(Router);

  const session = await supaservice.getSession();
  if (session) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
```

#### Paràmetres i Funció

**`authGuard: CanActivateFn`**
- **Tipus**: Una funció que Angular executa **quan intentes accedir a una ruta**.
- **Retorna**:
  - `true`: L'usuari pot entrar a la ruta.
  - `false` o `UrlTree`: L'usuari NO pot entrar i és redirigit.

**`inject(Supaservice)`**
- **Què fa**: Obté una instància del servei de Supabase.
- **Funció**: Accedir als mètodes d'autenticació.

**`inject(Router)`**
- **Què fa**: Obté el router d'Angular.
- **Funció**: Redirigir programàticament (`router.navigateByUrl()`, etc.).

**`await supaservice.getSession()`**
- Espera a obtenir la sessió de Supabase.

**`if (session) return true`**
- Si hi ha sessió, deixa accedir.

**`router.createUrlTree(['/home'])`**
- Retorna una UrlTree que redirigeix a `/home`.
- Angular s'encarrega de fer la redireccio.

### Fitxer: `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
    { path: 'home', component: Home},
    { path: 'plantes', component: PlantesList, canActivate: [authGuard] },
    { path: 'plantes_table', component: PlantesTable, canActivate: [authGuard] },
    { path: 'planta/:id', component: PlantesDetall, canActivate: [authGuard] },
    { path: 'login', component: Login },
    { path: 'registre', component: Registre },
    { path: 'mapa', component: Mapa, canActivate: [authGuard] },
    { path: '**',pathMatch: 'full', redirectTo: 'home'},
];
```

#### `canActivate: [authGuard]`

- **Significat**: "Abans d'entrar en aquesta ruta, executa `authGuard`".
- **Rutes protegides** (amb `canActivate`):
  - `plantes`, `plantes_table`, `planta/:id`, `mapa`
- **Rutes públiques** (sense `canActivate`):
  - `home`, `login`, `registre`

---

## Header Reactiu

### Fitxer: `src/app/components/header/header.ts`

```typescript
export class Header {
  private supaservice = inject(Supaservice);
  isLoggedIn$ = this.supaservice.session$.pipe(map(session => !!session));

  async logout() {
    await this.supaservice.signOut();
  }
}
```

#### Propietats

**`isLoggedIn$`**
- **Què és**: Observable que és `true` si hi ha sessió, `false` si no.
- **Funció**: Indica si l'usuari està autenticat.
- **`.pipe(map())`**: Transforma l'observable `session$` (que és `Session | null`) en un boolean.
- **`!!session`**: Conversió a boolean:
  - Si `session` és un objecte: `!!session` = `true`
  - Si `session` és `null`: `!!session` = `false`

#### Mètode `logout()`
- Crida `supaservice.signOut()` per tancar sessió.
- Els components reactius es renditzaran automàticament quan es notifiqui que `session$` és `null`.

### Fitxer: `src/app/components/header/header.html`

```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" [routerLink]="['/home']">Solar</a>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" [routerLink]="['/home']">Home</a>
        </li>

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
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/login']">Iniciar sessio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/registre']">Registrar-se</a>
          </li>
        }
      </ul>

      <div class="ms-auto">
        @if (isLoggedIn$ | async) {
          <button type="button" class="btn btn-outline-danger" (click)="logout()">Tancar sessio</button>
        }
      </div>
    </div>
  </div>
</nav>
```

#### Estructura

**`@if (isLoggedIn$ | async)`**
- **Què significa**:
  - `isLoggedIn$`: L'observable booleà.
  - `| async`: Pipe d'Angular que **es subscriu** a l'observable i emet el seu valor actual.
  - `@if`: Renderitza el contingut si la condició és `true`.
- **Funció**: Mostra links protegits NOMÉS si l'usuari està logejat.

**`@else`**
- **Funció**: Mostra links d'autenticació si l'usuari NO està logejat.

**`(click)="logout()"`**
- **Significat**: "Quan fas clic, executa la funció `logout()`".

**`[routerLink]="['/home']"`**
- **Significat**: Link reactiu que navega sense recarregar la pàgina.
- `['/home']` = Array amb la ruta. Si hi ha paràmetres: `['/planta', id]`.

---

## Home Component

### Fitxer: `src/app/components/home/home.ts`

```typescript
export class Home {
  private supaservice: Supaservice = inject(Supaservice);
  isLoggedIn$ = this.supaservice.session$.pipe(map(session => !!session));
}
```

**Més simple que el header perquè no té lògica extra, només renderitza segons `isLoggedIn$`.**

### Fitxer: `src/app/components/home/home.html`

```html
<section class="container my-5">
  <div class="text-center mt-3">
    <h1 class="fw-bold">Benvingut/da</h1>

    @if (isLoggedIn$ | async) {
      <p class="lead">Sessio iniciada. Ja pots entrar a les plantes.</p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <a class="btn btn-primary btn-lg" [routerLink]="['/plantes']">Veure plantes</a>
        <a class="btn btn-outline-primary btn-lg" [routerLink]="['/mapa']">Mapa</a>
      </div>
    } @else {
      <p class="lead">Abans de començar, inicia sessio o crea un compte.</p>
      <div class="d-flex justify-content-center gap-3 mt-4">
        <a class="btn btn-primary btn-lg" [routerLink]="['/login']">Iniciar sessio</a>
        <a class="btn btn-outline-primary btn-lg" [routerLink]="['/registre']">Registrar-se</a>
      </div>
    }
  </div>
</section>
```

**Lògica**:
- Si `isLoggedIn$` és `true`: Mostra "Sessió iniciada" i botons per anar a plantes/mapa.
- Si `isLoggedIn$` és `false`: Mostra "Benvingut" i botons per login/registre.

---

## Login i Registre

### Fitxer: `src/app/components/login/login.ts`

```typescript
export class Login {
  supaservice: Supaservice = inject(Supaservice);
  router: Router = inject(Router);
  formulario: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  loguedData: any;
  submitted = false;

  constructor(){
    this.formulario = this.formBuilder.group({
      email:['' ,[Validators.email, Validators.required, ...]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  login(){
    this.submitted = true;
    if (this.formulario.invalid) {
      Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
      return;
    }
    const loginData = this.formulario.value;
    this.supaservice.login(loginData).then(data => {
      console.log(data)
      this.loguedData = data;
      this.router.navigate(['/home']);
    }).catch((error) => {
      console.error(error);
    });
  }
}
```

#### Funció `login()`

**`this.submitted = true`**: Marca que l'usuari ha intentat enviar el formulari.

**`if (this.formulario.invalid)`**: Si els camps no cumpleixen els validators (email, minLength, etc.):
- Marca tots els camps com "tocats" per mostrar errors.
- Retorna (no fa login).

**`this.formulario.value`**: Obté `{email: "...", password: "..."}`.

**`.then(data => ...)`**: Si login va bé:
- Guarda les dades de l'usuari.
- Navega a `/home`.
- El `onAuthStateChange()` detecta la nova sessió automàticament.

**`.catch(error => ...)`**: Si login falla:
- Mostra error.

#### Fitxer: `src/app/components/registre/registre.ts`

```typescript
async registrar() {
  this.submitted = true;
  if (this.formulario.invalid) {
    Object.values(this.formulario.controls).forEach(control => control.markAsTouched());
    return;
  }
  const registreData = this.formulario.value;
  this.supaservice.registre(registreData).then((data) => {
      console.log(data);
      this.registreResult = data;
      window.alert('Usuari creat correctament. Revisa el correu si cal confirmar.');
      this.router.navigate(['/login']);
    })
    .catch((error) => {
      console.error(error);
      if (error?.message === 'User already registered') {
        window.alert("Aquest correu ja esta registrat. Prova d'iniciar sessio.");
        return;
      }
      window.alert('No sha pogut crear el compte. Torna-ho a provar.');
    });
}
```

**Diferències respecte a login**:

- **`window.alert()`**: Mostra missatges al navegador.
- **Error handling**: Detecta `'User already registered'` i mostra un missatge específic.
- **Redireccio**: Va a `/login` perquè l'usuari ha de confirmar l'email (si està activat).

---

## Flux Complet d'Exemple

### Escenari: Un usuari nou

1. **Accedeix a la web**:
   - Supabase executa `getSession()` → No hi ha sessió.
   - `sessionSubject.next(null)`.
   - Header mostra "Iniciar sessió" i "Registrar-se".
   - Home mostra "Benvingut, inicia sessió...".

2. **Fa clic en "Registrar-se"**:
   - Va a `/registre`.

3. **Omple el formulari i fa clic "Registrar"**:
   - `registrar()` valida els camps.
   - Crida `supaservice.registre({email, password})`.
   - Supabase crea el compte.
   - Mostra alert: "Usuari creat correctament".
   - Redirigeix a `/login`.

4. **Fa clic en "Iniciar sessio" (o va a `/login`)**:
   - Omple email i contrasenya.
   - Crida `login()`.
   - Supaservice crida `supabase.auth.signInWithPassword()`.
   - Supabase crea la sessió.
   - `onAuthStateChange()` detecta la nova sessió.
   - `sessionSubject.next(session)` → Notifica tots els components.
   - La UI es renderitza:
     - Header mostra links protegits (plantes, mapa).
     - "Tancar sessió" apareix a la dreta.
     - Home mostra "Sessió iniciada".
   - Redirigeix a `/home`.

5. **Fa clic a "Veure plantes"**:
   - Intenta navegar a `/plantes`.
   - `authGuard` s'executa.
   - `getSession()` retorna la sessió actual.
   - `if (session) return true` → Deixa passar.
   - Es carga `PlantesList`.

6. **Fa clic a "Tancar sessió"**:
   - Executa `logout()`.
   - Supabase esborra la sessió.
   - `sessionSubject.next(null)` → Notifica.
   - La UI es renderitza:
     - Header amaga links protegits.
     - Home mostra "Benvingut, inicia sessió...".

---

## Resum de Conceptes Claus

| Concepte | Significat | Funció |
|----------|-----------|--------|
| **BehaviorSubject** | Observable que guarda l'últim valor. | Permet que els components sàpien sempre l'estat de sessió. |
| **Observable** | Flux de dades que canvia amb el temps. | Els components es subscriuen per rebre actualizacions. |
| **pipe() / map()** | Transforma els valors d'un observable. | Converte `Session \| null` en `boolean`. |
| **async pipe** | `\| async` dins HTML. | Subscriu automàticament i renderitza el component. |
| **canActivate** | Guard que bloqueja l'accés a rutes. | Si no hi ha sessió, redirigeix a `/home`. |
| **@if / @else** | Control de flux en HTML moderna. | Mostra/amaga contingut segons condicions. |
| **[routerLink]** | Binding de navegació reactiva. | Links que no recarreguen la pàgina. |
| **onAuthStateChange()** | Listener de Supabase. | S'executa quan canvia l'estat d'autenticació. |

---

## Arxius Principals

```
src/
├── app/
│   ├── service/
│   │   └── supaservice.ts          ← Lògica d'autenticació
│   ├── guards/
│   │   └── auth.guard.ts           ← Bloqueig de rutes
│   ├── components/
│   │   ├── header/
│   │   │   ├── header.ts           ← Header reactiu
│   │   │   └── header.html         ← Nav amb conditional links
│   │   ├── home/
│   │   │   ├── home.ts             ← Home logic
│   │   │   └── home.html           ← CTA segons sessió
│   │   ├── login/
│   │   │   ├── login.ts            ← Login logic
│   │   │   └── login.html
│   │   └── registre/
│   │       ├── registre.ts         ← Registre logic
│   │       └── registre.html
│   └── app.routes.ts               ← Definició de rutes i guards
```

---

**Preguntes?** Revisa la terminal de navegador (F12) per veure logs de Supabase i Angular.
