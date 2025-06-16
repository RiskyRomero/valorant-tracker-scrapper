import { expect, test } from "bun:test";
import { getLeaderboard } from "../src";

test("Fetch Leaderboards", async () => {
  expect((await getLeaderboard("na"))[0]?.place).toBe(1);
});