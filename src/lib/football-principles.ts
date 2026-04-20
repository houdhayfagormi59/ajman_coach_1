// =============================================
// FOOTBALL PRINCIPLES — Professional Academy Data
// Based on elite academy methodology (Clairefontaine, La Masia, Ajax)
// =============================================

export interface Principle {
  id: string; name: string; description: string; keyPoints: string[];
  drills: string[]; kpis: string[];
}

export interface PrincipleCategory {
  id: string; title: string; emoji: string; color: string;
  principles: Principle[];
}

export const OFFENSIVE_INDIVIDUAL: PrincipleCategory = {
  id: 'off_ind', title: 'Principes Individuels Offensifs', emoji: '⚡', color: 'from-orange-500 to-amber-500',
  principles: [
    { id: 'control', name: 'Contrôle orienté', description: 'Première touche directionnelle pour éliminer un adversaire ou gagner du temps',
      keyPoints: ['Surface de contact adaptée', 'Orientation du corps', 'Prise d\'info avant réception', 'Protection du ballon'],
      drills: ['Rondo orienté', 'Jeu en triangle contrôle-passe', 'Exercice miroir 1v1'], kpis: ['% contrôles réussis', 'Contrôles vers l\'avant', 'Pertes de balle au contrôle'] },
    { id: 'dribble', name: 'Dribble / Élimination', description: 'Capacité à passer son adversaire direct en 1v1',
      keyPoints: ['Changement de rythme', 'Feintes de corps', 'Utilisation des 2 pieds', 'Timing d\'accélération'],
      drills: ['Parcours dribble + finition', 'Slalom vitesse', '1v1 en zone réduite'], kpis: ['Dribbles réussis/match', '% réussite 1v1', 'Fautes provoquées'] },
    { id: 'pass_ind', name: 'Qualité de passe', description: 'Précision, dosage et timing de la passe',
      keyPoints: ['Passe courte / longue / en profondeur', 'Pied faible', 'Passe dans la course du partenaire', 'Lecture anticipée'],
      drills: ['Passes longues en mouvement', 'Passe et suit', 'Transversales sous pression'], kpis: ['% passes réussies', 'Passes clés/match', 'Passes progressives'] },
    { id: 'finish', name: 'Finition', description: 'Capacité à marquer en situation variée',
      keyPoints: ['Frappe du cou-de-pied', 'Frappe enroulée', 'Tête', 'Sang-froid devant le but'],
      drills: ['Frappe en pivot', 'Centres-tirs', 'Finition 1v1 GK', 'Frappes de loin'], kpis: ['xG vs buts réels', '% cadrage', 'Buts/match'] },
    { id: 'movement', name: 'Appels / Démarquage', description: 'Capacité à se rendre disponible et créer des espaces',
      keyPoints: ['Appel en profondeur', 'Décrochage', 'Course croisée', 'Appel-contre-appel'],
      drills: ['Jeu de position 5v2', 'Appels coordonnés 3v2', 'Circuit offensif'], kpis: ['Courses en profondeur', 'Passes reçues en zone 14', 'Espaces créés'] },
  ]
};

export const OFFENSIVE_COLLECTIVE: PrincipleCategory = {
  id: 'off_col', title: 'Principes Collectifs Offensifs', emoji: '🎯', color: 'from-blue-500 to-cyan-500',
  principles: [
    { id: 'possession', name: 'Conservation du ballon', description: 'Garder la possession pour contrôler le tempo du match',
      keyPoints: ['Triangulation', 'Jeu à 1-2 touches', 'Utilisation du gardien', 'Circulation rapide'],
      drills: ['Rondo 6v2', 'Possession 7v7+GK', 'Jeu positionnel'], kpis: ['% possession', 'Passes/séquence', 'Récupération haute'] },
    { id: 'width_depth', name: 'Largeur et profondeur', description: 'Écarter et étirer le bloc adverse pour créer des espaces',
      keyPoints: ['Occupation des couloirs', 'Écartement du jeu', 'Profondeur des attaquants', 'Jeu entre les lignes'],
      drills: ['Jeu 11v11 sur grand terrain', 'Exercice d\'occupation de zones', 'Attaque placée'], kpis: ['Centres tentés', 'Passes entre les lignes', 'Possession en zone adverse'] },
    { id: 'combination', name: 'Jeu combiné', description: 'Enchaînements collectifs pour désorganiser la défense',
      keyPoints: ['1-2 muraux', 'Combinaison 3ème homme', 'Dédoublement', 'Permutation'],
      drills: ['Circuit offensif 4 stations', 'Combinaisons ailier-latéral', 'Jeu en losange'], kpis: ['Buts sur combinaisons', 'Passes décisives', 'Occasions créées'] },
    { id: 'progression', name: 'Progression du jeu', description: 'Avancer le ballon vers le but adverse de manière structurée',
      keyPoints: ['Relance courte/longue', 'Jeu intérieur/extérieur', 'Changement de côté', 'Verticalité'],
      drills: ['Sortie de balle sous pression', 'Progression 4-3-3', 'Phase de construction'], kpis: ['Passes progressives', 'Touches en zone avancée', 'Entrées dans le dernier tiers'] },
  ]
};

