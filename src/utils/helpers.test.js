import {test, expect} from "vitest";
import {calcMinutesLeft, formatCurrency} from "./helpers";

test("formatCurrency formats a number with € & 2 decimals", () => {
    expect(formatCurrency(12)).toBe("€12.00");
});

test("calcMinutesLeft returns positive values for future times", () => {
    const futureTime = Date.now() + 1000 * 60 * 30;

    expect(calcMinutesLeft(futureTime)).toBeGreaterThan(0);
})

test("calcMinutesLeft returns negative values for past times", () => {
    const pastTime = Date.now() - 1000 * 60 * 30;

    expect(calcMinutesLeft(pastTime)).toBeLessThan(0);
})