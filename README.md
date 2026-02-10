[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/_Q6rth6_)
# ✈️ Projet gestion d'un aéroport - Airport SI

## 📚 Contexte général

Vous travaillez par équipes. Chaque équipe est responsable de la gestion d’un aéroport différent.  
L’objectif est de construire progressivement un système d’information permettant de gérer l’activité d’un aéroport.  
Le projet se déroulera en 4 itérations, avec un rendu à chaque étape.

## ❌ Contrainte principale

* Architecture en 2 parties :
    * **Back** :
        * Spring Boot (Kotlin).
        * Une base de données (PostgreSQL, Oracle, MongoDB) disposant d’un client réactif.
    * **Front** : au choix (Angular / React / Flutter).
        * Le client http doit être configurable (URL base, timeout, feature flags).
        * Le front doit être déployable.

## Itération 1 — Découverte & gestion des ressources physiques

### Situation métier

Mise en place des bases du système pour gérer les ressources physiques d’un aéroport :

* Avions :
    * Créer un avion (immatriculation, type, capacité, état, etc.).
    * Lire la fiche d’un avion.
    * Mettre à jour les informations enregistrées (ex. état de maintenance, capacité modifiée).
    * Supprimer un avion.
    * Lister tous les avions disponibles.
* Pistes :
    * Créer une piste (identifiant, longueur, état).
    * Lire la fiche d’une piste.
    * Modifier son état (libre, occupée, en maintenance).
    * Supprimer une piste.
    * Consulter la disponibilité des pistes.
* Hangars :
    * Créer un hangar (identifiant, capacité).
    * Lire la fiche d’un hangar.
    * Mettre à jour les informations (capacité, état).
    * Supprimer un hangar.
    * Associer/dissocier un avion à un hangar.
    * Lister les avions présents dans un hangar.

#### Objectifs techniques

* Mise en place du projet backend.
* Branchement de SonarQube.
* Comblé l'ensemble des quality gate
* Front minimal permettant d’interagir avec le backend.
    * le plus simpliste possible pour l'instant
    * N'hésitez pas aussi à le brancher à Sonar

## <img height="40" src="https://vectorseek.com/wp-content/uploads/2023/08/Sonarqube-Logo-Vector.svg-.png" width="200"/>

* Pour savoir comment lier votre projet à Sonar, consultez le fichier [SONAR.md](SONAR.md).


## Itération 2 — Gestion des vols
  
### Situation métier  
  
L’aéroport doit gérer ses vols et leur statut opérationnel.  
  
* Planning des vols : création avec numéro, origine, destination, horaires.  
  
#### Fonctionnalités attendues  
  
* Vols  
  * Créer un vol  
  * Lire les informations d’un vol.  
  * Modifier un vol (ex. changement d’horaire).  
  * Supprimer un vol.  
  * gérer le status d'un vols  
  
* Assignation  
  * Associer un avion existant à un vol.  
  * Consulter quel avion est affecté à un vol donné.  
  
* Statut des vols  
  * Mettre à jour l’état d’un vol : prévu, en attente, embarquement, décollé, en vol, arrivé, annulé.  
  * Consulter l’historique ou l’état courant d’un vol.  
  * Lister tous les vols par statut.  
  
#### Objectifs techniques  
  
* Première phase de refactor pour mieux organiser le code.  
* Ajout de nouvelles fonctionnalités et extension du modèle métier.  
* Appliquez des design pattern qui vous semble utile  
* Comblé l'ensemble des quality gate  
  

## Itération 3 — Trafic & coordination (Semaines 7–9)

### Situation métier

* Ajout de la dimension trafic et coordination entre aéroports :

### Fonctionnalités attendues

* Planification des pistes
    * Affecter une piste à un vol pour le décollage ou l’atterrissage.
    * Vérifier la disponibilité avant l’affectation.
    * Libérer une piste après utilisation.
    * Consulter le planning des pistes.

* Coordination interne (tableau de bord trafic)
    * Lister les vols prévus au départ de l’aéroport.
    * Lister les vols prévus à l’arrivée dans l’aéroport.
    * Vue consolidée de l’état du trafic (tableau ou liste).

* Interopérabilité (entre équipes)
    * Exposer une API permettant à d’autres aéroports de consulter vos vols entrants/sortants.
    * Consommer l’API d’un autre aéroport pour afficher ses vols entrants/sortants vers votre aéroport.
    * ⚠️ Pensez à collaborer rapidement avec l'aéroport avec qui vous allez partager vos vols 

#### Liste des associations entre les aéroports

| Aéroport 1      | Aéroport 2      |
|-----------------|-----------------|
| crazyTime       | P&C-LIU&DING    |
| Tassaux_Roudoci | strawhats       |
| Feur            | jaretteLeCasino |
| kozuki          | imene_amina     |
| negadef         | lm              |
| lydismail       | koTeam          |
| Richard_Ouraha  | CIKOTLIN        |
| Les flamboyants | Clover          |
| jeannot_nicolas | mar             |
| meFa            | ThieMah         |
| uchiha          | lino            |



## Itération 4 — Passagers & réactif

### Situation métier

Le système doit gérer les passagers et permettre un suivi en temps réel de l’évolution des vols.

### Fonctionnalités attendues

* Gestion des passagers (simplifiée) de manière réactive
    * Enregistrement (check-in) : associer un passager à un vol et lui attribuer un siège.
    * Modifier un enregistrement (changer de siège, corriger une information).
    * Supprimer un enregistrement (désistement/annulation).
    * Lister les passagers enregistrés sur un vol.
    * Embarquement : vérifier qu’un passager est bien enregistré avant l’embarquer.

* Suivi en temps réel d’un vol de manière réactive
    * Permettre de suivre la progression d’un vol via une séquence d’événements (ex. embarquement terminé, décollage, en vol, atterrissage, arrivé).
    * Fournir un flux de données accessibles au front pour afficher l’évolution en direct.

* Faire passer l'ensemble des multiples consultations (listes) en reactif

## En cloud computing 

* Avoir une application sous docker 
* Avoir des CI/CD fonctionnel
* avoir un système fonctionnel est déployé à l'extérieur (et utiliser les Api des autres aussi)

## Retour sur l'itération 3

* Vous avez les solutions pour les partages d'api, alors revenez à un modèle simple

#### Objectifs techniques

* Migration partielle vers un modèle réactif (Spring WebFlux).
* Implémentation d’un suivi en temps réel (flux d’événements).

# Documentation :

* Documentation [Project reactor](https://projectreactor.io/docs)
* Documentation [Spring webflux](https://hantsy.github.io/spring-reactive-sample/web/exception.html)
* Documentation [Bibliothèque adaptant JPA en réactif](https://github.com/anaconda875/reactive-hibernate-spring-boot-starter)

<details> 
<summary>💡 À savoir</summary>

* Les prochaines itérations seront disponibles dans ce README. Nicolas mettra à jour le projet parent afin que vous ayez les nouvelles consignes.

</details>
