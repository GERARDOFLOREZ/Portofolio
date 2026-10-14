// Contenu par défaut. Une fois connecté à /admin, le contenu enregistré dans Supabase le remplace.
export const defaultContent = {
  "name": "Edoh Gerard Lawson-Noudo",
  "location": "Marrakech-Safi · Maroc",
  "leadFr": "Étudiant en économie et techniques quantitatives. Je construis des sites web, des petites applications et des outils Excel pour des commerces et des particuliers.",
  "leadEn": "Economics and quantitative techniques student. I build websites, small web apps and Excel tools for shops and individuals.",
  "langFr": "Français · Anglais B2 · Espagnol A2",
  "langEn": "French (native) · English B2 · Spanish A2",
  "email": "gerardnoudo@gmail.com",
  "phone": "+212 642 184 204",
  "contactFr": "Un site, une petite application ou un fichier Excel à faire ? Écrivez-moi.",
  "contactEn": "Need a website, a small app or an Excel file? Write to me.",
  "links": [
    {
      "label": "GitHub",
      "url": "https://github.com/GERARDOFLOREZ"
    }
  ],
  "projects": [
    {
      "titleFr": "AVENIX Digital Solutions",
      "titleEn": "AVENIX Digital Solutions",
      "status": "live",
      "stack": "React · Supabase · Vercel",
      "descFr": "Site de services numériques avec réalisations, contact et espace client. Inscription par email et accès administrateur en place, base de données Supabase configurée par mes soins et déploiement sur Vercel via GitHub. La connexion Google est en cours.",
      "descEn": "Digital services website with portfolio, contact and a client area. Email sign-up and admin access work, I set up the Supabase database myself, and the site is deployed on Vercel through GitHub. Google sign-in is in progress.",
      "links": [
        {
          "label": "Voir le site",
          "url": "https://gerard-digital-solution.vercel.app"
        },
        {
          "label": "Code GitHub",
          "url": "https://github.com/GERARDOFLOREZ/gerard-digital-solution"
        }
      ]
    },
    {
      "titleFr": "Application de gestion des dépenses",
      "titleEn": "Personal expense tracker",
      "status": "done",
      "stack": "React · Vite · Supabase · Recharts",
      "descFr": "Application web de finances personnelles avec authentification, revenus et budgets, export CSV, graphique en secteurs et plusieurs devises (EUR, USD, FCFA, MAD, JPY, CNY). Les données sont passées du navigateur à Supabase (PostgreSQL) avec sécurité par ligne. Déployée sur Vercel.",
      "descEn": "Personal finance web app with authentication, income and budgets, CSV export, a pie chart and several currencies (EUR, USD, XOF, MAD, JPY, CNY). Data moved from browser storage to Supabase (PostgreSQL) with row-level security. Deployed on Vercel.",
      "links": []
    },
    {
      "titleFr": "WEBORA",
      "titleEn": "WEBORA",
      "status": "concept",
      "stack": "HTML · CSS · JavaScript",
      "descFr": "Site vitrine pour une offre de création de sites : présentation, cas d'usage par métier (restaurant, agence immobilière, salon de beauté, cabinet médical, e-commerce), contact par email et WhatsApp. Design sombre, responsive.",
      "descEn": "Showcase site for a web design offer: introduction, use cases by trade (restaurant, real estate, beauty salon, medical practice, e-commerce), contact by email and WhatsApp. Dark, responsive design.",
      "links": []
    },
    {
      "titleFr": "La Prospérité Barachiel",
      "titleEn": "La Prospérité Barachiel",
      "status": "wip",
      "stack": "Supabase · Vercel · GitHub",
      "descFr": "Site vitrine et catalogue de mobilier de bureau pour la boutique de mon frère à Lomé, avec devis par WhatsApp et espace administrateur pour ajouter produits et photos. Inspiré du style d'un site de meubles existant, avec nos propres données et visuels.",
      "descEn": "Showcase site and catalogue of office furniture for my brother's shop in Lomé, with quotes by WhatsApp and an admin area to add products and photos. Styled after an existing furniture site, with our own data and photos.",
      "links": [
        {
          "label": "Code GitHub",
          "url": "https://github.com/GERARDOFLOREZ/La-Prosperite-Barachiel"
        }
      ]
    },
    {
      "titleFr": "Classeur de stock et ventes",
      "titleEn": "Stock and sales workbook",
      "status": "done",
      "stack": "Excel",
      "descFr": "Classeur Excel en français pour un commerce de meubles sur deux sites : produits, ventes, mouvements entre points de vente et tableau de bord. Le stock actuel se calcule avec des formules SUMIFS (entrées, sorties, ventes).",
      "descEn": "French-language Excel workbook for a furniture business across two locations: products, sales, transfers between locations and a dashboard. Current stock is calculated with SUMIFS formulas (incoming, outgoing, sales).",
      "links": []
    },
    {
      "titleFr": "LocalSync",
      "titleEn": "LocalSync",
      "status": "validation",
      "stack": "Excel · CSV",
      "descFr": "Idée de produit pour les commerces locaux, encore à l'étape de validation. J'ai établi une liste de plus de 80 prospects à Safi et Marrakech (restaurants, cafés, pharmacies), un suivi d'appels et un objectif de 30 appels pour 10 réponses positives. Pas encore de produit construit.",
      "descEn": "Product idea for local businesses, still at the validation stage. I built a list of 80+ prospects in Safi and Marrakech (restaurants, cafés, pharmacies), a call tracker and a target of 30 calls for 10 positive answers. No product built yet.",
      "links": []
    }
  ],
  "skills": [
    {
      "name": "React + Vite",
      "fr": "projets réels",
      "en": "real projects"
    },
    {
      "name": "JavaScript",
      "fr": "projets réels",
      "en": "real projects"
    },
    {
      "name": "Supabase",
      "fr": "auth, base, RLS",
      "en": "auth, database, RLS"
    },
    {
      "name": "Vercel · GitHub",
      "fr": "déploiement",
      "en": "deployment"
    },
    {
      "name": "Excel · VBA",
      "fr": "formules, tableaux de bord",
      "en": "formulas, dashboards"
    },
    {
      "name": "VS Code",
      "fr": "bases",
      "en": "basics"
    }
  ],
  "skillNoteFr": "Je ne maîtrise pas encore SQL ni Python. Je les apprends au fil de mes études et de mes projets.",
  "skillNoteEn": "I do not use SQL or Python yet. I am learning them through my studies and projects.",
  "edu": [
    {
      "fr": "Économie et techniques quantitatives",
      "en": "Economics and Quantitative Techniques",
      "detail": "Faculté Polydisciplinaire de Safi · 2026 – 2028"
    },
    {
      "fr": "Baccalauréat en comptabilité et gestion",
      "en": "Baccalaureate in Accounting and Management",
      "detail": "2023 – 2025"
    }
  ]
}
