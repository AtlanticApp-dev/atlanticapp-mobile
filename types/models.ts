export interface Match {
    id: string;
    start_date : Date;
    sport_id: string;
    place_id?: string;
    status: 'completed' | 'live' | 'incoming' | 'cancelled';
    phase : 'gs' | 'f' | '2f' | '4f' | '8f' | string;
    type : 'head_to_head_match' | 'ranked_match';
    teams : MatchTeam[];
    description?: string;
    category : 'mixed' | 'female' | 'male';
    last_update : Date;
}

export interface MatchTeam {
    id : string;
    delegation_id : string;
    score? : number | number[];
    ranking? : number;
    last_update : Date;
}

export interface Event {
    id : string;
    title : string;
    place_id? : string;
    start_time : Date;
    end_time? : Date;
    status : 'incoming' | 'live' | 'completed' | 'cancelled';
    description : string;
    last_update : Date;
}

export interface Annoncement {
    id : string;
    title : string;
    description : string;
    place_id? : string;
    time_sent : Date;
    last_update : Date;
}

export interface Ranking {
    id : string;
    sport_id : string;
    category : 'mixed' | 'female' | 'male';
    ranking : Head2HeadRankingTeam[] | RankedRankingTeam[];
    last_update : Date;
}

export interface RawGeneralRanking {
    show_ranking : boolean;
    delegations_ranking : string[];
    last_update : Date;
}

export interface GeneralRanking {
    show_ranking : boolean;
    delegations_ranking : Delegation[];
    last_update : Date;
}

export interface Head2HeadRankingTeam {
    id : string;
    delegation_id : string;
    points : number;
    played : number;
    won : number;
    lost : number;
    draw : number;
    goal_balance : number;
    last_update : Date;
}

export interface RankedRankingTeam {
    id : string;
    delegation_id : string;
    last_update : Date;
}

export interface Group {
    id : string;
    sport_id : string;
    category : string;
    description : string;
    group_no : number;
    teams_id : string[];
    last_update : Date;
}

export interface Delegation {
    id : string;
    title : string;
    image : string;
    //color : string;
}

export interface Team {
    id : string;
    name : string;
    sport_id : string;
    category : 'mixed' | 'female' | 'male';
    delegation_id : string;
}

export interface Sport {
    id : string;
    title : string;
    ranking_category : 'score' | 'rank';
    image : string;
    categories : Category[];
}

export interface Category {
    id : string;
    description : 'Mixte' | 'Masculin' | 'Féminin';
    title : string;
    title_short : string;
}

export interface User {
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