export const DEFENSIVE_INDIVIDUAL: PrincipleCategory = {
  id: 'def_ind', title: 'Principes Individuels Défensifs', emoji: '🛡️', color: 'from-red-500 to-rose-600',
  principles: [
    { id: 'tackle', name: 'Duel / Tacle', description: 'Capacité à gagner les duels et récupérer le ballon',
      keyPoints: ['Timing du tacle', 'Duel épaule', 'Duel aérien', 'Engagement physique'],
      drills: ['1v1 défensif', 'Exercice de tacle glissé', 'Duels aériens croisés'], kpis: ['% duels gagnés', 'Tacles réussis/match', 'Interceptions'] },
    { id: 'marking', name: 'Marquage', description: 'Suivre et neutraliser un adversaire direct',
      keyPoints: ['Marquage individuel', 'Marquage de zone', 'Distance de marquage', 'Orientation du corps'],
      drills: ['Exercice de suivi d\'homme', 'Défense en zone', 'Marquage sur corners'], kpis: ['Passes adverses bloquées', 'Couvertures réussies', 'Fautes commises'] },
    { id: 'anticipation', name: 'Anticipation / Interception', description: 'Lire le jeu pour couper les lignes de passe',
      keyPoints: ['Lecture du jeu', 'Positionnement en interception', 'Timing de sortie', 'Lecture des yeux du porteur'],
      drills: ['Jeu de lecture défensive', 'Interceptions en 4v4', 'Exercice de pressing intelligent'], kpis: ['Interceptions/match', 'Récupérations de balle', 'Ballons récupérés dans les 30m'] },
  ]
};

export const DEFENSIVE_COLLECTIVE: PrincipleCategory = {
  id: 'def_col', title: 'Principes Collectifs Défensifs', emoji: '🏰', color: 'from-purple-500 to-indigo-600',
  principles: [
    { id: 'pressing', name: 'Pressing', description: 'Pression collective pour récupérer le ballon haut',
      keyPoints: ['Déclencheur de pressing', 'Pressing coordonné', 'Orientation du pressing', 'Couverture du pressing'],
      drills: ['Pressing en 6v4', 'Exercice de déclenchement', 'Match dirigé pressing haut'], kpis: ['PPDA', 'Récupérations hautes', 'Temps moyen de récupération'] },
    { id: 'compactness', name: 'Compacité / Bloc', description: 'Garder les lignes serrées pour réduire les espaces',
      keyPoints: ['Distance inter-ligne', 'Coulissement latéral', 'Bloc bas/moyen/haut', 'Synchronisation'],
      drills: ['Exercice de bloc 4-4 coulissant', 'Compacité en 11v11', 'Défense en zone réduite'], kpis: ['Distance entre lignes', 'Tirs adverses concédés', 'xGA'] },
    { id: 'cover', name: 'Couverture / Entraide', description: 'S\'entraider défensivement pour éviter les surnombres',
      keyPoints: ['Couverture du partenaire', 'Prise en charge', 'Communication', 'Basculement défensif'],
      drills: ['2v2 avec couverture', 'Exercice de permutation défensive', 'Jeu en infériorité'], kpis: ['Couvertures réussies', 'Duels 2v1 gérés', 'Clean sheets'] },
  ]
};

export const TRANSITION_OFFENSIVE: PrincipleCategory = {
  id: 'trans_off', title: 'Transition Offensive', emoji: '⚡', color: 'from-green-500 to-emerald-600',
  principles: [
    { id: 'counter_attack', name: 'Contre-attaque', description: 'Exploiter les espaces laissés par l\'adversaire après récupération',
      keyPoints: ['1ère passe vers l\'avant', 'Courses en profondeur rapides', 'Surnombre rapide', 'Verticalité immédiate'],
      drills: ['Transition 3v2', 'Contre-attaque 5v4', 'Exercice récupération-finition'], kpis: ['Buts en transition', 'Temps récup → tir', 'Contre-attaques/match'] },
    { id: 'restart_speed', name: 'Vitesse de relance', description: 'Rapidité de la remise en jeu après récupération',
      keyPoints: ['1ère touche orientée vers l\'avant', 'Soutien immédiat', 'Appels simultanés', 'Lecture de la désorganisation adverse'],
      drills: ['Jeu de transition 6v6', 'Restart rapide', 'Match avec bonus transition'], kpis: ['Touches en 5 secondes après récup', 'Passes progressives post-récup', 'xG en transition'] },
  ]
};

