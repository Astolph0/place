import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization ?? "";
  const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
    username: string; password: string; tokens: string[];
  }[];
  let verifySuccess = false;
  let user = {} as {
    username: string; password: string; tokens: string[];
  };
  for (let u of users) {
    if (!u.tokens) u.tokens = [];
    for (let t of u.tokens) {
      if (t == token) {
        verifySuccess = true;
        user = u;
      }
    }
  }

  if (verifySuccess) {
    return res.status(200).json({
      username: user.username,
    });
  } else {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
}