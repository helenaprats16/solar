## Explicació de la creació del formulari reactiu

En el component de registre, trobaràs aquestes dues línies claus:

```typescript
formulario: FormGroup;
formBuilder: FormBuilder = inject(FormBuilder);
```

- **formulario: FormGroup;**
   - Açò és una variable que guarda tot el formulari. Un `FormGroup` és com una "caixa" on poses tots els camps del formulari (per exemple, email i password). Així Angular pot controlar i validar tot el formulari junt.

- **formBuilder: FormBuilder = inject(FormBuilder);**
   - `FormBuilder` és una eina d’Angular que serveix per crear formularis de manera fàcil i ràpida.
   - Amb `inject(FormBuilder)` li diem a Angular que ens done una “còpia” d’aquesta eina per poder usar-la dins del component.
   - Així, després pots fer `this.formBuilder.group({...})` per crear el formulari i posar-li les regles de validació.

**Resumint:**
- `formulario` = el teu formulari complet (amb tots els camps).
- `formBuilder` = l’eina que t’ajuda a crear i configurar el formulari d’una manera senzilla.

# Solar - Gestión de Plantas Renovables

Este proyecto es una aplicación web desarrollada en Angular para la gestión y visualización de plantas de energía renovable (solar y eólica). Permite listar, consultar detalles y gestionar usuarios mediante autenticación con Supabase.

## Tabla de Contenidos
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Componentes Principales](#componentes-principales)
- [Servicios](#servicios)
- [Modelos de Datos](#modelos-de-datos)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)

---

## Estructura del Proyecto

```
src/app/
  app.ts                # Componente raíz
  app.routes.ts         # Definición de rutas
  components/           # Componentes visuales (header, home, login, registre)
  plantes/              # Módulo de gestión de plantas (modelos, lista, detalle, tabla)
  service/              # Servicios (conexión a Supabase)
  environments/         # Configuración de entornos
```

## Tecnologías Utilizadas
- **Angular**: Framework principal para la SPA.
- **Supabase**: Backend as a Service para autenticación y base de datos.
- **RxJS**: Programación reactiva y manejo de observables.
- **TypeScript**: Tipado estático y desarrollo robusto.

## Componentes Principales
- **App**: Componente raíz, gestiona el router y la cabecera.
- **Header**: Cabecera de la aplicación.
- **Home**: Página principal.
- **Login**: Formulario de autenticación de usuario.
- **Registre**: Formulario de registro de usuario.
- **PlantesList**: Lista de plantas en formato de tarjetas.
- **PlantesTable**: Tabla de plantas.
- **PlantesDetall**: Vista de detalle de una planta.
- **PlantesItem / PlantesTableRow**: Subcomponentes para mostrar una planta individual en lista o tabla.

## Servicios
- **Supaservice**: Servicio centralizado para la comunicación con Supabase (autenticación y datos de plantas).

## Modelos de Datos
- **Planta**: Interfaz que define los campos de una planta (id, nombre, ubicación, capacidad, usuario, foto, etc).
- **PLANTES_DEMO**: Array de ejemplo con varias plantas para pruebas y desarrollo.

## Rutas de la Aplicación
- `/home`: Página principal.
- `/plantes`: Lista de plantas.
- `/plantes_table`: Tabla de plantas.
- `/planta/:id`: Detalle de una planta.
- `/login`: Login de usuario.
- `/registre`: Registro de usuario.
- `**`: Redirección a home si la ruta no existe.

## Cómo Ejecutar el Proyecto

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Ejecuta la aplicación en modo desarrollo:
   ```bash
   npm start
   # o
   ng serve -o
   ```
3. Accede a `http://localhost:4200` en tu navegador.

---

## Notas y Consejos
- Puedes modificar los datos de ejemplo en `plantes/plantes_demo.ts`.
- La autenticación y la gestión de usuarios se realiza mediante Supabase.
- El código está comentado para facilitar el aprendizaje y la personalización.


