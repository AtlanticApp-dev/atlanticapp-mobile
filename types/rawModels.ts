export interface RawMatch {
    id: string;
    start_time : Date;
    sport_id: string;
    place_id?: string;
    status: 'completed' | 'live' | 'incoming' | 'cancelled';
    phase : 'gs' | 'f' | '2f' | '4f' | '8f' | string;
    type : 'head_to_head_match' | 'ranked_match';
    teams_id : string[];
    description?: string;
    category : 'mixed' | 'women' | 'men';
    last_update : Date;
}

export interface RawMatchTeam {
    id : string;
    delegation_id : string;
    score? : number | number[];
    ranking? : number;
    last_update : Date;
}

export interface RawEvent {
    id : string;
    title : string;
    place_id? : string;
    start_time : Date;
    end_time? : Date;
    status : 'incoming' | 'live' | 'completed' | 'cancelled';
    description : string;
    last_update : Date;
}

export interface RawAnnoncement {
    id : string;
    title : string;
    description : string;
    place_id? : string;
    time_sent : Date;
    last_update : Date;
}

export interface RawRanking {
    id : string;
    title : string;
    sport_id : string;
    category : 'mixed' | 'female' | 'male';
    ranking : RawHead2HeadRankingTeam[] | RawRankedRankingTeam[];
    last_update : Date;
}

export interface RawGeneralRanking {
    show_ranking : boolean;
    delegations_ranking : string[];
    last_update : Date;
}

export interface RawHead2HeadRankingTeam {
    team_id : string;
    delegation_id : string;
    points : number;
    played : number;
    wins : number;
    losses : number;
    draws : number;
    goalsFor : number;
    goalsAgainst : number;
}

export interface RawRankedRankingTeam {
    team_id : string;
    delegation_id : string;
}

export interface RawGroup {
    team_id : string;
    sport_id : string;
    category : string;
    description : string;
    group_no : number;
    teams_id : string[];
    last_update : Date;
}

export interface RawDelegation {
    id : string;
    title : string;
    image : string;
    //color : string;
}

export interface RawTeam {
    id : string;
    name : string;
    sport_id : string;
    category : 'mixed' | 'female' | 'male';
    delegation_id : string;
}

export interface RawSport {
    id : string;
    title : string;
    ranking_category : 'score' | 'rank';
    image : string;
    categories : RawCategory[];
}

export interface RawCategory {
    id : string;
    description : 'Mixte' | 'Masculin' | 'Féminin';
    title : string;
    title_short : string;
}

export interface RawPlace {
    id: string;
    description: string;
    kind: string;
    position: [number, number];
    sports_id_list: string[];
    title: string;
}

export interface RawUser {
    id : string;
    anonymous : boolean;
    created_at : Date;
    email : string;
    fcm_token : string;
    last_login : Date;
    platform : string;
    supported_delegation_id : string;
    followed_sport_ids : string[];
}