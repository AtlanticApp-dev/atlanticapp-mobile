export interface EnrichedMatch {
    id: string;
    start_time : Date;
    sport : EnrichedSport;
    place : EnrichedPlace;
    status: 'completed' | 'live' | 'incoming' | 'cancelled';
    phase : 'gs' | 'f' | '2f' | '4f' | '8f' | string;
    type : 'head_to_head_match' | 'ranked_match';
    teams : EnrichedMatchTeam[];
    description?: string;
    category : 'mixed' | 'women' | 'men';
    last_update : Date;
}

export interface EnrichedMatchTeam {
    id : string;
    delegation : EnrichedDelegation;
    score? : number | number[];
    ranking? : number;
    last_update : Date;
}

export interface EnrichedEvent {
    id : string;
    title : string;
    place : EnrichedPlace;
    start_time : Date;
    end_time? : Date;
    status : 'incoming' | 'live' | 'completed' | 'cancelled';
    description : string;
    last_update : Date;
}

export interface EnrichedAnnoncement {
    id : string;
    title : string;
    description : string;
    place? : EnrichedPlace;
    time_sent : Date;
    last_update : Date;
}

export interface EnrichedRanking {
    id : string;
    title : string;
    sport : EnrichedSport;
    category : 'mixed' | 'female' | 'male';
    ranking : EnrichedHead2HeadRankingTeam[] | EnrichedRankedRankingTeam[];
    last_update : Date;
}

export interface EnrichedGeneralRanking {
    show_ranking : boolean;
    delegations_ranking : EnrichedDelegation[];
    last_update : Date;
}

export interface EnrichedHead2HeadRankingTeam {
    team : EnrichedTeam;
    delegation : EnrichedDelegation;
    points : number;
    played : number;
    wins : number;
    losses : number;
    draws : number;
    goalsFor : number;
    goalsAgainst : number;
}

export interface EnrichedRankedRankingTeam {
    team : EnrichedTeam;
    delegation : EnrichedDelegation;
}

export interface ErichedGroup {
    team : EnrichedTeam;
    sport : EnrichedSport;
    category : string;
    description : string;
    group_no : number;
    teams : EnrichedTeam[];
    last_update : Date;
}

export interface EnrichedDelegation {
    id : string;
    title : string;
    image : string;
    //color : string;
}

export interface EnrichedTeam {
    id : string;
    name : string;
    sport : EnrichedSport;
    category : 'mixed' | 'female' | 'male';
    delegation : EnrichedDelegation;
}

export interface EnrichedSport {
    id : string;
    title : string;
    ranking_category : 'score' | 'rank';
    image : string;
    categories : EnrichedCategory[];
}

export interface EnrichedCategory {
    id : string;
    description : 'Mixte' | 'Masculin' | 'Féminin';
    title : string;
    title_short : string;
}

export interface EnrichedPlace {
    id: string;
    description: string;
    kind: string;
    position: [number, number];
    sports: EnrichedSport[];
    title: string;
}

export interface EnrichedUser {
    id : string;
    anonymous : boolean;
    created_at : Date;
    email : string;
    fcm_token : string;
    last_login : Date;
    platform : string;
    supported_delegation : EnrichedDelegation;
    followed_sports : EnrichedSport[];
}