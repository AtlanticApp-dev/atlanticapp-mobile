export const translateStatus = (status: string): string => {
    switch (status) {
        case 'live':
            return 'En cours';
        case 'completed':
            return 'Terminé';
        case 'incoming':
            return 'À venir';
        case 'cancelled':
            return 'Annulé';
        case 'postponed':
            return 'Reporté';
        default:
            return status;
    }
};

export const translatePhase = (phase: string): string => {
    switch (phase) {
        case 'f':
            return "Finale";
        case '2f':
            return "Demi-finale";
        case '3f':
            return "Match pour la 3ème place";
        case '4f':
            return "Quart de finale";
        case '8f':
            return "Huitième de finale";
        case '16f':
            return "Seizième de finale";
        case 'gs':
            return "Phase de groupes";
        case 'q':
            return "Qualifications";
        default:
            return "Inconnu";
    }
};