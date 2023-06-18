import { db } from "@vercel/postgres";
import type { NextApiRequest, NextApiResponse } from "next";
import { BI_USER_INFO_API } from "~/config";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.query.key !== "trigger-by-vercel") {
    response
      .status(403)
      .send("Please use Vercel Cron Jobs trigger the request!");
    return;
  }
  const client = await db.connect();

  try {
    const upsRes = await client.sql`SELECT mid FROM bili_track_ups`;
    const usersMid = upsRes.rows.map((d) => d.mid);

    const wData = [];
    for (let i = 0; i < usersMid.length; i++) {
      const mid = usersMid[i];
      const fRes = await (
        await fetch(
          `${BI_USER_INFO_API}?${new URLSearchParams({
            mid,
          })}`
        )
      ).json();
      if (fRes.data === 0) {
        response.status(503).end();
        return;
      }
      const fields = {
        mid: fRes.data.card.mid,
        name: fRes.data.card.name,
        archive_count: fRes.data.archive_count,
        follower: fRes.data.follower,
        like_num: fRes.data.like_num,
      };
      await client.sql`INSERT INTO bili_track_fans (mid, name, archive_count, follower, like_num ) VALUES (${fields.mid}, ${fields.name}, ${fields.archive_count}, ${fields.follower}, ${fields.like_num})`;
      wData.push(fields);
    }

    return response.status(200).json({ wData });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
