package fr.uga.miage.m1.fr.uga.miage.m1.enum

enum class EtatPiste(val description: String) {
    LIBRE("Piste disponible pour utilisation"),
    OCCUPEE("Un avion utilise actuellement la piste"),
    EN_MAINTENANCE("En réparation/entretien"),
    FERMEE("Fermée temporairement (météo, événement)"),
    HORS_SERVICE("Fermée définitivement")
}