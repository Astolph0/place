import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(await (await fetch(`${process.env.FIREBASE}/grid.json`)).json() as string[][]);
}