export const TRANSITION_DEFENSIVE: PrincipleCategory = {
  id: 'trans_def', title: 'Transition Défensive', emoji: '🔄', color: 'from-yellow-500 to-orange-600',
  principles: [
    { id: 'gegenpressing', name: 'Contre-pressing (Gegenpressing)', description: 'Récupérer immédiatement le ballon après la perte',
      keyPoints: ['Réaction immédiate (3 secondes)', 'Encerclement du porteur', 'Orientation vers le ballon', 'Faute tactique si nécessaire'],
      drills: ['Rondo avec contre-pressing', 'Exercice 5v5 récupération immédiate', 'Pressing après perte dirigé'], kpis: ['Récupérations < 5 sec', 'PPDA après perte', 'Contre-pressing réussi %'] },
    { id: 'fall_back', name: 'Repli défensif', description: 'Revenir rapidement en position défensive',
      keyPoints: ['Course vers le but', 'Priorité à l\'axe', 'Communication', 'Ralentir la progression adverse'],
      drills: ['Course de repli + défense', 'Transition 3v3 repli', 'Match dirigé repli rapide'], kpis: ['Temps de repli moyen', 'Sprints défensifs', 'Tirs concédés en transition'] },
  ]
};

export const SET_PIECES: PrincipleCategory = {
  id: 'set_pieces', title: 'Coups de Pied Arrêtés', emoji: '🎯', color: 'from-teal-500 to-cyan-600',
  principles: [
    { id: 'corners_off', name: 'Corners offensifs', description: 'Stratégies sur corners entrants et sortants',
      keyPoints: ['Courses coordonnées', 'Bloc de marquage', 'Corner court', 'Zones de frappe'],
      drills: ['Exercice corners avec cibles', 'Corners 11v11 à thème', 'Travail de timing de course'], kpis: ['Buts sur corners', 'Tirs cadrés sur corners', '% corners dangereux'] },
    { id: 'freekick_off', name: 'Coups francs offensifs', description: 'Routines de coups francs directs et indirects',
      keyPoints: ['Frappe directe', 'Combinaison sur CF', 'Mur adverse', 'Lecture du GK'],
      drills: ['Frappe sur mur', 'Combinaison CF 2 joueurs', 'Frappe enroulée à 25m'], kpis: ['Buts sur CF', '% cadrés', 'Occasions créées'] },
    { id: 'corners_def', name: 'Corners défensifs', description: 'Organisation défensive sur les corners adverses',
      keyPoints: ['Marquage homme/zone', 'Joueur au 1er poteau', 'Couverture au 2ème poteau', 'Sortie de balle'],
      drills: ['Défense sur corner en zone', 'Marquage individuel sur corner', 'Sortie de balle après dégagement'], kpis: ['Buts concédés sur corner', 'Dégagements/corner', '% duels aériens gagnés'] },
    { id: 'penalty', name: 'Penalties', description: 'Préparation aux tirs au but',
      keyPoints: ['Choix du côté', 'Course d\'élan', 'Lecture du gardien', 'Sang-froid'],
      drills: ['Séance de penalties sous pression', 'Analyse vidéo GK adverses', 'Penalties en compétition interne'], kpis: ['% réussite', 'Corners/côté choisi', 'Penalties arrêtés (GK)'] },
  ]
};

export const ALL_CATEGORIES: PrincipleCategory[] = [
  OFFENSIVE_INDIVIDUAL, OFFENSIVE_COLLECTIVE,
  DEFENSIVE_INDIVIDUAL, DEFENSIVE_COLLECTIVE,
  TRANSITION_OFFENSIVE, TRANSITION_DEFENSIVE,
  SET_PIECES,
];

