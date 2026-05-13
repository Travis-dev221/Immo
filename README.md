# VENTURE — site immobilier (Next.js + Prisma + MySQL / XAMPP)

## 1. Base de données avec le fichier SQL (sans ligne de commande Prisma obligatoire)

1. Démarrez **MySQL** dans le panneau **XAMPP**.
2. Ouvrez **phpMyAdmin** : [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Onglet **Importer** → choisissez le fichier  
   **`database/venture.sql`**  
   (vous pouvez aussi ouvrir ce fichier dans un éditeur, copier tout le texte, onglet **SQL**, coller, exécuter).

Ce fichier :

- crée la base **`venture`** (utf8mb4) ;
- crée toutes les tables (User, Property, Contact, favoris, sessions NextAuth, etc.) ;
- insère des **données de démo** (utilisateurs + annonces).

**Comptes démo** (mot de passe partout : **`demo123456`**) :

- `admin@venture.demo` — administrateur  
- `agent@venture.demo` — agent  
- `user@venture.demo` — utilisateur  

## 2. Fichier `.env`

Dans le dossier `venture` :

```powershell
copy .env.example .env
```

Vérifiez **`DATABASE_URL`** (souvent `mysql://root:@localhost:3306/venture` si le mot de passe root est vide).  
Renseignez **`AUTH_SECRET`** (phrase longue, obligatoire pour la connexion).

## 3. Lancer le site

```powershell
cd venture
npm install --legacy-peer-deps
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Si vous modifiez le schéma Prisma plus tard

Après un changement dans `prisma/schema.prisma`, alignez la base avec :

```powershell
npm run db:push
```

(Tant que vous n’avez pas modifié le schéma, l’import de **`database/venture.sql`** suffit.)

### Données démo uniquement via Node (alternative au SQL)

Si vous préférez créer les tables avec Prisma puis remplir avec le script :

```powershell
npm run db:push
npm run db:seed
```

---

## Scripts utiles

| Commande | Action |
|----------|--------|
| `npm run db:push` | Met à jour les tables selon `schema.prisma` |
| `npm run db:seed` | Remplit des données démo (nécessite tables vides ou cohérentes) |
| `npm run db:studio` | Prisma Studio |
| `npm run dev` | Serveur de développement |

---

## Fichiers

| Fichier / dossier | Rôle |
|-------------------|------|
| **`database/venture.sql`** | **À importer dans phpMyAdmin** — schéma + démo |
| `prisma/schema.prisma` | Modèles utilisés par l’application |
| `.env.example` | Exemple de configuration |

---

## Notes

- Pas de Docker dans ce projet : uniquement **XAMPP** (ou tout autre MySQL compatible).
- Les images d’annonces sont stockées en **JSON** (liste d’URLs).
- **SMTP** et **Cloudinary** restent optionnels (voir `.env.example`).
