// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { vika_view } from "~/vika";

type Data = {
  recordId: string;
  createdAt: number;
  updatedAt: number;
  fields: {
    mid: string;
    name: string;
    archive_count: number;
    follower: number;
    like_num: number;
    update_time: string;
  };
}[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = await vika_view("fans");

  if (response.success) {
    res.status(200).json(response.data.records as any as Data);
  }
  res.status(403);
}
