declare type ExternalReference = {
    source_name: string;
    description?: string;
    url?: string;
    hashes?: Hashes;
    external_id?: string;
};
declare type Hashes = {
    [hashName: string]: string;
};
declare type KillChainPhase = {
    kill_chain_name: string;
    phase_name: string;
};
