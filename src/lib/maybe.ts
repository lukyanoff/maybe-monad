

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

    constructor(type: MaybeType, private _value, guard: any){
    }

    //  Static Methods

    public static justAllowNull<T>(value: T): IMaybe<T>{
        return null!;
    }

    public static nothing<T>(): IMaybe<T>{
        return null!;
    }

    public static nullToMaybe<T>(value: T | nullOrUndefined): IMaybe<T>{
        return null!;
    }

    public static if<T>(test: boolean, value: T | nullOrUndefined): IMaybe<T>{
        return null!;
    } 

    //  Properties

    public get value(): T{
        return null!;
    }

    public get isNothing(): boolean{
        return null!;
    }

    //  Public Methods

    public map<TOut>(selector: (value: T) => TOut | nullOrUndefined): IMaybe<TOut>{
        return null!;
    }

    public mapAllowNull<TOut>(selector: (value: T) => TOut): IMaybe<TOut>{
        return null!;
    }

    public do(action: (value: T) => void): IMaybe<T>{
        return this;
    }

    public elseDo(action: () => void ): IMaybe<T>{
        return this;
    }

    public orElse(value: T | nullOrUndefined): IMaybe<T>{
        return null!;
    }

    public orElseAllowNull(value: T): IMaybe<T>{
        return null!;
    }

    public and<TOut>(f: (value: T) => IMaybe<TOut>): IMaybe<TOut>{
        return null!;
    }

    public or(other: IMaybe<T>): IMaybe<T>{
        return null!;
    }

    public defaultTo<TDefault>(value: TDefault): T | TDefault{
        return null!;
    }

    public filter(predicate: (value: T) => boolean): IMaybe<T>{
        return null!;
    }

    public combine(... rest): IMaybe<any>{
        return null!;
    }

}