import { InvalidPropertyError, isKillChainPhaseArray, isStringArray, MissingPropertyError, OptionalCommonProperties, RequiredCommonProperties, STIXDomainObject } from "./base";

interface AttackPatternProps {
    name: string,
    description?: string,
    aliases?: string,
    kill_chain_phases?: KillChainPhase [],
}

function parseAttackPattern(object: any): void{
    let {name, description, aliases, kill_chain_phases} = object;
    const type = 'attack-pattern';

    if (!name) throw new MissingPropertyError(type, 'name');
    if (typeof name !== 'string') throw new InvalidPropertyError(type, 'name');

    if (description && typeof description !== 'string') throw new InvalidPropertyError(type, 'description');
    if (aliases && !isStringArray(aliases)) throw new InvalidPropertyError(type, 'aliases');
    if (kill_chain_phases && !isKillChainPhaseArray(kill_chain_phases)) throw new InvalidPropertyError(type, 'kill_chain_phases');
}

export class AttackPattern extends STIXDomainObject implements AttackPatternProps {
    name: string;
    description?: string;
    aliases?: string;
    kill_chain_phases?: KillChainPhase[];

    constructor(object: AttackPatternProps & Partial<RequiredCommonProperties> & Partial<OptionalCommonProperties>) {
        super(object, 'attack-pattern');
        parseAttackPattern(object);

        this.name = object.name;
        this.description = object.description;
        this.aliases = object.aliases;
        this.external_references = object.external_references;
        this.kill_chain_phases = object.kill_chain_phases;
    }
}

