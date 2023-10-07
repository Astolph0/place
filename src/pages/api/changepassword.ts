import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization ?? '';
  const body = await req.body;
  const {password} = body;
  if (!password) {
    return res.status(400).json("Missing password");
  }

  const users = await (await fetch(`${process.env.FIREBASE}/users.json`)).json() as {
    username: string; password: string; tokens: string[];
  }[];

  let user = {} as typeof users[0];
  let userId = 0;
  for (let i = 0; i < users.length; i++) {
    const use = users[i];
    if (!use.tokens) use.tokens = [];
    if (use.tokens.includes(token)) {
      user = use;
      userId = i;
      break;
    }
  }
  if (!user) {
    return res.status(404).json("User not found");
  }

  await fetch(`${process.env.FIREBASE}/users/${userId}.json`, {
    method: "PATCH", body: JSON.stringify({password}),
  });

  return res.status(200).json("Password changed");
}

