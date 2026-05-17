# FirmaCheck — AI-generovaný komponent: CompanyCard

Tento dokument popisuje postup vývoja komponentu `CompanyCard` pomocou AI asistenta (Claude Code / Claude Sonnet 4.6).

---

## Čo je CompanyCard?

`CompanyCard` je React komponent (`components/CompanyCard.tsx`), ktorý zobrazuje detailné informácie o českej firme získané z registra ARES. Komponent obsahuje:

- **Monogram avatar** — tmavý štvorček s prvým písmenom názvu firmy
- **Stavová značka** — farebná "pill" s animovanou pulzujúcou bodkou (zelená = aktívna, jantárová = zaniklá)
- **Hlavička** — názov firmy, IČO, DIČ, počet rokov v registri
- **Akčné tlačidlá** — kopírovanie IČO do schránky, uloženie/uložené
- **Mriežka faktov** — IČO, DIČ, právna forma, dátum vzniku
- **Adresa so sídlom** — ikona pinu, ulica, PSČ, mesto
- **Interaktívna mapa** — OpenStreetMap cez react-leaflet s prekryvnými badge-mi (súradnice, odkaz na mapu)
- **Päta** — zdroj dát (ARES)

---

## Použité prompty a iterácie

### Iterácia 1 — Základná štruktúra

**Prompt:**
> "Create a CompanyCard component where we will display the company name, Company ID (IČO), VAT ID (DIČ), and the number of years in the registry. All data should be loaded from an API after searching. In the top-right corner, add a save button that stores the company data into an SQLite database when clicked. Below the information section, create an interactive map using Leaflet and display a pin on the map based on the address loaded from ARES."

### Iterácia 2 — Kompletný redesign podľa AI prototypu

**Prompt:**
> "Implement me this new design. But without header navigation, Bulk lookup and footer pages."
> (+ odkaz na dizajnový bundle vygenerovaný Claude Design)

Výsledok — kompletný prepis CompanyCard podľa hi-fi prototypu:
- Tmavý monogram avatar s gradientom (`linear-gradient(135deg, #0f172a, #1e293b)`)
- `StatusPill` s CSS animáciou `softPulse` — pulzujúca bodka pre aktívny stav firmy
- Subkomponent `Fact` pre jednotlivé položky v mriežke faktov
- Helper funkcie `fmtDate()` a `ageInYears()` pre formátovanie dátumov
- `fade-up` CSS animácia pri načítaní výsledku
- `hairline-strong` tieňovanie namiesto ostrých border
- Adresová sekcia s ikonou pinu a externým odkazom na OpenStreetMap

---

## Technické rozhodnutia

| Rozhodnutie | Dôvod |
|---|---|
| `'use client'` direktíva | Komponent používa `useState` (clipboard, saving stav) |
| `dynamic` import pre mapu | Leaflet nie je kompatibilný so SSR |
| `navigator.clipboard` s `.catch()` | Clipboard API môže byť zablokované v niektorých prehliadačoch |
| Props `isSaved` a `saving` z rodiča | Stav je zdieľaný s postranným panelom, musí žiť vo `Home` |
| CSS custom properties (`--accent`) | Jednotná farebná téma bez duplicity v Tailwinde |

---

## Štruktúra komponentu

```
CompanyCard
├── StatusPill          — aktívny / zaniklý stav
├── Fact                — jeden riadok v mriežke faktov
├── fmtDate()           — formátovanie ISO dátumu do cs-CZ
├── ageInYears()        — výpočet počtu rokov od vzniku
└── CompanyMap          — react-leaflet mapa (dynamic import)
```

---

## Props

```typescript
interface CompanyCardProps {
  company: Company;                            // dáta z ARES
  coords: { lat: number; lng: number } | null; // geocoding z Nominatim
  isSaved: boolean;                            // či je firma v zozname
  saving: boolean;                             // loading stav ukladania
  onSave: (ico: string, name: string) => void; // callback pre uloženie
}
```
