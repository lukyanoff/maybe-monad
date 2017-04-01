

import { Maybe } from "../index";

describe("Maybe", () => {
  
    it("construction", () => {
        const maybe = new Maybe();

        expect(maybe).toBeDefined();
    })

})