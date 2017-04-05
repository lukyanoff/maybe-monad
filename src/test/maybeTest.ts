

import { Maybe, MaybeType, IMaybe } from "../index";

describe("Maybe", () => {

    function returnUnknownType(value: string | undefined | null): string | undefined | null {
        return value;
    }

    //  Maybe creation tests

    describe("construction", () => {

        const expectedConstructionError = "Direct contruction of Maybe not possible. Please use Maybe.just, Maybe.nothing or Maybe.nullToMaybe instead.";

        it("should not be possible with undefined arguments", () => {
            expect(() => new Maybe(undefined!, undefined, undefined))
                .toThrowError(expectedConstructionError);
        });

        it("should not be possible when passing a MaybeType of Nothing", () => {
            expect(() => new Maybe(MaybeType.Nothing, undefined, undefined))
                .toThrowError(expectedConstructionError);
        });

        it("should not be possible when passing a MaybeType of Just", () => {
            expect(() => new Maybe(MaybeType.Just, undefined, undefined))
                .toThrowError(expectedConstructionError);
        });

        it("should not be possible when passing a MaybeType of Just with a value", () => {
            expect(() => new Maybe(MaybeType.Just, "sample value", undefined))
                .toThrowError(expectedConstructionError);
        });

        it("should not be possible when passing a MaybeType of Just with a value and a guard object", () => {
            expect(() => new Maybe(MaybeType.Just, "sample value", {}))
                .toThrowError(expectedConstructionError);
        });

    });

    describe("justAllowNull", () => {

        it("should construct a valid Maybe with the given value", () => {
            const maybe = Maybe.justAllowNull(returnUnknownType("Hello"));

            expect(maybe.value).toEqual("Hello");
            expect(maybe.isNothing).toBeFalsy();
        });

        it("should construct a valid Maybe with a given value of null", () => {
            const maybe = Maybe.justAllowNull(returnUnknownType(null));

            expect(maybe.value).toEqual(null);
            expect(maybe.isNothing).toBeFalsy();
        });

        it("should construct a valid Maybe with a given value of undefined", () => {
            const maybe = Maybe.justAllowNull(returnUnknownType(undefined));

            expect(maybe.value).toEqual(undefined);
            expect(maybe.isNothing).toBeFalsy();
        });
    });

    describe("nothing", () => {

        const expectedNothingError = "Unable to access value of a nothing Maybe. Use defaultTo instead.";

        it("should construct a nothing maybe of type string", () => {
            const maybe = Maybe.nothing<string>();

            expect(maybe.isNothing).toBeTruthy();
        });

        it("should construct a nothing Maybe with a type of null", () => {
            const maybe = Maybe.nothing<null>();

            expect(maybe.isNothing).toBeTruthy();
        });

        it("should construct a nothing Maybe with a type of undefined", () => {
            const maybe = Maybe.nothing<undefined>();

            expect(maybe.isNothing).toBeTruthy();
        });

        it("should throw an error when value is accessed on a nothing maybe", () => {
            const maybe = Maybe.nothing<string>();

            expect(() => maybe.value).toThrowError(expectedNothingError);
        });
    });

    describe("nullToMaybe", () => {

        it("should construct a valid maybe when passed a string", () => {
            const maybe = Maybe.nullToMaybe(returnUnknownType("Hello"));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(maybe.value.length).toBeDefined();
        });

        it("should construct a nothing Maybe when passed null", () => {
            const maybe = Maybe.nullToMaybe(returnUnknownType(null));

            expect(maybe.isNothing).toBeTruthy();
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(() => maybe.value.length).toThrow();
        });

        it("should construct a nothing Maybe when passed undefined", () => {
            const maybe = Maybe.nullToMaybe(returnUnknownType(undefined));

            expect(maybe.isNothing).toBeTruthy();
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(() => maybe.value.length).toThrow();
        });
    });

    describe("if", () => {

        it("should construct a valid maybe when passed a string and a true test", () => {
            const maybe = Maybe.if(true, returnUnknownType("Hello"));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(maybe.value.length).toBeDefined();
        });

        it("should construct a nothing maybe when passed a string and a false test", () => {
            const maybe = Maybe.if(false, returnUnknownType("Hello"));

            expect(maybe.isNothing).toBeTruthy();
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(() => maybe.value.length).toThrow();
        });

        it("should construct a nothing maybe when passed null and a true test", () => {
            const maybe = Maybe.if(true, returnUnknownType(null));

            expect(maybe.isNothing).toBeTruthy();
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(() => maybe.value.length).toThrow();
        });

        it("should construct a nothing maybe when passed null and a false test", () => {
            const maybe = Maybe.if(false, returnUnknownType(null));

            expect(maybe.isNothing).toBeTruthy();
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(() => maybe.value.length).toThrow();
        });

        it("should construct a nothing maybe when passed undefined and a true test", () => {
            const maybe = Maybe.if(true, returnUnknownType(undefined));

            expect(maybe.isNothing).toBeTruthy();
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(() => maybe.value.length).toThrow();
        });

        it("should construct a nothing maybe when passed undefined and a false test", () => {
            const maybe = Maybe.if(false, returnUnknownType(undefined));

            expect(maybe.isNothing).toBeTruthy();
            //  We should get no compile errors here as the maybe should be typed as a string not a union type
            expect(() => maybe.value.length).toThrow();
        });

    });

    //  Maybe operator tests

    describe("map", () => {

        let maybe: IMaybe<string>;

        beforeEach(() => {
            maybe = Maybe.nullToMaybe("Hello");
        });

        describe("not allow null", () => {

            it("should produce a Maybe with given value", () => {
                const mappedMaybe = maybe.map(v => returnUnknownType("Goodbye"));

                expect(mappedMaybe.isNothing).toBeFalsy();
                expect(mappedMaybe.value).toEqual("Goodbye");
                //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
                expect(mappedMaybe.value.length).toBe(7);
            });

            it("should produce a nothing Maybe when passed null", () => {
                const mappedMaybe = maybe.map(v => returnUnknownType(null));

                expect(mappedMaybe.isNothing).toBeTruthy();
                //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
                expect(() => mappedMaybe.value.length).toThrow();
            });

            it("should produce a nothing Maybe when passed undefined", () => {
                const mappedMaybe = maybe.map(v => returnUnknownType(undefined));

                expect(mappedMaybe.isNothing).toBeTruthy();
                //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | undefined>
                expect(() => mappedMaybe.value.length).toThrow();
            });

        });

        describe("mapAllowNull", () => {

            it("should produce a Maybe with given value", () => {
                const mappedMaybe = maybe.mapAllowNull(v => returnUnknownType("Goodbye"));

                expect(mappedMaybe.isNothing).toBeFalsy();
                expect(mappedMaybe.value).toEqual("Goodbye");
            });

            it("should produce a Maybe with given value when passed null", () => {
                const mappedMaybe = maybe.mapAllowNull(v => returnUnknownType(null));

                expect(mappedMaybe.isNothing).toBeFalsy();
                expect(mappedMaybe.value).toBeNull()
            });

            it("should produce a Maybe with given value when passed undefined", () => {
                const mappedMaybe = maybe.mapAllowNull(v => returnUnknownType(undefined));

                expect(mappedMaybe.isNothing).toBeFalsy();
                expect(mappedMaybe.value).toBeUndefined()
            });
        });
    });

    describe("do", () => {
        let functionExecuted: boolean;

        beforeEach(() => {
            functionExecuted = false;
        });

        it("should execute the given function when Maybe is valid", () => {
            Maybe.justAllowNull<string>("Hello")
                .do(v => functionExecuted = true);

            expect(functionExecuted).toBeTruthy();
        });

        it("should not execute the given function when Maybe is nothing", () => {
            Maybe.nothing<string>()
                .do(v => functionExecuted = true);

            expect(functionExecuted).toBeFalsy();
        });
    });

    describe("elseDo", () => {
        let functionExecuted: boolean;

        beforeEach(() => {
            functionExecuted = false;
        });

        it("should not execute the given function when Maybe is valid", () => {
            Maybe.justAllowNull<string>("Hello")
                .elseDo(() => functionExecuted = true);

            expect(functionExecuted).toBeFalsy();
        });

        it("should execute the given function when Maybe is nothing", () => {
            Maybe.nothing<string>()
                .elseDo(() => functionExecuted = true);

            expect(functionExecuted).toBeTruthy();
        });

    });

    describe("orElse", () => {

        it("should leave the Maybe value unchanged if maybe is valid", () => {
            const maybe = Maybe.nullToMaybe("Hello")
                .orElse(returnUnknownType("Goodbye"));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(maybe.value.length).toBe(5);
        });

        it("should change the Maybe value if maybe is nothing", () => {
            const maybe = Maybe.nothing<string>()
                .orElse(returnUnknownType("Goodbye"));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Goodbye");
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(maybe.value.length).toBe(7);
        });


        it("should leave the Maybe value unchanged if maybe is valid and null passed", () => {
            const maybe = Maybe.nullToMaybe("Hello")
                .orElse(returnUnknownType(null));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(maybe.value.length).toBe(5);
        });

        it("should leave the Maybe value unchanged if maybe is valid and undefined passed", () => {
            const maybe = Maybe.nullToMaybe("Hello")
                .orElse(returnUnknownType(undefined));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(maybe.value.length).toBe(5);
        });


        it("should return a nothing maybe if maybe is nothing and null passed", () => {
            const maybe = Maybe.nothing<string>()
                .orElse(returnUnknownType(null));

            expect(maybe.isNothing).toBeTruthy();
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(() => maybe.value.length).toThrow();
        });

        it("should return a nothing maybe if maybe is nothing and undefined passed", () => {
            const maybe = Maybe.nothing<string>()
                .orElse(returnUnknownType(undefined));

            expect(maybe.isNothing).toBeTruthy();
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(() => maybe.value.length).toThrow();
        });

    });

    describe("orElseAllowNull", () => {

        it("should leave the Maybe value unchanged if maybe is valid", () => {
            const maybe = Maybe.justAllowNull(returnUnknownType("Hello"))
                .orElseAllowNull(returnUnknownType("Goodbye"));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
        });

        it("should change the Maybe value if maybe is nothing", () => {
            const maybe = Maybe.nothing<string | null | undefined>()
                .orElseAllowNull(returnUnknownType("Goodbye"));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Goodbye");
        });


        it("should leave the Maybe value unchanged if maybe is valid and null passed", () => {
            const maybe = Maybe.justAllowNull(returnUnknownType("Hello"))
                .orElseAllowNull(returnUnknownType(null));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
        });

        it("should leave the Maybe value unchanged if maybe is valid and undefined passed", () => {
            const maybe = Maybe.justAllowNull(returnUnknownType("Hello"))
                .orElseAllowNull(returnUnknownType(undefined));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
        });


        it("should return a valid maybe if maybe is nothing and null passed", () => {
            const maybe = Maybe.nothing<string | null | undefined>()
                .orElseAllowNull(returnUnknownType(null));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toBeNull();
        });

        it("should return a valid maybe if maybe is nothing and undefined passed", () => {
            const maybe = Maybe.nothing<string | null | undefined>()
                .orElseAllowNull(returnUnknownType(undefined));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toBeUndefined();
        });

    });

    describe("and", () => {

        let functionExecuted = false;

        beforeEach(() => {
            functionExecuted = false;
        })

        function createMaybe(value: number): IMaybe<number> {
            functionExecuted = true;

            if (isNaN(value)) {
                return Maybe.nothing<number>();
            }

            return Maybe.nullToMaybe(value);
        }

        it("if both Maybes are valid should return second maybe", () => {
            const maybe = Maybe.nullToMaybe(returnUnknownType("Hello"))
                .and(v => createMaybe(75));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual(75);
            expect(functionExecuted).toBeTruthy();
            //  No compile errors here as mappedMaybe is typed as number
            expect(maybe.value.toString()).toBe("75");
        });

        it("should return nothing when first maybe is nothing", () => {
            const maybe = Maybe.nothing<string>()
                .and(v => createMaybe(75));

            expect(maybe.isNothing).toBeTruthy();
            expect(functionExecuted).toBeFalsy();
            //  No compile errors here as maybe is typed as IMaybe<number>
            expect(() => maybe.value.toString()).toThrow();
        });

        it("should return nothing when second maybe is nothing", () => {
            const maybe = Maybe.nullToMaybe(returnUnknownType("Hello"))
                .and(() => createMaybe(NaN));

            expect(maybe.isNothing).toBeTruthy();
            expect(functionExecuted).toBeTruthy();
            //  No compile errors here as maybe is typed as IMaybe<number>
            expect(() => maybe.value.toString()).toThrow();
        });

        it("should return a nothing maybe when both maybes are nothing", () => {
            const maybe = Maybe.nothing<string>()
                .and(() => createMaybe(NaN));

            expect(maybe.isNothing).toBeTruthy();
            expect(functionExecuted).toBeFalsy();
            //  No compile errors here as maybe is typed as IMaybe<number>
            expect(() => maybe.value.toString()).toThrow();
        });
    });

    describe("or", () => {

        it("should not alter maybe value when maybe is valid", () => {
            const maybe = Maybe.nullToMaybe(returnUnknownType("Hello"))
                .or(Maybe.nullToMaybe(returnUnknownType("Goodbye")));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(maybe.value.length).toBe(5);
        });

        it("should not alter maybe value when maybe is valid and alternate maybe is nothing", () => {
            const maybe = Maybe.nullToMaybe(returnUnknownType("Hello"))
                .or(Maybe.nothing<string>());

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Hello");
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(maybe.value.length).toBe(5);
        });

        it("should change maybe value when maybe is nothing", () => {
            const maybe = Maybe.nothing<string>()
                .or(Maybe.nullToMaybe(returnUnknownType("Goodbye")));

            expect(maybe.isNothing).toBeFalsy();
            expect(maybe.value).toEqual("Goodbye");
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(maybe.value.length).toBe(7);
        });

        it("should return a nothing maybe when both maybes are nothing", () => {
            const maybe = Maybe.nothing<string>()
                .or(Maybe.nothing<string>());

            expect(maybe.isNothing).toBeTruthy();
            //  No compile errors here as mappedMaybe is typed as IMaybe<string> not IMaybe<string | null>
            expect(() => maybe.value.length).toThrow();
        });
    });

    describe("defaultTo", () => {

        it("should return maybe value when maybe is valid", () => {
            const value = Maybe.nullToMaybe(returnUnknownType("Hello"))
                .defaultTo("Goodbye");

            expect(value).toEqual("Hello");
            //value typed as string
            expect(value.length).toEqual(5);
        });

        it("should return default value when maybe is nothing", () => {
            const value = Maybe.nothing<string>()
                .defaultTo("Goodbye");

            expect(value).toEqual("Goodbye");
            //value typed as string
            expect(value.length).toEqual(7);
        });

        it("should return default value of null when maybe is nothing", () => {
            const value = Maybe.nothing<string>()
                .defaultTo(null);

            expect(value).toBeNull();
            //  value typed as string | null
        });

        it("should return default value of undefined when maybe is nothing", () => {
            const value = Maybe.nothing<string>()
                .defaultTo(undefined);

            expect(value).toBeUndefined();
            //  value typed as string | undefined
        });

    });

    describe("filter", () => {

        let maybe: IMaybe<string>;

        function helloFilterFunction(value: string): boolean {
            return value === "Hello";
        }

        beforeEach(() => {
            maybe = Maybe.nullToMaybe(returnUnknownType("Hello"));
        });

        it("should leave a valid maybe unchanged if filter expression returns true", () => {
            const filteredMaybe = maybe.filter(v => helloFilterFunction(v));

            expect(filteredMaybe.isNothing).toBeFalsy();
            expect(filteredMaybe.value).toEqual("Hello");
        });

        it("should change maybe to nothing if filter expression returns false", () => {
            const filteredMaybe = maybe.filter(v => false);

            expect(filteredMaybe.isNothing).toBeTruthy();
            expect(() => filteredMaybe.value).toThrow();
        });
    });

    describe("combine", () => {

        const stringMaybe = Maybe.nullToMaybe("Hello");
        const numberMaybe = Maybe.nullToMaybe(75);
        const booleanMaybe = Maybe.nullToMaybe(true);
        const dateMaybe = Maybe.nullToMaybe(new Date(101010));
        const nullMaybe = Maybe.justAllowNull(null);
        const undefinedMaybe = Maybe.justAllowNull(undefined);

        it("should return a valid maybe when combined with 5 valid maybes", () => {
            let maybe = stringMaybe.combine(numberMaybe, booleanMaybe, nullMaybe, undefinedMaybe, dateMaybe);
        
            expect(maybe.isNothing).toBeFalsy();

            //  check array value types
            expect(maybe.value[0].length).toEqual(5);
            expect(maybe.value[1].toString()).toEqual("75");
            expect(maybe.value[2].valueOf()).toEqual(true);
            expect(maybe.value[3]).toBeNull();
            expect(maybe.value[4]).toBeUndefined();
            expect(maybe.value[5].getTime()).toEqual(101010);
        });

        it("should return a nothing maybe when nothing combined with 5 valid maybes", () => {
            let maybe = Maybe.nothing<string>().combine(numberMaybe, booleanMaybe, nullMaybe, undefinedMaybe, dateMaybe);
        
            expect(maybe.isNothing).toBeTruthy();

            //  check array value types
            expect(() => maybe.value[0].length).toThrow();
            expect(() => maybe.value[1].toString()).toThrow();
            expect(() => maybe.value[2].valueOf()).toThrow();
            expect(() => maybe.value[3]).toThrow();
            expect(() => maybe.value[4]).toThrow();
            expect(() => maybe.value[5].getTime()).toThrow();
        });

        it("should return a nothing maybe when combined with 5 valid maybes, the first of which is nothing", () => {
            let maybe = stringMaybe.combine(Maybe.nothing<number>(), booleanMaybe, nullMaybe, undefinedMaybe, dateMaybe);
        
            expect(maybe.isNothing).toBeTruthy();

            //  check array value types
            expect(() => maybe.value[0].length).toThrow();
            expect(() => maybe.value[1].toString()).toThrow();
            expect(() => maybe.value[2].valueOf()).toThrow();
            expect(() => maybe.value[3]).toThrow();
            expect(() => maybe.value[4]).toThrow();
            expect(() => maybe.value[5].getTime()).toThrow();
        });

        it("should return a nothing maybe when combined with 5 valid maybes, the second of which is nothing", () => {
            let maybe = stringMaybe.combine(numberMaybe, Maybe.nothing<boolean>(), nullMaybe, undefinedMaybe, dateMaybe);
        
            expect(maybe.isNothing).toBeTruthy();

            //  check array value types
            expect(() => maybe.value[0].length).toThrow();
            expect(() => maybe.value[1].toString()).toThrow();
            expect(() => maybe.value[2].valueOf()).toThrow();
            expect(() => maybe.value[3]).toThrow();
            expect(() => maybe.value[4]).toThrow();
            expect(() => maybe.value[5].getTime()).toThrow();
        });

        it("should return a nothing maybe when combined with 5 valid maybes, the third of which is nothing", () => {
            let maybe = stringMaybe.combine(numberMaybe, booleanMaybe, Maybe.nothing<null>(), undefinedMaybe, dateMaybe);
        
            expect(maybe.isNothing).toBeTruthy();

            //  check array value types
            expect(() => maybe.value[0].length).toThrow();
            expect(() => maybe.value[1].toString()).toThrow();
            expect(() => maybe.value[2].valueOf()).toThrow();
            expect(() => maybe.value[3]).toThrow();
            expect(() => maybe.value[4]).toThrow();
            expect(() => maybe.value[5].getTime()).toThrow();
        });

        it("should return a nothing maybe when combined with 5 valid maybes, the forth of which is nothing", () => {
            let maybe = stringMaybe.combine(numberMaybe, booleanMaybe, nullMaybe, Maybe.nothing<undefined>(), dateMaybe);
        
            expect(maybe.isNothing).toBeTruthy();

            //  check array value types
            expect(() => maybe.value[0].length).toThrow();
            expect(() => maybe.value[1].toString()).toThrow();
            expect(() => maybe.value[2].valueOf()).toThrow();
            expect(() => maybe.value[3]).toThrow();
            expect(() => maybe.value[4]).toThrow();
            expect(() => maybe.value[5].getTime()).toThrow();
        });

        it("should return a nothing maybe when combined with 5 valid maybes, the last of which is nothing", () => {
            let maybe = stringMaybe.combine(numberMaybe, booleanMaybe, nullMaybe, undefinedMaybe, Maybe.nothing<Date>());
        
            expect(maybe.isNothing).toBeTruthy();

            //  check array value types
            expect(() => maybe.value[0].length).toThrow();
            expect(() => maybe.value[1].toString()).toThrow();
            expect(() => maybe.value[2].valueOf()).toThrow();
            expect(() => maybe.value[3]).toThrow();
            expect(() => maybe.value[4]).toThrow();
            expect(() => maybe.value[5].getTime()).toThrow();
        });

    });

})