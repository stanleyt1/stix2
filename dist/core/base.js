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
exports.STIXDomainObject = exports.isKillChainPhaseArray = exports.isKillChainPhase = exports.isExternalReferenceArray = exports.isExternalReference = exports.isHashes = exports.isUrl = exports.isStringArray = exports.isValidDate = exports.isValidId = exports.InvalidPropertyError = exports.MissingPropertyError = void 0;
var uuid_1 = require("uuid");
var MissingPropertyError = /** @class */ (function (_super) {
    __extends(MissingPropertyError, _super);
    function MissingPropertyError(objectType, missingProperty) {
        return _super.call(this, "".concat(objectType, " is missing required property: '").concat(missingProperty, "'")) || this;
    }
    return MissingPropertyError;
}(Error));
exports.MissingPropertyError = MissingPropertyError;
var InvalidPropertyError = /** @class */ (function (_super) {
    __extends(InvalidPropertyError, _super);
    function InvalidPropertyError(objectType, property) {
        return _super.call(this, "".concat(objectType, " has invalid property: ").concat(property)) || this;
    }
    return InvalidPropertyError;
}(Error));
exports.InvalidPropertyError = InvalidPropertyError;
function isValidId(id, type) {
    var regex = new RegExp("^".concat(type, "--[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"));
    return regex.test(id);
}
exports.isValidId = isValidId;
function isValidDate(date) {
    var regex = new RegExp('^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\\.[0-9]+)?Z$');
    return regex.test(date);
}
exports.isValidDate = isValidDate;
function isStringArray(arr) {
    return Array.isArray(arr) && arr.every(function (element) { return typeof element === 'string'; });
}
exports.isStringArray = isStringArray;
function isUrl(url) {
    var regex = new RegExp('^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$');
    return regex.test(url);
}
exports.isUrl = isUrl;
function isHashes(hashes) {
    return true;
}
exports.isHashes = isHashes;
function isExternalReference(reference) {
    var source_name = reference.source_name, description = reference.description, url = reference.url, hashes = reference.hashes, external_id = reference.external_id;
    if (!source_name || typeof source_name !== 'string')
        return false;
    if (description && typeof description !== 'string')
        return false;
    if (url && !isUrl(url))
        return false;
    if (hashes && !isHashes(hashes))
        return false;
    if (external_id && typeof external_id !== 'string')
        return false;
    return true;
}
exports.isExternalReference = isExternalReference;
function isExternalReferenceArray(references) {
    return Array.isArray(references) && references.every(function (reference) { return isExternalReference(reference); });
}
exports.isExternalReferenceArray = isExternalReferenceArray;
function isKillChainPhase(kill_chain_phase) {
    var kill_chain_name = kill_chain_phase.kill_chain_name, phase_name = kill_chain_phase.phase_name;
    if (!kill_chain_name || typeof kill_chain_name !== 'string')
        return false;
    if (!phase_name || typeof phase_name !== 'string')
        return false;
    return true;
}
exports.isKillChainPhase = isKillChainPhase;
function isKillChainPhaseArray(kill_chain_phases) {
    return Array.isArray(kill_chain_phases) && kill_chain_phases.every(function (kill_chain_phase) { return isKillChainPhase(kill_chain_phase); });
}
exports.isKillChainPhaseArray = isKillChainPhaseArray;
function parseSTIXDomainObject(object, objectType) {
    var type = object.type, id = object.id, spec_version = object.spec_version, created = object.created, modified = object.modified;
    if (!type)
        type = objectType;
    if (!id)
        id = "".concat(objectType, "--").concat((0, uuid_1.v4)());
    if (!spec_version)
        spec_version = '2.1';
    if (!created)
        (new Date()).toISOString();
    if (!modified)
        (new Date()).toISOString();
    if (type !== objectType)
        throw new InvalidPropertyError(objectType, 'type');
    if (!isValidId(id, objectType))
        throw new InvalidPropertyError(objectType, 'id');
    if (spec_version !== '2.1')
        throw new InvalidPropertyError(objectType, 'spec_version');
    if (!isValidDate(created))
        throw new InvalidPropertyError(objectType, 'created');
    if (!isValidDate(modified))
        throw new InvalidPropertyError(objectType, 'modified');
    if ((new Date(modified)).getTime() < (new Date(created)).getTime())
        throw new Error("".concat(objectType, " modified date can not be before created"));
}
var STIXDomainObject = /** @class */ (function () {
    function STIXDomainObject(object, type) {
        parseSTIXDomainObject(object, type);
        this.type = object.type;
        this.id = object.id;
        this.spec_version = object.spec_version;
        this.created = object.created;
        this.modified = object.modified;
    }
    return STIXDomainObject;
}());
exports.STIXDomainObject = STIXDomainObject;
