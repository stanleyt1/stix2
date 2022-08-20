import {v4 as uuidv4} from 'uuid';

export class MissingPropertyError extends Error {
    constructor(objectType: string, missingProperty: string) {
        super(`${objectType} is missing required property: \'${missingProperty}\'`);
    }
}

export class InvalidPropertyError extends Error {
    constructor(objectType: string, property: string) {
        super(`${objectType} has invalid property: ${property}`);
    }
}

export function isValidId(id: any, type: string): id is string {
    const regex: RegExp = new RegExp(`^${type}--[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$`);
    return regex.test(id);
}

export function isValidDate(date: any): date is string {
    const regex: RegExp = new RegExp('^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\\.[0-9]+)?Z$');
    return regex.test(date);
}

export function isStringArray(arr: any): arr is string [] {
    return Array.isArray(arr) && arr.every(element => typeof element === 'string');
}

export function isUrl(url: any): url is string {
    const regex: RegExp = new RegExp('^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$');
    return regex.test(url);
}

export function isHashes(hashes: any): hashes is Hashes {
    if (typeof hashes !== 'object') return false;
    if (Object.keys(hashes).some(hash_name => typeof hash_name !== 'string')) return false;
    if (Object.values(hashes).some(pattern => typeof pattern !== 'string')) return false;

    return true;
}

export function isExternalReference(reference: any): reference is ExternalReference {
    let {source_name, description, url, hashes, external_id} = reference;
    
    if (!source_name || typeof source_name !== 'string') return false;
    if (description && typeof description !== 'string') return false;
    if (url && !isUrl(url)) return false;
    if (hashes && !isHashes(hashes)) return false;
    if (external_id && typeof external_id !== 'string') return false;

    return true;
}

export function isExternalReferenceArray(references: any): references is ExternalReference [] {
    return Array.isArray(references) && references.every(reference => isExternalReference(reference));
}

export function isKillChainPhase(kill_chain_phase: any): kill_chain_phase is KillChainPhase {
    let {kill_chain_name, phase_name} = kill_chain_phase;

    if (!kill_chain_name || typeof kill_chain_name !== 'string') return false;
    if (!phase_name || typeof phase_name !== 'string') return false;

    return true;
}

export function isKillChainPhaseArray(kill_chain_phases: any): kill_chain_phases is KillChainPhase [] {
    return Array.isArray(kill_chain_phases) && kill_chain_phases.every(kill_chain_phase => isKillChainPhase(kill_chain_phase));
} 


export function isObjectMarkingRefs(object_marking_refs: any): object_marking_refs is string [] {    
    if (!isStringArray(object_marking_refs)) return false;
    if (object_marking_refs.some(ref => !isValidId(ref, 'marking-definition'))) return false;

    return true;
}

export function isValidSelector(selector: string, object: any): boolean {
    let paths = selector.split('.');
    const regex: RegExp = new RegExp('^\[[0-9]+\]$');

    // strip brackets from list selectors
    paths = paths.map(path => {
        if (regex.test(path)) {
            return path.substring(1, path.length-1)
        } else {
            return path;
        }
    })

    if (paths.length === 0) return false;

    let head = object;

    for (const path of paths) {
        head = head[path];
        if (!head) return false;
    }

    return true;
}

export function isGranularMarkings(granular_markings: any, object: any): granular_markings is GranularMarking {
    let {lang, marking_ref, selectors} = granular_markings;
    
    if ((!lang && !marking_ref) || (lang && marking_ref)) return false;
    if (lang && typeof lang !== 'string') return false;
    if (marking_ref && !isValidId(marking_ref, 'marking-definition')) return false;

    if (!isStringArray(selectors)) return false;
    if (selectors.some(selector => !isValidSelector(selector, object))) return false;

    return true;

}

export interface RequiredCommonProperties {
    type: string,
    id: string,
    spec_version: string,
    created: string,
    modified: string,
}

export interface OptionalCommonProperties {
    created_by_ref: string,
    revoked: boolean,
    labels: string [],
    confidence: number,
    lang: string,
    external_references: ExternalReference [],
    object_marking_refs: string [],
    granular_markings: GranularMarking [],
}

function parseSTIXDomainObject(object: any, objectType: string): void {
    let {
        type,
        id,
        spec_version,
        created,
        modified,
        created_by_ref,
        revoked,
        labels,
        confidence,
        lang,
        external_references,
        object_marking_refs,
        granular_markings
    } = object;
    
    // defaults for common properties
    if (!type) type = objectType;
    if (!id) id = `${objectType}--${uuidv4()}`;
    if (!spec_version) spec_version = '2.1';
    if (!created) (new Date()).toISOString();
    if (!modified) (new Date()).toISOString();

    // parse required properties
    if (type !== objectType) throw new InvalidPropertyError(objectType, 'type');
    if (!isValidId(id, objectType)) throw new InvalidPropertyError(objectType, 'id');
    if (spec_version !== '2.1') throw new InvalidPropertyError(objectType, 'spec_version');
    if (!isValidDate(created)) throw new InvalidPropertyError(objectType, 'created');
    if (!isValidDate(modified)) throw new InvalidPropertyError(objectType, 'modified');
    if ((new Date(modified)).getTime() < (new Date(created)).getTime()) throw new Error(`${objectType} modified date can not be before created date`)

    // parse optional properties if defined
    if (created_by_ref && !isValidId(created_by_ref, 'identity')) throw new InvalidPropertyError(objectType, 'created_by_ref');
    if (revoked && typeof revoked !== 'boolean') throw new InvalidPropertyError(objectType, 'revoked');
    if (labels && !isStringArray(labels)) throw new InvalidPropertyError(objectType, 'labels');
    if (confidence && (typeof confidence !== 'number' || confidence < 0 || confidence > 100)) throw new InvalidPropertyError(objectType, 'confidence');
    if (lang && typeof lang !== 'string') throw new InvalidPropertyError(objectType, 'lang');
    if (external_references && !isExternalReference(external_references)) throw new InvalidPropertyError(objectType, external_references);
    if (object_marking_refs && !isObjectMarkingRefs(object_marking_refs)) throw new InvalidPropertyError(objectType, 'object_marking_refs');
    if (granular_markings && !isGranularMarkings(granular_markings, object)) throw new InvalidPropertyError(objectType, 'granular_markings');

}


export abstract class STIXDomainObject implements RequiredCommonProperties, Partial<OptionalCommonProperties>{
    type: string;
    id: string;
    spec_version: string;
    created: string;
    modified: string;

    created_by_ref?: string;
    revoked?: boolean;
    labels?: string[];
    confidence?: number;
    lang?: string;
    external_references?: ExternalReference[];
    object_marking_refs?: string[];
    granular_markings?: GranularMarking[];

    constructor(object: any, type: string) {
        parseSTIXDomainObject(object, type);

        this.type = object.type;
        this.id = object.id;
        this.spec_version = object.spec_version;
        this.created = object.created;
        this.modified = object.modified;
        
        this.created_by_ref = object.created_by_ref;
        this.revoked = object.revoked;
        this.labels = object.labels;
        this.confidence = object.confidence;
        this.lang = object.lang;
        this.external_references = object.external_references;
        this.object_marking_refs = object.object_marking_refs;
        this.granular_markings = object.granular_markings;
    }

}