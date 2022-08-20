# Overview

This library is a Typescript implementation of the offical Python-based [stix2](https://stix2.readthedocs.io/) library, and is based on the STIX [v2.1 spec](https://docs.oasis-open.org/cti/stix/v2.1/os/stix-v2.1-os.html). A lot of the design-principles and structure of the library reflects that of the Python-based stix2 library. There are some additions and changes which make working with STIX data faster.

## Goals

The goals of this library are:

1. To make it as easy as possible to create & consume STIX.
2. To make it hard (if not impossible) to create invalid STIX.

# Design Decisions

## Architecture

Similar to the Python stix2 library, this library is broken up into different 'layers' which provide varying levels of abstraction to the end user:

1. Object Layer (Deals with single STIX Objects)
2. Bundle Layer (Deals with groups of STIX Objects)
3. Enviornment Layer (Deals with all STIX Objects)

### Object Layer

At the lowest level is the Object Layer which defines the actual stix2 object (SDO's, SROS's, etc.).

### Bundle Layer (To be Implemented)

At the next layer up we have the Bundle Layer which provides a level of abstraction and deals with the creation of bundles of STIX. There are 3 kinds of bundles supported: light, medium, heavy.

### Enviornment Layer (To be Implemented)

At the highest level we have the Enviornment Layer. The purpose of this layer is to deal with all the STIX objects you have collected. This layer is usefull for looking at all of your data in a big picture.

## Validation

When working with the [Object Layer](#object-layer) there is a lot that can go wrong. To stick to our [goal](#goals) of making the process of emitting invalid STIX impossible, this library is written to aid both the creation and consumption of stix.

**Creation**: When creating STIX in code it is easy to forget object properties or mistakengly create invlaid objects. By using Typescript we can get better type-hints and errors at compile-time. This means that even before we run our code, the compiler can tell us if an object is valid & adheres to the spec.

**Consumption**: Often we don't know what kind of data we are parsing and consuming invalid STIX can hurt us at runtime. Every STIX object defined in the Object Layer can accept any input to its constructor. If the input is valid, all is well, however, if anything goes awry, the constructor will throw an error explaining where the object deviates from the spec. This allows us to always enforce that existing objects are valid, as well as parse new objects to be valid.

## Why Typescript?

The rationale behind creating a Typescript-based stix2 library was to allow for stricter type-checking & validation when using STIX - mainly on the web.

The library is written so as to allow type-checking at both compile-time and run-time. This makes it easy for developers to produce valid STIX with compile-time checking and type hints, as well as consume valid STIX with type-checking at runtime.

This library does not use JSON schema or ajv to impelement runtime type-checking with Tyepscript. The process is done manually to minimize package size as well as enforce stricter type checking.
