"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = require("./base");
function parseAttackPattern(object) {
    var name = object.name, description = object.description, aliases = object.aliases, external_references = object.external_references, kill_chain_phases = object.kill_chain_phases;
    var type = 'attack-pattern';
    if (!name)
        throw new base_1.MissingPropertyError(type, 'name');
    if (typeof name !== 'string')
        throw new base_1.InvalidPropertyError(type, 'name');
    if (description && typeof description !== 'string')
        throw new base_1.InvalidPropertyError(type, 'description');
    if (aliases && !(0, base_1.isStringArray)(aliases))
        throw new base_1.InvalidPropertyError(type, 'aliases');
    if (external_references && !(0, base_1.isExternalReferenceArray)(external_references))
        throw new base_1.InvalidPropertyError(type, 'external_references');
    if (kill_chain_phases && !(0, base_1.isKillChainPhaseArray)(kill_chain_phases))
        throw new base_1.InvalidPropertyError(type, 'kill_chain_phases');
}
var AttackPattern = /** @class */ (function (_super) {
    __extends(AttackPattern, _super);
    function AttackPattern(object) {
        var _this = _super.call(this, object, 'attack-pattern') || this;
        parseAttackPattern(object);
        _this.name = object.name;
        _this.description = object.description;
        _this.aliases = object.aliases;
        _this.external_references = object.external_references;
        _this.kill_chain_phases = object.kill_chain_phases;
        return _this;
    }
    return AttackPattern;
}(base_1.STIXDomainObject));
