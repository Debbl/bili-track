import { db } from "@vercel/postgres";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const client = await db.connect();

  try {
    const fansRes = await client.sql`SELECT * FROM bili_track_fans`;

    return response.status(200).json(fansRes.rows);
  } catch (error) {
    return response.status(500).json({ error });
  }
}
