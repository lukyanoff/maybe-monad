

import { Maybe } from "../index";

describe("Maybe", () => {
  
    it("construction", () => {
        const maybe = Maybe.nothing();

        expect(maybe).toBeDefined();
    })

})