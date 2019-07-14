/* tslint:disable:max-classes-per-file */
import Vue from "vue";
import { createDecorator } from "vue-class-component";

type Constructor<T> = new (...args: any[]) => T;

/**
 * @decorator
 *
 * A decorator to map a in a vuex store stored value to a computed
 * value inside the vue component.
 *
 * @param namespace - the namespace representing a StateModule
 * @param fieldName - a override for the key if the variable is local key is called different
 */
export function VueStateField(namespace: string, fieldName?: string) {
    return createDecorator((options, key) => {
        const keyName = fieldName
            ? namespace.toString() + "/" + fieldName.toString()
            : namespace.toString() + "/" + key.toString();

        (options.computed || (options.computed = {}))[key] = {
            get() {
                return this.$store.getters[keyName];
            },
            set(val) {
                this.$store.commit(keyName, val);
            }
        };
    });
}

/**
 * @decorator
 *
 * A decorator that will automatically convert any class into a State that can be used by
 * Vuex.
 *
 * @StateHandler()
 * export class ExampleState extends State{
 *     static myProperty = "Hello World!";
 *     static firstName = "Hans";
 *     static lastName = "Wurst";
 *
 *     get fullName(){
 *         return this.firstName + " " + this.lastName;
 *     }
 * }
 *
 * A state object with the state property "myProperty" will be created and the getter
 * and mutation (setter) will we automatically created in the "getters" and "mutations"
 * Array.
 * If you need custom getters and mutations you override the by default generated functions with
 * a get/set method. When the get/set function is called 'this' is going to be the current state.
 *
 * If you need special getters, setters, submodules, etc. in the state than you can override
 * everything with {@param options}.
 *
 * @param options - you can override parts the automatically generated module
 *                  Object.assign() will be used to merge the two objects.
 * @param ignoredKeys - These keys will be ignored while generating.
 */
export function StateHandler<T extends State>(
    options?: IModuleOptions,
    ignoredKeys?: string[]
) {
    return <ConstructorOfT extends Constructor<T>>(target: ConstructorOfT) => {
        const state = {
            actions: [],
            getters: [],
            mutations: [],
            namespaced: true,
            state: {}
        };

        /**
         * These keys will be ignored while generating the state properties.
         */
        const IGNORED_KEYS = ["constructor", "name", "length", "prototype"];

        if (ignoredKeys && ignoredKeys.length > 0) {
            for (const key of ignoredKeys) {
                IGNORED_KEYS.push(key);
            }
        }

        for (const key of Object.getOwnPropertyNames(target)) {
            if (IGNORED_KEYS.filter(value => value === key).length === 0) {
                const descriptor = Object.getOwnPropertyDescriptor(target, key);

                if (descriptor.configurable) {
                    if (descriptor.value instanceof Function) {
                        throw new Error(
                            "The property can't be of type Function. This is going to be a" +
                                "Vuex-Actions, but we don't support that yet!"
                        );
                    } else {
                        if (descriptor.value) {
                            state.state[key] = descriptor.value;
                        }

                        if (descriptor.get) {
                            state.getters[key] = (stateP: any) => {
                                const getter = descriptor.get;
                                return getter.call(stateP);
                            };
                        } else {
                            state.getters[key] = (stateP: any) => {
                                return stateP[key];
                            };
                        }

                        if (descriptor.set) {
                            state.mutations[key] = (
                                stateP: any,
                                value: any
                            ) => {
                                const setter = descriptor.set;
                                return setter.call(stateP, value);
                            };
                        } else {
                            state.mutations[key] = (
                                stateP: any,
                                value: any
                            ) => {
                                Vue.set(stateP, key, value);
                            };
                        }
                    }
                }
            }
        }

        return class extends (target as Constructor<any>) {
            public state = options ? Object.assign(state, options) : state;
        } as ConstructorOfT;
    };
}

/**
 * Types for a {@link Vuex.Module}
 *
 * TODO improve/specify
 */
interface IModuleOptions {
    namespaced?: boolean;
    actions?: object;
    modules?: object;
}

/**
 * Simple base class that will store the state.
 *
 * To create a new StateModule, extends this class and add a {@link StateHandler} Decorator.
 *
 * For further instructions fo to {@link StateHandler}
 */
export class State {
    public readonly state: object;
}
