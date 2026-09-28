# upcom-frontend

Site public officiel de **UPCOM AGENCY & SERVICES** : React 19, TypeScript (strict), Vite, Tailwind CSS 4,
Framer Motion, Lucide React et Supabase.

| Dépôt | Rôle |
|---|---|
| **`upcom-frontend`** | **Ce dépôt** : site public (lecture des contenus publiés, formulaires) |
| `upcom-backend` | Supabase : schéma, RLS, Storage, Edge Functions, types partagés (`@upcom/supabase`) |
| `upcom-admin` | Back-office de gestion des contenus |

---

## Démarrage

Prérequis : Node.js ≥ 20.

```bash
npm install
cp .env.example .env.local      # renseigner l'URL et la clé publishable Supabase
npm run dev                     # http://localhost:5173
```

En local, démarrez le backend (`npm run db:start` et `npm run functions:serve` dans `upcom-backend`), puis
reportez l'`API_URL` et la `PUBLISHABLE_KEY` affichées dans `.env.local`. Sans configuration Supabase, le site
reste navigable : il affiche le contenu officiel embarqué et des états vides soignés.

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Typecheck + build de production, puis génération de `sitemap.xml` et `robots.txt` |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run brand:assets` | Régénère logo détouré, favicon et image Open Graph depuis `brand/logo-upcom-source.jpeg` |

### Variables d'environnement (valeurs publiques uniquement)

| Variable | Rôle |
|---|---|
| `VITE_SUPABASE_URL` | URL du projet Supabase (le même que `upcom-backend`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clé publishable (ou `VITE_SUPABASE_ANON_KEY`) |
| `VITE_SITE_URL` | URL définitive du site : canonical, Open Graph, sitemap |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile, si `TURNSTILE_SECRET_KEY` est configuré côté Edge Functions |

> ⛔ Jamais de `service_role` ni de clé secrète dans ce dépôt ou dans une variable `VITE_*`.
> Ajoutez l'origine du site à `ALLOWED_ORIGINS` des Edge Functions (CORS).

---

## Architecture

```
src/
├── app/            router (une page = un chunk chargé à la demande), providers (React Query, Framer Motion)
├── config/         env typé, routes et navigation
├── content/        contenu officiel issu du cahier des charges (pôles, prestations, objectifs, publics…)
├── lib/            client Supabase, URLs Storage, formatage, icônes, SEO, vidéo
├── types/          modèles métier (découplés des lignes SQL)
├── repositories/   SEULE couche qui interroge Supabase (une par domaine)
├── services/       envoi des formulaires via les Edge Functions
├── hooks/          hooks React Query (queries.ts) et utilitaires UI
├── layouts/        RootLayout (en-tête, pied de page, transitions, progression)
├── sections/home/  les sections de la page d'accueil
├── components/     ui · motion · layout · cards · forms · media · seo
└── pages/          une page par route
```

Flux de données : **composant → hook (`hooks/queries.ts`) → repository → Supabase**. Les composants
n'importent jamais le client Supabase.

### Routes

| URL | Page |
|---|---|
| `/` | Accueil (hero, agence, expertises, approche, réalisations, pourquoi UPCOM, témoignages*, équipe, actualités & événements, CTA) |
| `/a-propos` | Présentation, vision, mission, valeurs, objectifs, approche, équipe |
| `/services`, `/services/:pole`, `/services/:pole/:service` | Pôles d'activité et prestations |
| `/realisations`, `/realisations/:slug` | Portfolio (filtres, recherche, galerie, vidéo) |
| `/expertise` | Savoir-faire transversal |
| `/equipe` | Équipe |
| `/actualites`, `/actualites/:slug` | Actualités (catégories, recherche, pagination, partage) |
| `/evenements`, `/evenements/:slug` | Événements (à venir / passés, export agenda `.ics`) |
| `/contact` | Coordonnées, WhatsApp, formulaire, carte |
| `/demarrer-un-projet` | Demande de projet (`?besoin=<pôle>` ou `?service=<uuid>` pour préremplir) |

\* affichés uniquement si des témoignages sont publiés.

---

## Intégration Supabase

- **Types** : `@upcom/supabase` est installé depuis `github:ouzking/upcom-backend#v0.1.0`. Après une
  migration côté backend : nouveau tag, puis mise à jour de la version dans `package.json`.
- **Lecture** : clé publishable, sans session. La RLS n'expose que les contenus `published` (et les articles
  dont la date de publication est atteinte). Les coordonnées personnelles de l'équipe ne sont pas chargées.
