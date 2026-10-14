// Contenu par défaut. Une fois connecté à /admin, le contenu enregistré dans Supabase le remplace.
export const defaultContent = {
  "name": "Edoh Gerard Lawson-Noudo",
  "location": "Marrakech-Safi · Maroc",
  "availFr": "Disponible pour un stage en comptabilité, administration ou finance",
  "availEn": "Available for an internship in accounting, administration or finance",
  "leadFr": "Étudiant en économie et techniques quantitatives, formé à la comptabilité et à la gestion. Je construis des outils concrets pour suivre l'argent et les stocks : un classeur Excel VBA, une application web de dépenses en ligne.",
  "leadEn": "Economics and quantitative techniques student with a background in accounting and management. I build practical tools to track money and stock: an Excel VBA workbook and a live expense-tracking web app.",
  "langFr": "Français (natif) · Anglais B2 · Espagnol A2",
  "langEn": "French (native) · English B2 · Spanish A2",
  "aboutFr": "Je viens de la comptabilité : un baccalauréat en comptabilité et gestion au Togo, puis une licence en économie et techniques quantitatives à Safi. Ce qui m'intéresse, c'est de comprendre les chiffres d'une organisation et de les rendre lisibles.\n\nQuand un outil manque, je le construis : un suivi de stock sous Excel VBA, une application qui range les dépenses par catégorie. Je m'appuie aussi sur l'IA pour résoudre des problèmes et apprendre plus vite. À long terme, je vise la banque, la finance et les institutions économiques internationales.",
  "aboutEn": "I come from accounting: a baccalaureate in accounting and management in Togo, then a bachelor's in economics and quantitative techniques in Safi. What interests me is understanding an organisation's numbers and making them easy to read.\n\nWhen a tool is missing, I build it: a stock tracker in Excel VBA, an app that sorts expenses by category. I also use AI to solve problems and learn faster. In the long run, I am aiming at banking, finance and international economic institutions.",
  "interestsTitleFr": "Domaines visés à long terme",
  "interestsTitleEn": "Long-term fields",
  "interests": [
    {
      "fr": "Économie",
      "en": "Economics"
    },
    {
      "fr": "Comptabilité",
      "en": "Accounting"
    },
    {
      "fr": "Finance",
      "en": "Finance"
    },
    {
      "fr": "Banque",
      "en": "Banking"
    },
    {
      "fr": "Institutions financières et économiques internationales",
      "en": "International financial and economic institutions"
    },
    {
      "fr": "Analyse quantitative",
      "en": "Quantitative analysis"
    }
  ],
  "photoMain": "/gerard-portrait.jpg",
  "photoAbout": "/gerard-train.jpg",
  "cvUrl": "/CV-Gerard-Lawson-Noudo.pdf",
  "email": "gerardlawsonnoudo@gmail.com",
  "phone": "+212 642 184 204",
  "contactFr": "Un stage, un fichier Excel ou un site à construire ? Écrivez-moi.",
  "contactEn": "An internship, an Excel file or a website to build? Write to me.",
  "links": [
    {
      "label": "LinkedIn",
      "url": "https://www.linkedin.com/in/edoh-gerard-lawson-noudo"
    },
    {
      "label": "GitHub",
      "url": "https://github.com/GERARDOFLOREZ"
    }
  ],
  "projects": [
    {
      "titleFr": "Outil de gestion des stocks",
      "titleEn": "Stock management tool",
      "status": "done",
      "year": "2026",
      "stack": "Excel VBA · SUMIFS",
      "image": "",
      "descFr": "Un classeur Excel en français pour suivre le stock d'un commerce de meubles réparti sur deux sites : produits, ventes et mouvements entre points de vente.",
      "descEn": "A French-language Excel workbook to track the stock of a furniture business spread over two locations: products, sales and transfers between locations.",
      "bulletsFr": "Suivi des entrées et des sorties de stock\nTableau de bord pour visualiser les mouvements\nCalcul des seuils de réapprovisionnement par formules\nStock actuel calculé avec SUMIFS (entrées, sorties, ventes)",
      "bulletsEn": "Tracking of stock in and out\nDashboard to visualise stock movements\nReorder thresholds calculated with formulas\nCurrent stock calculated with SUMIFS (incoming, outgoing, sales)",
      "resultFr": "Un outil fonctionnel qui réduit le travail manuel et améliore la traçabilité.",
      "resultEn": "A working tool that cuts manual work and improves traceability.",
      "links": []
    },
    {
      "titleFr": "Application de gestion des dépenses",
      "titleEn": "Expense tracking app",
      "status": "live",
      "year": "2026",
      "stack": "React · Vite · Supabase · Vercel",
      "image": "",
      "descFr": "Une application web pour suivre ses dépenses personnelles et son budget, en ligne et utilisée au quotidien.",
      "descEn": "A web app to track personal expenses and budget, online and used day to day.",
      "bulletsFr": "Connexion sécurisée par compte\nRevenus, budgets et dépenses par catégorie, avec graphique\nPlusieurs devises (EUR, USD, FCFA, MAD, JPY, CNY) et export CSV\nDonnées dans Supabase (PostgreSQL) avec sécurité par ligne",
      "bulletsEn": "Secure sign-in by account\nIncome, budgets and expenses by category, with a chart\nSeveral currencies (EUR, USD, XOF, MAD, JPY, CNY) and CSV export\nData in Supabase (PostgreSQL) with row-level security",
      "resultFr": "Une application fonctionnelle pour gérer et suivre ses dépenses mensuelles.",
      "resultEn": "A working application to manage and follow monthly expenses.",
      "links": [
        {
          "label": "Essayer l'application",
          "url": "https://gestion-depenses-eight.vercel.app/"
        },
        {
          "label": "Code GitHub",
          "url": "https://github.com/GERARDOFLOREZ/gestion-depenses"
        }
      ]
    },
    {
      "titleFr": "Recherche en économie quantitative",
      "titleEn": "Quantitative economics research",
      "status": "done",
      "year": "2026",
      "stack": "Statistics · Econometrics",
      "image": "",
      "descFr": "Travaux de recherche sur des sujets d'économie, avec présentation des résultats.",
      "descEn": "Research work on economics topics, with a presentation of the results.",
      "bulletsFr": "Étude des méthodes d'analyse statistique et économétrique\nPrésentation des résultats devant des comités académiques\nCommunication de résultats techniques à l'écrit et à l'oral",
      "bulletsEn": "Study of statistical and econometric analysis methods\nResults presented to academic committees\nCommunicating technical results in writing and orally",
      "resultFr": "",
      "resultEn": "",
      "links": []
    },
    {
      "titleFr": "AVENIX Digital Solutions",
      "titleEn": "AVENIX Digital Solutions",
      "status": "live",
      "year": "2026",
      "stack": "React · Supabase · Vercel",
      "image": "",
      "descFr": "Site de services numériques avec réalisations, contact et espace client. Inscription par email et accès administrateur en place, base de données Supabase configurée par mes soins et déploiement sur Vercel via GitHub. La connexion Google est en cours.",
      "descEn": "Digital services website with a portfolio, contact and a client area. Email sign-up and admin access work, I set up the Supabase database myself, and the site is deployed on Vercel through GitHub. Google sign-in is in progress.",
      "bulletsFr": "",
      "bulletsEn": "",
      "resultFr": "",
      "resultEn": "",
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
      "titleFr": "La Prospérité Barachiel",
      "titleEn": "La Prospérité Barachiel",
      "status": "wip",
      "year": "2026",
      "stack": "Supabase · Vercel · GitHub",
      "image": "",
      "descFr": "Site vitrine et catalogue de mobilier de bureau pour la boutique de mon frère à Lomé, avec devis par WhatsApp et espace administrateur pour ajouter produits et photos.",
      "descEn": "Showcase site and catalogue of office furniture for my brother's shop in Lomé, with quotes by WhatsApp and an admin area to add products and photos.",
      "bulletsFr": "",
      "bulletsEn": "",
      "resultFr": "",
      "resultEn": "",
      "links": [
        {
          "label": "Code GitHub",
          "url": "https://github.com/GERARDOFLOREZ/La-Prosperite-Barachiel"
        }
      ]
    },
    {
      "titleFr": "WEBORA",
      "titleEn": "WEBORA",
      "status": "concept",
      "year": "2026",
      "stack": "HTML · CSS · JavaScript",
      "image": "",
      "descFr": "Site vitrine pour une offre de création de sites : présentation, cas d'usage par métier (restaurant, agence immobilière, salon de beauté, cabinet médical, e-commerce), contact par email et WhatsApp.",
      "descEn": "Showcase site for a web design offer: introduction, use cases by trade (restaurant, real estate, beauty salon, medical practice, e-commerce), contact by email and WhatsApp.",
      "bulletsFr": "",
      "bulletsEn": "",
      "resultFr": "",
      "resultEn": "",
      "links": []
    },
    {
      "titleFr": "LocalSync",
      "titleEn": "LocalSync",
      "status": "validation",
      "year": "2026",
      "stack": "Excel · CSV",
      "image": "",
      "descFr": "Idée de produit pour les commerces locaux, encore à l'étape de validation. Liste de plus de 80 prospects à Safi et Marrakech (restaurants, cafés, pharmacies), suivi d'appels et objectif de 30 appels pour 10 réponses positives. Pas encore de produit construit.",
      "descEn": "Product idea for local businesses, still at the validation stage. A list of 80+ prospects in Safi and Marrakech (restaurants, cafés, pharmacies), a call tracker and a target of 30 calls for 10 positive answers. No product built yet.",
      "bulletsFr": "",
      "bulletsEn": "",
      "resultFr": "",
      "resultEn": "",
      "links": []
    }
  ],
  "skills": [
    {
      "group": "finance",
      "name": "Comptabilité générale et analytique",
      "fr": "",
      "en": ""
    },
    {
      "group": "finance",
      "name": "Analyse des états financiers",
      "fr": "",
      "en": ""
    },
    {
      "group": "finance",
      "name": "Mathématiques financières",
      "fr": "",
      "en": ""
    },
    {
      "group": "finance",
      "name": "Modélisation financière",
      "fr": "notions",
      "en": "foundations"
    },
    {
      "group": "finance",
      "name": "Évaluation d'entreprises",
      "fr": "notions",
      "en": "foundations"
    },
    {
      "group": "finance",
      "name": "Sage 100",
      "fr": "",
      "en": ""
    },
    {
      "group": "data",
      "name": "Analyse économique micro et macro",
      "fr": "",
      "en": ""
    },
    {
      "group": "data",
      "name": "Statistiques descriptives et inférentielles",
      "fr": "",
      "en": ""
    },
    {
      "group": "data",
      "name": "Modélisation économique",
      "fr": "notions",
      "en": "foundations"
    },
    {
      "group": "data",
      "name": "Raisonnement quantitatif",
      "fr": "",
      "en": ""
    },
    {
      "group": "tools",
      "name": "Excel : VBA, tableaux croisés",
      "fr": "avancé",
      "en": "advanced"
    },
    {
      "group": "tools",
      "name": "Word · PowerPoint",
      "fr": "",
      "en": ""
    },
    {
      "group": "tools",
      "name": "Supabase",
      "fr": "auth, base de données, sécurité par ligne",
      "en": "auth, database, row-level security"
    },
    {
      "group": "tools",
      "name": "Vercel · GitHub",
      "fr": "déploiement",
      "en": "deployment"
    },
    {
      "group": "tools",
      "name": "React + Vite",
      "fr": "utilisé dans mes projets",
      "en": "used in my projects"
    },
    {
      "group": "tools",
      "name": "Visual Studio Code",
      "fr": "notions",
      "en": "foundations"
    },
    {
      "group": "soft",
      "name": "Gestion administrative",
      "fr": "",
      "en": ""
    },
    {
      "group": "soft",
      "name": "Esprit analytique",
      "fr": "",
      "en": ""
    },
    {
      "group": "soft",
      "name": "Travail en équipe",
      "fr": "",
      "en": ""
    },
    {
      "group": "soft",
      "name": "Communication claire",
      "fr": "",
      "en": ""
    },
    {
      "group": "soft",
      "name": "Organisation",
      "fr": "",
      "en": ""
    },
    {
      "group": "soft",
      "name": "Résolution de problèmes",
      "fr": "",
      "en": ""
    }
  ],
  "skillNoteFr": "Je ne maîtrise pas encore SQL ni Python. Je les apprends au fil de mes études et de mes projets.",
  "skillNoteEn": "I do not use SQL or Python yet. I am learning them through my studies and projects.",
  "edu": [
    {
      "fr": "Licence en économie et techniques quantitatives",
      "en": "Bachelor's in Economics and Quantitative Techniques",
      "detail": "Faculté Polydisciplinaire de Safi · 2026 – 2028 · en cours / ongoing"
    },
    {
      "fr": "Baccalauréat en comptabilité et gestion",
      "en": "Baccalaureate in Accounting and Management",
      "detail": "Institut Technique et Moderne La Vision, Togo · 2023 – 2025"
    }
  ]
}
