package fr.uga.m1.api


import fr.uga.miage.m1.fr.uga.miage.m1.enum.StatutVol
import fr.uga.miage.m1.responses.VolTraficResponse
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux

@Tag(name = "Vols Partagés", description = "Endpoints pour l'échange de données de vols avec d'autres aéroports")
@RequestMapping("/api/vols/partage")
interface ShareAPIEndpoints {

    @Operation(summary = "Vols au départ de l'aéroport spécifié")
    @GetMapping("/{codeIATA}/departs")
    @ResponseStatus(HttpStatus.OK)
    fun getVolsDepart(
        @Parameter(description = "Code IATA de l'aéroport")
        @PathVariable codeIATA: String,
        @Parameter(description = "Filtrer par statut du vol")
        @RequestParam(required = false) statut: StatutVol?
    ): Flux<VolTraficResponse>

    @Operation(summary = "Vols à l'arrivée à l'aéroport spécifié")
    @GetMapping("/{codeIATA}/arrivees")
    @ResponseStatus(HttpStatus.OK)
    fun getVolsArrivee(
        @Parameter(description = "Code IATA de l'aéroport")
        @PathVariable codeIATA: String,
        @Parameter(description = "Filtrer par statut du vol")
        @RequestParam(required = false) statut: StatutVol?
    ): Flux<VolTraficResponse>

    @Operation(summary = "Récupérer tous les vols de l'aéroport partenaire externe")
    @GetMapping("/externe")
    @ResponseStatus(HttpStatus.OK)
    fun getAllVolsExterne(): Flux<VolTraficResponse>
}