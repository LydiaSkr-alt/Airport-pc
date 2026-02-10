package fr.uga.miage.m1.fr.uga.miage.m1.enum

enum class StatutVol(val description: String, val estTerminal: Boolean = false) {
    PROGRAMME("Vol programmé et confirmé", false),
    ENREGISTREMENT("Enregistrement des passagers ouvert", false),
    EMBARQUEMENT("Embarquement en cours", false),
    PRET_DECOLLAGE("Prêt au décollage, portes fermées", false),
    DECOLLE("Avion en phase de décollage", false),
    EN_VOL("Avion en vol de croisière", false),
    EN_APPROCHE("Avion en approche finale", false),
    ATTERRI("Avion a atterri", false),
    ARRIVE("Vol terminé, passagers débarqués", true),
    RETARDE("Vol retardé", false),
    DETOURNE("Vol détourné vers un autre aéroport", false),
    ANNULE("Vol annulé", true);

    fun estEnCours(): Boolean = this in listOf(DECOLLE, EN_VOL, EN_APPROCHE, ATTERRI)

}