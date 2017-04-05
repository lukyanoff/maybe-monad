

export enum MaybeType {
    "Just",
    "Nothing"
}

export type nullOrUndefined = null | undefined;

export interface IMaybe<T>{

    /**
     * Returns the value of the Maybe.
     * This will throw an error if called on a Nothing Maybe
     * It is recommended to use defaultTo instead so that a default value can be provided for the Nothing case
     */
    readonly value: T;
    /**
     * indicates if this is a Nothing Maybe
     */
    readonly isNothing: boolean;

    /**
     * maps a maybe to another value
     * if the selector function returns null a Nothing Maybe is returned
     * Example: Maybe.nullToMaybe("Hello").map(value => value.length);
     * @param selector 
     */
    map<TOut>(selector: (value: T) => TOut | nullOrUndefined): IMaybe<TOut>;

    /**
     * maps a maybe to another value
     * null and undefined values may be returned from the selector function
     * Example: Maybe.nullToMaybe("Hello").mapAllowNull(value => null);
     * @param selector 
     */
    mapAllowNull<TOut>(selector: (value: T) => TOut): IMaybe<TOut>;

    /**
     * executes a function if the maybe is valid.
     * The function is not executed if the Maybe is Nothing.
     * Example: Maybe.nullToMaybe("Hello world").do(message => console.log(message));
     * @param action 
     */
    do(action: (value: T) => void): IMaybe<T>;

    /**
     * executes a function if the maybe is nothing.
     * The function is not executed if the Maybe is valid
     * Example: Maybe.nullToMaybe(null).elseDo(()) => console.log("no message found"));
     * @param action 
     */
    elseDo(action: () => void ): IMaybe<T>;

    /**
     * Transforms the maybe from a Nothing maybe to a valid maybe with the supplied value
     * Has no effect if the Maybe is valid
     * If value is null or undefined returns a nothing maybe
     * Example: Maybe.nothing<string>().orElse("GoodBye"); (returns maybe with value of 'Goodbye')
     * @param value 
     */
    orElse(value: T | nullOrUndefined): IMaybe<T>;
    /**
     * Transforms the maybe from a Nothing maybe to a valid maybe with the supplied value
     * Has no effect if the Maybe is valid
     * Null or undefined values are permitted
     * Example: Maybe.nothing<string>().orElse(null); (returns maybe with null value)
     * @param value 
     */
    orElseAllowNull(value: T): IMaybe<T>;

    /**
     * Retuns a new Maybe if initial maybe and selector Maybe are valid.
     * If either Maybe is nothing a nothing Maybe is returned
     * Example: Maybe.nullToMaybe(thing.parameterOne).and(paramOneValue => Maybe.nullToMaybe(thing.parameterTwo)) (return maybe with value of arameterTwo)
     * @param selector 
     */
    and<TOut>(f:(value: T) => IMaybe<TOut>): IMaybe<TOut>;
    /**
     * If maybe is nothing return the other maybe;
     * Example: Maybe.nothing<string>().or(Maybe.nullToMaybe("here I am")) (return maybe with value "here I am");
     * @param other 
     */
    or(other: IMaybe<T>): IMaybe<T>;

    /**
     * Returns the value of a maybe whilst safely providing a default value to be used in case the Maybe is nothing.
     * Example: Maybe.nothing<string>().defaultTo("I am the default") (return a string of value "I am the default!")
     * @param defaultValue 
     */
    defaultTo<TDefault>(value: TDefault) : T | TDefault;

    /**
     * turns the Maybe into a nothing maybe if the function evaluates to false
     * Example: Maybe.nullToMaybe("").filter(value => value != "")
     * @param predicate 
     */
    filter(predicate: (value: T) => boolean): IMaybe<T>;
    
