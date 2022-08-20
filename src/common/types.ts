type ExternalReference = {
    source_name: string,
    description?: string,
    url?: string,
    hashes?: Hashes,
    external_id?: string
}

type Hashes = {
    [hashName: string]: string
}

type KillChainPhase = {
    kill_chain_name: string,
    phase_name: string
}

type GranularMarking = {
    lang?: string,
    marking_ref?: string,
    selectors: string []
}
