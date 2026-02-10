package fr.uga.miage.m1.fr.uga.miage.m1.enum

enum class TypeEvenementVol(val description: String) {
    CHANGEMENT_STATUT("Changement de statut du vol"),
    EMBARQUEMENT_DEBUTE("Début de l'embarquement"),
    PASSAGER_EMBARQUE("Passager embarqué"),
    EMBARQUEMENT_TERMINE("Embarquement terminé"),
    PORTES_OUVERTES("Portes de l'avion ouvertes"),
    PORTES_FERMEES("Portes de l'avion fermées"),
    DECOLLAGE("Décollage effectué"),
    ATTERRISSAGE("Atterrissage effectué"),
    RETARD_ANNONCE("Retard annoncé"),
    ANNULATION("Vol annulé"),
    PISTE_ASSIGNEE("Piste assignée au vol"),
    AVION_ASSIGNE("Avion assigné au vol"),
    CHECK_IN_OUVERT("Début du CHECK-IN"),
    CHECK_IN_FERME("Fin fu CHECK-IN")
}