    /**
     * Combines multiple Maybes into one Maybe with a value of an array of all the maybe values
     * If any maybe is nothing a Nothing Maybe will be returned
     * Example: Maybe.nullToMaybe("Hello").combine(Maybe.NullToMaybe("World")).do(array => console.log(array[0] + " " + array[1])) (logs "Hello World")
     * @param maybes 
     */
    combine<TOne>(maybeOne: IMaybe<TOne>): IMaybe<[T,TOne]>;
    combine<TOne,TTwo>(maybeOne: IMaybe<TOne>, maybeTwo: IMaybe<TTwo>): IMaybe<[T,TOne,TTwo]>;
    combine<TOne,TTwo,TThree>(maybeOne: IMaybe<TOne>, maybeTwo: IMaybe<TTwo>, maybeThree: IMaybe<TThree>): IMaybe<[T,TOne,TTwo,TThree]>;
    combine<TOne,TTwo,TThree,TFour>(maybeOne: IMaybe<TOne>, maybeTwo: IMaybe<TTwo>, maybeThree: IMaybe<TThree>, maybeFour: IMaybe<TFour>): IMaybe<[T,TOne,TTwo,TThree,TFour]>;
    combine<TOne,TTwo,TThree,TFour,TFive>(maybeOne: IMaybe<TOne>, maybeTwo: IMaybe<TTwo>, maybeThree: IMaybe<TThree>, maybeFour: IMaybe<TFour>, maybeFive: IMaybe<TFive>): IMaybe<[T,TOne,TTwo,TThree,TFour,TFive]>;
}

export class Maybe<T> implements IMaybe<T>{

    private static _guard: any = {};

    //  Constructor

    constructor(private _type: MaybeType, private _value, guard: any){
        if(guard !== Maybe._guard){
            throw new Error("Direct contruction of Maybe not possible. Please use Maybe.just, Maybe.nothing or Maybe.nullToMaybe instead.");
        }
    }

    //  Static Methods

    /**
     * Creates a Maybe of the given value.
     * Values of null and undefined are permitted.
     * Example: var maybe = Maybe.justAllowNull(null);
     * @param value 
     */
    public static justAllowNull<T>(value: T): IMaybe<T>{
        return new Maybe<T>(MaybeType.Just, value, Maybe._guard);
    }

    /**
     * Creates a Nothing Maybe of the given type
     * Example: var maybe = Maybe.nothing<string>();
     */
    public static nothing<T>(): IMaybe<T>{
        return new Maybe<T>(MaybeType.Nothing, undefined, Maybe._guard);
    }

    /**
     * Creates a Maybe with the passed value.
     * If the passed value is null or undefined a Maybe of type Nothing is created.
     * Example: var maybe = Maybe.nullToMaybe("Hello maybe world");
     * @param value 
     */
    public static nullToMaybe<T>(value: T | nullOrUndefined): IMaybe<T>{
        if(value == null){
            return Maybe.nothing<T>();
        }
        return new Maybe<T>(MaybeType.Just, value, Maybe._guard);
    }

    /**
     * Creates a Maybe of the given value if the test is true.
     * If the test is true and null or undefined are passed a Nothing Maybe will be creted
     * If the test is false a Nothing Maybe will be created.
     * Example: var maybe = Maybe.if(someBooleanFunction(),"Function returns true");
     * @param test 
     * @param value 
     */
    public static if<T>(test: boolean, value: T | nullOrUndefined): IMaybe<T>{
        if(!test){
            return Maybe.nothing<T>();
        }
        return Maybe.nullToMaybe(value);
    } 

    //  Properties

    /**
     * Returns the value of the Maybe.
     * This will throw an error if called on a Nothing Maybe
     * It is recommended to use defaultTo instead so that a default value can be provided for the Nothing case
     */
    public get value(): T{
        if(this.isNothing){
            throw new Error("Unable to access value of a nothing Maybe. Use defaultTo instead.");
        }
        return this._value;
    }
    /**
     * indicates if this is a Nothing Maybe
     */
    public get isNothing(): boolean{
        return this._type === MaybeType.Nothing;
    }

    //  Public Methods

    /**
     * maps a maybe to another value
     * if the selector function returns null a Nothing Maybe is returned
     * Example: Maybe.nullToMaybe("Hello").map(value => value.length);
     * @param selector 
     */
    public map<TOut>(selector: (value: T) => TOut | nullOrUndefined): IMaybe<TOut>{
        if(this.isNothing){
            return Maybe.nothing<TOut>();
        }
        return Maybe.nullToMaybe(selector(this._value));
    }

