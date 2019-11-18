import Ajv from 'ajv';
import _ from 'lodash';

namespace errors {

    /**
     * The base class for all errors thrown by this module.
     * It contains a name, message and custom data that is associated with the error.
     * The layout of the custom data is described in each of the child classes.
     */
    class ConfigError extends Error {
        /**
         * The name of the error.
         */
        public readonly name: string;

        /**
         * The data that is associated with the error.
         */
        public readonly data: any;

        protected constructor(name: string, data: any)  {
            super(`Internal error: '${name}' ${JSON.stringify(data)}`);
            this.name = name;
            this.data = {
                name,
                additional: data
            };
        }
    }

    /**
     * An object could not be validated.
     *
     * The data layout is the following:
     * ```typescript
     * {
     *     messages: [
     *         "<error messages>"
     *     ]
     *     schema: "<the schema that was not met>",
     *     object: "<invalid object>"
     * }
     * ```
     */
    export class InternalObjectValidationError extends ConfigError {
        public constructor(messagesOrErrors: string[] | Ajv.ErrorObject[], schema?: object, object?: any) {
            if (messagesOrErrors.length >= 1) {
                if (typeof messagesOrErrors[0] === 'string') {
                    super('INTERNAL_OBJECT_VALIDATION_ERROR', { messages: messagesOrErrors, schema, object });
                } else {
                    const errorsArray = messagesOrErrors as Ajv.ErrorObject[];
                    const messages = _.filter(_.map(errorsArray, e => e.message), m => m !== undefined);

                    super('INTERNAL_OBJECT_VALIDATION_ERROR', { messages, schema, object });
                }
            } else {
                super('INTERNAL_OBJECT_VALIDATION_ERROR', { messages: [], schema, object });
            }
        }
    }

    /**
     * A config meta file could not be located.
     *
     * The data layout is the following:
     * ```typescript
     * {
     *     messages: [
     *         "<error messages>"
     *     ]
     *     schema: "<the schema that is invalid>"
     * }
     * ```
     */
    export class InternalConfigMetaValidationError extends ConfigError {
        public constructor(messagesOrErrors: string[] | Ajv.ErrorObject[], schema?: object) {
            if (messagesOrErrors.length >= 1) {
                if (typeof messagesOrErrors[0] === 'string') {
                    super('INTERNAL_CONFIG_META_VALIDATION_ERROR', { messages: messagesOrErrors, schema });
                } else {
                    const errorsArray = messagesOrErrors as Ajv.ErrorObject[];
                    const messages = _.filter(_.map(errorsArray, e => e.message), m => m !== undefined);

                    super('INTERNAL_CONFIG_META_VALIDATION_ERROR', { messages, schema });
                }
            } else {
                super('INTERNAL_CONFIG_META_VALIDATION_ERROR', { messages: [], schema });
            }
        }
    }

    /**
     * A config dependency does not exist.
     *
     * The data layout is the following:
     * ```typescript
     * {
     *     dependency: "<the invalid dependency>"
     * }
     * ```
     */
    export class ConfigExtensionError extends ConfigError {
        public constructor(dependency: string) {
            super('CONFIG_EXTENSION_ERROR', { dependency });
        }
    }

    /**
     * A file could not be located.
     *
     * The data layout is the following:
     * ```typescript
     * {
     *     path: "<path to the file>"
     * }
     * ```
     */
    export class FileNotFoundError extends ConfigError {
        public constructor(path: string) {
            super('FILE_NOT_FOUND_ERROR', { path });
        }
    }

    /**
     * An object could not be validated.
     *
     * The data layout is the following:
     * ```typescript
     * {
     *     config: <the configuration that could not be validated>,
     *     error: <an instance of InternalObjectValidationError>
     * }
     * ```
     */
    export class ConfigValidationError extends ConfigError {
        public constructor(config: string, error: InternalObjectValidationError) {
            super('CONFIG_VALIDATION_ERROR', {
                config,
                error
            });
        }
    }

}

export = errors;
