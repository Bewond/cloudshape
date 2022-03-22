# Cloudshape ☁️

Cloudshape enables cloud infrastructure definition through code. Builds on [AWS CDK](https://aws.amazon.com/cdk/), provides an additional layer of abstraction and a set of ready-to-use services.

A Cloudshape project consists of defining the *infrastructure* through a series of constructs and building *applications* that use the resources provided by the infrastructure.

| Package name | Description | Type
|--|--|--|
| __[@cloudshape/constructs](https://github.com/Bewond/cloudshape/tree/main/packages/constructs)__ | CDK constructs | Infrastructure |
| __[@cloudshape-services/**](https://github.com/Bewond/cloudshape/tree/main/packages/services)__ | Collection of services | Infrastructure |
| __[@cloudshape/templates](https://github.com/Bewond/cloudshape/tree/main/packages/templates)__ | Integration templates | Application |
| __[@cloudshape/core](https://github.com/Bewond/cloudshape/tree/main/packages/core)__ | Shared functions | Application |

## Constructs

[Constructs](https://github.com/Bewond/cloudshape/tree/main/packages/constructs) are the basic building blocks of Cloudshape. A construct can represent a single AWS resource or it can be a higher-level abstraction consisting of multiple AWS related resources. They are primarily designed for building serverless apps and have reasonable defaults and security settings.

List and documentation of available constructs:

- [API](https://github.com/Bewond/cloudshape/tree/main/packages/constructs#API)
- [Auth](https://github.com/Bewond/cloudshape/tree/main/packages/constructs#Auth)
- [Function](https://github.com/Bewond/cloudshape/tree/main/packages/constructs#Function)
- [Output](https://github.com/Bewond/cloudshape/tree/main/packages/constructs#Output)


## Services

[Services](https://github.com/Bewond/cloudshape/tree/main/packages/services) are constructs that provide complete, production-ready implementations for common functionality that can be useful in several projects. They define the infrastructure and application logic for a specific use case and usually provide API endpoints for client-side use.

Services are divided into distinct packages so that only the necessary ones can be installed:

- [@cloudshape-services/hello](https://github.com/Bewond/cloudshape/tree/main/packages/services/hello)
- [@cloudshape-services/users](https://github.com/Bewond/cloudshape/tree/main/packages/services/users)

## Templates

Templates are a collection of solutions for integration with different AWS or external services.

There are currently over 2+ integration templates available:

- [Amazon Cognito](https://github.com/Bewond/cloudshape/tree/main/packages/templates#Amazon%Cognito)
- [Logtail](https://github.com/Bewond/cloudshape/tree/main/packages/templates#Logtail)

## Core

[Core](https://github.com/Bewond/cloudshape/tree/main/packages/core) package contains some functions that are primarily useful for building AWS Lambda-based serverless applications.

# Getting Started ⚙️

TODO

# Contributing ❤️

TODO

# License

© 2022 Bewond Software - Released under [Apache License 2.0](https://github.com/Bewond/cloudshape/blob/main/LICENSE)