- **Images** : les tables stockent des chemins ; `lib/storage.ts` produit l'URL publique du bucket.
- **Formulaires** : `submit-quote-request` et `submit-contact-message` (validation, honeypot `website`,
  Turnstile optionnel, rate-limit). Les erreurs par champ renvoyées par le backend s'affichent sous les champs.
- **Pôles** : la table `service_categories` décide de la liste et des textes ; `src/content/expertises.ts`
  complète ce qui n'est pas saisi (descriptions, liste des prestations du cahier des charges).
- **Paramètres** : `site_settings` et `social_links` sont prioritaires sur les valeurs par défaut
  (adresse, téléphones). L'e-mail, les horaires, le numéro WhatsApp et la carte n'apparaissent que s'ils sont
  renseignés.

### Conventions pour le back-office (`upcom-admin`)

- **Texte riche** (articles, réalisations, services, événements) : Markdown léger. Paragraphes séparés par
  une ligne vide, `##` / `###`, listes `-` ou `1.`, citations `>`, `**gras**`, `*italique*`, `[lien](https://…)`.
  Le HTML brut n'est pas interprété.
- **Vidéo** : une URL YouTube ou Vimeo seule sur sa ligne devient un lecteur, chargé au clic.
  (Le schéma n'a pas de colonne `video_url` ; à ajouter côté backend si besoin.)
- **Icônes** : colonne `icon` = clé du registre `src/lib/icons.ts` (ex. `compass`, `pen-tool`, `clapperboard`).
- **Demande de projet** : sans prestation précise, le pôle choisi est ajouté en tête du message
  (« Type de besoin : … »), le contrat de l'API n'ayant pas de champ dédié.

---

## Contenu

Aucun client, chiffre, témoignage, partenaire ni statistique n'est inventé. Les textes institutionnels
(`src/content/`) sont tirés du cahier des charges et **doivent être validés par UPCOM**. En l'absence de
données, chaque section affiche un état vide éditorial ou le contenu officiel (par exemple l'organisation de
l'équipe par postes, sans noms).

Hypothèses à confirmer :
- **WhatsApp** : à défaut de `whatsapp_number` en base, le bouton utilise le premier numéro (77 402 74 94).
- **Carte** : à défaut de `map_url`, recherche « Ouest Foire, Cité Air Afrique, Lot 13, Dakar ».
- **Budgets** proposés dans la demande de projet : fourchettes indicatives en FCFA, modifiables dans
  `QuoteForm.tsx`.

---

## Design & expérience

- **Charte** : bleu `#013592` dominant, orange `#FD8E03` en accent, dégradés officiels réservés au hero et au
  CTA final. Tokens dans `src/index.css` (`@theme`).
- **Typographie** (auto-hébergée) : Bricolage Grotesque (titres, mots d'accent en couleur),
  Manrope (texte).
- **Motifs** issus du logo : orbites elliptiques et trois barres obliques.
- **Animations** : Framer Motion en `LazyMotion` (fonctionnalités chargées à la demande), révélations au
  scroll, parallaxe légère, transitions de page. Le réglage système « réduire les animations » est respecté.
- **Responsive** : mobile-first, typographie fluide (`clamp`), menu plein écran sous 1280 px, accordéon des
  expertises sur mobile et panneau sticky sur desktop, conteneur plafonné à 1408 px.
- **Accessibilité** : HTML sémantique, lien d'évitement, focus visible, menu et visionneuse avec focus piégé
  et touche Échap, libellés ARIA, contrastes AA (texte navy sur orange).

## SEO

- Title, description, canonical, Open Graph et Twitter par page (`components/seo/Seo.tsx`).
- JSON-LD : `ProfessionalService` (index.html), `WebSite`, `Service`, `CreativeWork`, `Article`, `Event`,
  `ContactPage`, `BreadcrumbList`.
- `sitemap.xml` et `robots.txt` générés au build à partir des contenus publiés (`scripts/generate-seo-files.mjs`).
- Le site est une SPA : pour un référencement optimal des pages dynamiques, un pré-rendu (ou un rendu
  serveur) pourra être ajouté ultérieurement.

## Déploiement

Hébergement **Netlify** : `netlify.toml` (build, Node 22, réécriture SPA) et `public/_headers` (sécurité, CSP, cache).
Définir `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` dans Netlify : le build de production échoue si elles manquent ou pointent vers une adresse locale.
