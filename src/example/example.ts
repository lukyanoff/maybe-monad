
import { Maybe, IMaybe } from "../index";

function logMaybe(message: string, maybe: IMaybe<any>){
    message += " [isNothing: " + maybe.isNothing;
    if(!maybe.isNothing){
        message += " value: " + maybe.value;
    }
    message += "]";

    console.log(message)
}

const justNothingMaybe = Maybe.justAllowNull(null);
logMaybe(`created just a maybe with a null value`, justNothingMaybe);

const nothingMaybe = Maybe.nothing<string>();
logMaybe(`created a nothing maybe`, nothingMaybe);

const stringToMaybe = Maybe.nullToMaybe("Hello maybe world");
logMaybe(`nullToMaybe created a maybe with a string value`, stringToMaybe);
const nullToMaybe = Maybe.nullToMaybe(null);
logMaybe(`nullToMaybe created a nothing maybe`, nullToMaybe);

const ifTrueMaybe = Maybe.if(true,"test was true");
logMaybe(`when if used with a true value valid maybe produced`, ifTrueMaybe);
const ifFalseMaybe = Maybe.if(false,"test was false");
logMaybe(`when if used with a false value nothing maybe produced`, ifFalseMaybe);

const mapLengthMaybe = Maybe.nullToMaybe("Hello").map(value => value.length);
logMaybe(`string maybe mapped to string length`, mapLengthMaybe);

const mapUndefinedMaybe = Maybe.nullToMaybe(<any>{}).mapAllowNull(value => value.something);
logMaybe(`object maybe mapAllowNull to undefined property`, mapUndefinedMaybe);

Maybe.nullToMaybe("do called on a string Maybe").do(message => console.log(message));
Maybe.nothing().elseDo(() => console.log("elseDo called on a nothing Maybe"));

logMaybe(`orElse called on a valid maybe returns original maybe`,Maybe.nullToMaybe("Hello").orElse("GoodBye"));
logMaybe(`orElse called on a nothing maybe returns alternate maybe`,Maybe.nothing<string>().orElse("GoodBye"));

logMaybe(`orElseAllowNull called on a nothing maybe`,Maybe.nothing<string | null>().orElseAllowNull(null));

logMaybe("and will return value of second maybe",Maybe.nullToMaybe("valueOne").and(paramOneValue => Maybe.nullToMaybe("valueTwo")));
logMaybe("and will return nothing if first maybe is nothing",Maybe.nothing().and(paramOneValue => Maybe.nullToMaybe("valueTwo")));
logMaybe("and will return nothing if second maybe is nothing",Maybe.nullToMaybe("valueOne").and(paramOneValue => Maybe.nothing()));

logMaybe("or will return the value of the first Maybe when valid", Maybe.nullToMaybe("Hello").or(Maybe.nullToMaybe("GoodBye")));
logMaybe("or will return the value of the second Maybe when first is nothing", Maybe.nothing().or(Maybe.nullToMaybe("GoodBye")));

console.log(`defaultTo will return the value of a valid maybe: ${Maybe.nullToMaybe("Hello").defaultTo("GoodBye")}`);
console.log(`defaultTo will return the default value when called on a nothing Maybe: ${Maybe.nothing().defaultTo("GoodBye")}`);

logMaybe(`filter will not change a maybe if it returns true`, Maybe.nullToMaybe("Hello").filter(() => true));
logMaybe(`filter will change a maybe to nothing if it returns false`, Maybe.nullToMaybe("").filter(() => false));

logMaybe(`combine will produce a maybe with an array of all maybe values`,Maybe.nullToMaybe("Hello").combine(Maybe.nullToMaybe("World"))); 