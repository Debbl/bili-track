// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { ICreateRecordsReqParams } from "@vikadata/vika";
import type { NextApiRequest, NextApiResponse } from "next";
import { BI_USER_INFO_API } from "~/config";
import { vika_create, vika_view } from "~/vika";

type VikaData = {
  recordId: string;
  createdAt: number;
  updatedAt: number;
  fields: {
    mid: string;
    follower: number;
    name: string;
    archive_count: number;
  };
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.query.key !== "trigger-by-vercel") {
    res.status(403).send("Please use Vercel Cron Jobs trigger the request!");
    return;
  }
  const upsRes = await vika_view("ups");

  if (!upsRes.success) {
    res.status(503).end();
    return;
  }

  // get bilibili data
  const data = upsRes!.data!.records as any as VikaData;
  const usersMid = data.map((d) => d.fields.mid);
  const wData: ICreateRecordsReqParams = [];
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
      res.status(503).end();
      return;
    }
    wData.push({
      fields: {
        mid: fRes.data.card.mid,
        name: fRes.data.card.name,
        archive_count: fRes.data.archive_count,
        follower: fRes.data.follower,
        like_num: fRes.data.like_num,
      },
    });
  }

  // write data vika
  const wRes = await vika_create("fans", wData);
  if (!wRes.success) {
    res.status(503).end();
    return;
  }

  res.status(200).json(wRes);
}