// Player position-specific technical behaviors to work on
export const POSITION_BEHAVIORS: Record<string, { techniques: string[]; tactical: string[]; physical: string[] }> = {
  GK: {
    techniques: ['Plongeons latéraux', 'Jeu au pied (relance courte/longue)', 'Sorties aériennes', '1v1 face à l\'attaquant', 'Distribution rapide', 'Placement sur la ligne'],
    tactical: ['Lecture des trajectoires', 'Communication avec la défense', 'Positionnement sur CPA', 'Gestion de la profondeur', 'Organisation du mur'],
    physical: ['Explosivité', 'Souplesse', 'Réactivité', 'Détente verticale', 'Endurance spécifique GK'],
  },
  DEF: {
    techniques: ['Tacle glissé et debout', 'Relance propre sous pression', 'Jeu de tête défensif', 'Passes longues', 'Dégagement', 'Intervention en retard'],
    tactical: ['Ligne défensive / hors-jeu', 'Couverture mutuelle', 'Marquage de zone', 'Lecture des appels', 'Basculement défensif', 'Anticipation'],
    physical: ['Vitesse de course', 'Force dans les duels', 'Endurance', 'Agilité', 'Puissance aérienne'],
  },
  MID: {
    techniques: ['Contrôle orienté', 'Passes courtes/longues', 'Frappe de loin', 'Dribble court', 'Conduite de balle', 'Vision de jeu'],
    tactical: ['Positionnement entre les lignes', 'Pressing intelligent', 'Couverture défensive', 'Jeu en triangle', 'Tempo du jeu', 'Déclenchement de pressing'],
    physical: ['Endurance aérobie', 'Répétition de sprints', 'Résistance aux duels', 'Agilité avec ballon', 'Capacité de récupération'],
  },
  FWD: {
    techniques: ['Finition (1ère intention)', 'Jeu dos au but', 'Appels en profondeur', 'Dribble à haute vitesse', 'Tir de loin', 'Jeu de tête offensif'],
    tactical: ['Démarquage', 'Appel-contre-appel', 'Pressing du GK/DEF', 'Jeu de pivot', 'Course croisée', 'Timing des appels'],
    physical: ['Vitesse pure', 'Accélération', 'Puissance de frappe', 'Détente', 'Capacité à répéter les sprints'],
  },
};

// Team style analysis based on performance data
export function analyzeTeamStyle(performances: any[], players: any[]) {
  if (!performances.length) return null;

  const totalGoals = performances.reduce((s: number, p: any) => s + (p.goals || 0), 0);
  const totalAssists = performances.reduce((s: number, p: any) => s + (p.assists || 0), 0);
  const avgPossession = performances.reduce((s: number, p: any) => s + (p.passes_completed || 0), 0) / performances.length;
  const totalTackles = performances.reduce((s: number, p: any) => s + (p.tackles || 0), 0);
  const avgPassAcc = performances.reduce((s: number, p: any) => {
    const att = p.passes_attempted || 1;
    return s + ((p.passes_completed || 0) / att * 100);
  }, 0) / performances.length;

  const goalsPerMatch = totalGoals / performances.length;
  const tacklesPerMatch = totalTackles / performances.length;

  let style = 'Équilibré';
  let styleDesc = '';
  if (avgPassAcc > 80 && avgPossession > 30) { style = 'Possession'; styleDesc = 'Jeu de possession dominant avec construction patiente depuis l\'arrière.'; }
  else if (goalsPerMatch > 2 && tacklesPerMatch < 15) { style = 'Offensif'; styleDesc = 'Approche résolument offensive avec recherche constante du but.'; }
  else if (tacklesPerMatch > 20) { style = 'Pressing haut'; styleDesc = 'Jeu intense basé sur la récupération haute et les transitions rapides.'; }
  else if (tacklesPerMatch > 15) { style = 'Défensif solide'; styleDesc = 'Organisation défensive rigoureuse avec sorties en contre-attaque.'; }
  else { styleDesc = 'Style équilibré alternant phases de possession et transitions.'; }

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (avgPassAcc > 80) strengths.push('Excellente qualité de passe collective');
  if (goalsPerMatch > 1.5) strengths.push('Efficacité offensive');
  if (tacklesPerMatch > 18) strengths.push('Intensité défensive');
  if (totalAssists / performances.length > 1) strengths.push('Jeu collectif bien huilé');

  if (avgPassAcc < 70) improvements.push('Améliorer la qualité de passe collective');
  if (goalsPerMatch < 0.8) improvements.push('Travailler l\'efficacité devant le but');
  if (tacklesPerMatch < 10) improvements.push('Renforcer l\'engagement défensif');

  return { style, styleDesc, strengths, improvements, goalsPerMatch: +goalsPerMatch.toFixed(1), avgPassAcc: +avgPassAcc.toFixed(0), tacklesPerMatch: +tacklesPerMatch.toFixed(1) };
}
