import axios from "axios";
import * as cheerio from "cheerio";
import type { Platform, Region } from "../../types";

export interface LeaderboardPlayer {
  place: number;
  nametag: string;
  flagUrl: string;
  flagCode: string;
  positionChange24h: number;
  rankedRating: number;
  rank: string;
  wins: number;
}

export async function getLeaderboard(region: Region, platform: Platform = "pc"): Promise<LeaderboardPlayer[]> {

  const url = `https://tracker.gg/valorant/leaderboards/ranked/all/default?platform=${platform}&region=${region}&act=aef237a0-494d-3a14-a1c8-ec8de84e309c&page=1`;

  const players: LeaderboardPlayer[] = [];

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9",
      }
    });

    const $ = cheerio.load(data);

    // Sample: Get the player names and ranks
    $(".trn-content tbody tr").each((_, element) => {
      const place = parseInt($(element).find("td:nth-child(1)").text().trim()) || 0;
      const nametag = $(element).find("td:nth-child(2) a").text().trim();
      const flagUrl = $(element).find("td:nth-child(3) img").attr("src") || "";
      const flagCode = $(element).find("td:nth-child(3) img").attr("alt") || "";
      const positionChange24h = parseInt($(element).find("td:nth-child(4)").text().trim()) || 0;
      const rankedRating = parseInt($(element).find("td:nth-child(5)").text().trim()) || 0;
      const rank = $(element).find("td:nth-child(6)").text().trim();
      const wins = parseInt($(element).find("td:nth-child(7)").text().trim()) || 0;


      players.push({ place, nametag, flagUrl, flagCode, positionChange24h, rankedRating, rank, wins });
    });

  } catch (error) {
    console.error("Scraping failed:", error);
  }

  return players;
}