package fr.uga.miage.m1.fr.uga.m1.dto

import fr.uga.miage.m1.fr.uga.m1.enum.StatutVol

data class VolTraficResponse(
    val numeroVol: String,
    val origine: String,
    val destination: String,
    val heureDepart: java.time.LocalDateTime,
    val heureArrivee: java.time.LocalDateTime,
    val statut: StatutVol,
    val avionImmatriculation: String?,
    val pisteAssignee: String?
)