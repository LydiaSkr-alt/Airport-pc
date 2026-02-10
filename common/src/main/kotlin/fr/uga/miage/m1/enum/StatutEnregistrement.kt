package fr.uga.miage.m1.fr.uga.miage.m1.enum

enum class StatutEnregistrement(val description: String) {
    EN_ATTENTE("En attente de validation"),
    ENREGISTRE("Passager enregistré"),
    EMBARQUE("Passager embarqué"),
    DEBARQUE("Passager débarqué"),
    ANNULE("Enregistrement annulé");

    fun peutTransitionnerVers(cible: StatutEnregistrement): Boolean =
        cible in transitionsAutorisees()

    private fun transitionsAutorisees(): Set<StatutEnregistrement> = when (this) {
        EN_ATTENTE -> setOf(ENREGISTRE, ANNULE)
        ENREGISTRE -> setOf(EMBARQUE, ANNULE)
        EMBARQUE -> setOf(DEBARQUE)
        DEBARQUE -> emptySet()
        ANNULE -> emptySet()
    }
}