# Gloria Beauty Salon — sitio público

Fase 1 del ecosistema Gloria (ver brief completo). Este repo contiene el
sitio público (`/` y `/servicios`), con la identidad de marca aprobada ya
aplicada: paleta, tipografía (Cormorant Garamond + Manrope), logo real,
fotografía real del equipo y de cada categoría de servicio.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Desplegar en Vercel

1. Sube este repo a GitHub (o conecta la carpeta directo desde el CLI de Vercel).
2. Importa el proyecto en Vercel.
3. Conecta el dominio **www.gloriabeautysalonmiami.com** desde Settings → Domains.
4. No hay variables de entorno todavía — Supabase/Stripe/Resend se agregan en
   fases posteriores (ver `TODO(hub)` / `TODO(booking)` en `/lib/data`).

## Qué falta (a propósito — por fases)

- **Galería** (`/galeria`) — pendiente de fotos adicionales para masonry editorial
- **Sobre Gloria** (`/sobre-gloria`) como página propia — hoy es una sección en home
- **Equipo** como páginas individuales (`/equipo/[slug]`) — hoy son anclas en home
- **Shop** — Fase 4 (Stripe)
- **Gloria On Demand** (booking real) — Fase 2; los botones "Reservar" y
  "RESERVA TU CITA" hoy apuntan a `#book`, un ancla placeholder
- **Foto real de fachada/letrero** para el bloque de ubicación — hoy usa el
  logo sobre fondo espresso como placeholder
- Favicon / ícono de app — pendiente un recorte del monograma G solo (el
  archivo de logo actual no tiene un corte limpio entre el monograma y la
  palabra GLORIA)

## Estructura

```
app/
  layout.tsx        fuentes + metadata
  page.tsx           home
  servicios/page.tsx
components/
  ui/                Button, Eyebrow — primitivos compartidos
  brand/             Logo
  public/            Nav, Hero, ServicesStrip, AboutGloria, Experience,
                     Team, Location, Footer
lib/data/            team.ts, services.ts, site.ts — contenido tipado;
                     cada archivo marca con TODO(hub) dónde se conectará
                     a Supabase una vez exista Gloria Hub
public/images/gloria/ fotografía real, organizada por categoría
```

Los datos de equipo/servicios/sitio viven en `lib/data` como arrays
tipados a propósito: cuando llegue la Fase 5 (Gloria Hub + Supabase),
esas funciones se reemplazan por queries a la base de datos sin tocar
los componentes visuales.
