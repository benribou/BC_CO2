# 🌍 Econum

Ce projet propose une application web permettant de **suivre l'évolution de la température d'un câble électrique** et de mesurer l'empreinte carbone (énergie consommée et émissions CO₂) du front-end et du back-end

---

## 📂 Structure du projet

- `frontend/` : 🌐 Application **React + TypeScript (Vite)** pour l'interface utilisateur.
- `backend/` : ⚙️ API **FastAPI (Python)** pour la génération et la lecture des données d'émissions.

---

## ✅ Prérequis

- 🟢 **Node.js** (>= 18)
- 🐍 **Python** (>= 3.9)
- 📦 **pip**

---

## ⚙️ Installation

### 1. Backend

```sh
cd backend
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate sous Windows
pip install -r requirements.txt
```

### 2. Frontend

```sh
cd frontend
npm install
```

---

## 🚀 Lancement du projet

### 1. Lancer le backend

Depuis le dossier `backend` :

```sh
python run.py
```

Le serveur FastAPI sera accessible sur [http://127.0.0.1:8000](http://127.0.0.1:8000).

### 2. Lancer le frontend

Depuis le dossier `frontend` :

```sh
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173).

---

## ✨ Fonctionnalités

- 🔥 **Suivi de température** sur 30 minutes.
- 📊 **Affichage graphique** de l'évolution de la température.
- 🌱 **Mesure de l'énergie consommée** et des **émissions CO₂** du front-end (navigation) et du back-end (calcul).
- 🖥️ **Visualisation des résultats** dans des panneaux dédiés.

---

## 📝 Notes

- 🛠️ Le backend utilise [CodeCarbon](https://mlco2.github.io/codecarbon/) pour mesurer l'empreinte carbone des calculs.
- 📂 Les données d'émissions sont stockées dans `backend/app/data/emissions.csv` et `output.json`.

---

## 🛠️ Développement

- 🌐 Le frontend utilise **React, TypeScript, Vite, ESLint, et Recharts**.
- ⚙️ Le backend utilise **FastAPI, pandas et CodeCarbon**.

---
