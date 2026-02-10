package fr.uga.miage.m1.fr.uga.miage.m1.enum

enum class ClasseVoyage(val description: String, val prioriteEmbarquement: Int) {
    PREMIERE("Première classe", 1),
    AFFAIRES("Classe affaires", 2),
    PREMIUM_ECONOMIQUE("Premium économique", 3),
    ECONOMIQUE("Classe économique", 4);

    companion object {
        fun parPriorite(): List<ClasseVoyage> = entries.sortedBy { it.prioriteEmbarquement }
    }
}