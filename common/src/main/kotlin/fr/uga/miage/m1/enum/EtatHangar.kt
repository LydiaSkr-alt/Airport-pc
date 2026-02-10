package fr.uga.miage.m1.fr.uga.miage.m1.enum

enum class EtatHangar  {
    Vide,          // Hangar vide, disponible pour accueillir des avions
    Rempli,        // Hangar plein (capacité atteinte)
    Disponible,    // Hangar non plein mais déjà occupé
    EnMaintenance
}