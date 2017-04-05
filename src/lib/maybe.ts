

export enum MaybeType {
    "Just",
    "Nothing"
}

export type nullOrUndefined = null | undefined;

export interface IMaybe<T>{

    readonly value: T;
    readonly isNothing: boolean;

    map<TOut>(selector: (value: T) => TOut | nullOrUndefined): IMaybe<TOut>;

    mapAllowNull<TOut>(selector: (value: T) => TOut): IMaybe<TOut>;

    do(action: (value: T) => void): IMaybe<T>;
    elseDo(action: () => void ): IMaybe<T>;

    orElse(value: T | nullOrUndefined): IMaybe<T>;
    orElseAllowNull(value: T): IMaybe<T>;

    and<TOut>(f:(value: T) => IMaybe<TOut>): IMaybe<TOut>;
    or(other: IMaybe<T>): IMaybe<T>

    filter(predicate: (value: T) => boolean): IMaybe<T>

    defaultTo<TDefault>(value: TDefault) : T | TDefault;

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

    public static justAllowNull<T>(value: T): IMaybe<T>{
        return new Maybe<T>(MaybeType.Just, value, Maybe._guard);
    }

    public static nothing<T>(): IMaybe<T>{
        return new Maybe<T>(MaybeType.Nothing, undefined, Maybe._guard);
    }

    public static nullToMaybe<T>(value: T | nullOrUndefined): IMaybe<T>{
        if(value == null){
            return Maybe.nothing<T>();
        }
        return new Maybe<T>(MaybeType.Just, value, Maybe._guard);
    }

    public static if<T>(test: boolean, value: T | nullOrUndefined): IMaybe<T>{
        if(!test){
            return Maybe.nothing<T>();
        }
        return Maybe.nullToMaybe(value);
    } 

    //  Properties

    public get value(): T{
        if(this.isNothing){
            throw new Error("Unable to access value of a nothing Maybe. Use defaultTo instead.");
        }
        return this._value;
    }

    public get isNothing(): boolean{
        return this._type === MaybeType.Nothing;
    }

    //  Public Methods

    public map<TOut>(selector: (value: T) => TOut | nullOrUndefined): IMaybe<TOut>{
        if(this.isNothing){
            return Maybe.nothing<TOut>();
        }
        return Maybe.nullToMaybe(selector(this._value));
    }

    public mapAllowNull<TOut>(selector: (value: T) => TOut): IMaybe<TOut>{
        if(this.isNothing){
            return Maybe.nothing<TOut>();
        }
        return Maybe.justAllowNull(selector(this._value));
    }

    public do(action: (value: T) => void): IMaybe<T>{
        if(!this.isNothing){
            action(this._value);
        }

        return this;
    }

    public elseDo(action: () => void ): IMaybe<T>{
        if(this.isNothing){
            action();
        }

        return this;
    }

    public orElse(value: T | nullOrUndefined): IMaybe<T>{
        if(this.isNothing){
            return Maybe.nullToMaybe(value);
        }

        return this;
    }

    public orElseAllowNull(value: T): IMaybe<T>{
        if(this.isNothing){
            return Maybe.justAllowNull(value);
        }

        return this;
    }

    public and<TOut>(selector: (value: T) => IMaybe<TOut>): IMaybe<TOut>{
        if(this.isNothing){
            return Maybe.nothing<TOut>();
        }

        return selector(this._value);
    }

    public or(other: IMaybe<T>): IMaybe<T>{
        if(this.isNothing){
            return other;
        }

        return this;
    }

    public defaultTo<TDefault>(defaultValue: TDefault): T | TDefault{
        if(this.isNothing){
            return defaultValue;
        }

        return this._value;
    }

    public filter(predicate: (value: T) => boolean): IMaybe<T>{
        if(this.isNothing){
            return this;
        } else if(!predicate(this._value)){
            return Maybe.nothing<T>();
        }

        return this;
    }

    public combine(... maybes: Maybe<any>[]): IMaybe<any>{
        if(this.isNothing || maybes.some(v => v.isNothing)){
            return Maybe.nothing<any>();
        }

        maybes.unshift(this);

        return Maybe.nullToMaybe(maybes.map(m => m.value));
    }

}