    /**
     * maps a maybe to another value
     * null and undefined values may be returned from the selector function
     * Example: Maybe.nullToMaybe("Hello").mapAllowNull(value => null);
     * @param selector 
     */
    public mapAllowNull<TOut>(selector: (value: T) => TOut): IMaybe<TOut>{
        if(this.isNothing){
            return Maybe.nothing<TOut>();
        }
        return Maybe.justAllowNull(selector(this._value));
    }

    /**
     * executes a function if the maybe is valid.
     * The function is not executed if the Maybe is Nothing.
     * Example: Maybe.nullToMaybe("Hello world").do(message => console.log(message));
     * @param action 
     */
    public do(action: (value: T) => void): IMaybe<T>{
        if(!this.isNothing){
            action(this._value);
        }

        return this;
    }

    /**
     * executes a function if the maybe is nothing.
     * The function is not executed if the Maybe is valid
     * Example: Maybe.nullToMaybe(null).elseDo(()) => console.log("no message found"));
     * @param action 
     */
    public elseDo(action: () => void ): IMaybe<T>{
        if(this.isNothing){
            action();
        }

        return this;
    }

    /**
     * Transforms the maybe from a Nothing maybe to a valid maybe with the supplied value
     * Has no effect if the Maybe is valid
     * If value is null or undefined returns a nothing maybe
     * Example: Maybe.nothing<string>().orElse("GoodBye"); (returns maybe with value of 'Goodbye')
     * @param value 
     */
    public orElse(value: T | nullOrUndefined): IMaybe<T>{
        if(this.isNothing){
            return Maybe.nullToMaybe(value);
        }

        return this;
    }

    /**
     * Transforms the maybe from a Nothing maybe to a valid maybe with the supplied value
     * Has no effect if the Maybe is valid
     * Null or undefined values are permitted
     * Example: Maybe.nothing<string>().orElse(null); (returns maybe with null value)
     * @param value 
     */
    public orElseAllowNull(value: T): IMaybe<T>{
        if(this.isNothing){
            return Maybe.justAllowNull(value);
        }

        return this;
    }

    /**
     * Retuns a new Maybe if initial maybe and selector Maybe are valid.
     * If either Maybe is nothing a nothing Maybe is returned
     * Example: Maybe.nullToMaybe(thing.parameterOne).and(paramOneValue => Maybe.nullToMaybe(thing.parameterTwo)) (return maybe with value of arameterTwo)
     * @param selector 
     */
    public and<TOut>(selector: (value: T) => IMaybe<TOut>): IMaybe<TOut>{
        if(this.isNothing){
            return Maybe.nothing<TOut>();
        }

        return selector(this._value);
    }
    
    /**
     * If maybe is nothing return the other maybe;
     * Example: Maybe.nothing<string>().or(Maybe.nullToMaybe("here I am")) (return maybe with value "here I am");
     * @param other 
     */
    public or(other: IMaybe<T>): IMaybe<T>{
        if(this.isNothing){
            return other;
        }

        return this;
    }

    /**
     * Returns the value of a maybe whilst safely providing a default value to be used in case the Maybe is nothing.
     * Example: Maybe.nothing<string>().defaultTo("I am the default") (return a string of value "I am the default!")
     * @param defaultValue 
     */
    public defaultTo<TDefault>(defaultValue: TDefault): T | TDefault{
        if(this.isNothing){
            return defaultValue;
        }

        return this._value;
    }

    /**
     * turns the Maybe into a nothing maybe if the function evaluates to false
     * Example: Maybe.nullToMaybe("").filter(value => value != "")
     * @param predicate 
     */
    public filter(predicate: (value: T) => boolean): IMaybe<T>{
        if(this.isNothing){
            return this;
        } else if(!predicate(this._value)){
            return Maybe.nothing<T>();
        }

        return this;
    }

    /**
     * Combines multiple Maybes into one Maybe with a value of an array of all the maybe values
     * If any maybe is nothing a Nothing Maybe will be returned
     * Example: Maybe.nullToMaybe("Hello").combine(Maybe.NullToMaybe("World")).do(array => console.log(array[0] + " " + array[1])) (logs "Hello World")
     * @param maybes 
     */
    public combine(... maybes: Maybe<any>[]): IMaybe<any>{
        if(this.isNothing || maybes.some(v => v.isNothing)){
            return Maybe.nothing<any>();
        }

        maybes.unshift(this);

        return Maybe.nullToMaybe(maybes.map(m => m.value));
    }

}