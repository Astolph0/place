import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) ?? '',
  });
}