export declare class MissingPropertyError extends Error {
    constructor(objectType: string, missingProperty: string);
}
export declare class InvalidPropertyError extends Error {
    constructor(objectType: string, property: string);
}
interface RequiredCommonProperties {
    type: string;
    id: string;
    spec_version: string;
    created: string;
    modified: string;
}
export declare function isValidId(id: any, type: string): id is string;
export declare function isValidDate(date: any): date is string;
export declare function isStringArray(arr: any): arr is string[];
export declare function isUrl(url: any): url is string;
export declare function isHashes(hashes: any): hashes is Hashes;
export declare function isExternalReference(reference: any): reference is ExternalReference;
export declare function isExternalReferenceArray(references: any): references is ExternalReference[];
export declare function isKillChainPhase(kill_chain_phase: any): kill_chain_phase is KillChainPhase;
export declare function isKillChainPhaseArray(kill_chain_phases: any): kill_chain_phases is KillChainPhase[];
export declare abstract class STIXDomainObject implements RequiredCommonProperties {
    type: string;
    id: string;
    spec_version: string;
    created: string;
    modified: string;
    constructor(object: any, type: string);
}
export {};
