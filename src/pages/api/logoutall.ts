import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization || "";
  const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
    username: string; password: string; tokens: string[];
  }[];
  let verifySuccess = false;
  let user = {} as { username: string; password: string; tokens: string[] };
  let userIndex = 0;
  for (let i of users) {
    if (!i.tokens) i.tokens = [];
    if (i.tokens.includes(token)) {
      verifySuccess = true;
      user = i;
      userIndex = users.indexOf(i);
    }
  }

  if (!verifySuccess) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  user.tokens = [];
  await fetch(`${process.env.FIREBASE}/users/${userIndex}.json`, {
    method: "PUT", body: JSON.stringify(user),
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
}