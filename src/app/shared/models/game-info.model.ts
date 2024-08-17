export interface IGame{
    gameCode?: string;
    name?: string;
    playerCount?: number;
    queued?: any[];
    active?: boolean;
    // isInvite?: boolean;
    gameRequirements?:IGameRequirements;
    gameRules?: IGameRules;
    leaderboard? :any[];
    owner?: string | null;
    isConnected?: boolean;

}

export interface IGameRequirements{
    isEmail?: boolean;
    emailPattern?: string;
    isId?: boolean;
    idPattern?: string;
    isRadar?: boolean;
    isCustomName?: boolean;
}

export interface IGameRules{}
