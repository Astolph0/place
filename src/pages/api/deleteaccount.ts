import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization ?? "";
  const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
    username: string; password: string; tokens: string[]; nextPlaceDate: string;
  }[];

  let verifySuccess = false;
  let index = 0;
  for (let i in users) {
    if (!users[i].tokens) users[i].tokens = [];
    if (users[i].tokens.includes(token)) {
      verifySuccess = true;
      index = parseInt(i);
      break;
    }
  }

  if (!verifySuccess) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  users.splice(index, 1);
  await fetch(`${process.env.FIREBASE}/users.json`, {
    method: "PUT", body: JSON.stringify(users),
  });

  return res.status(200).json({
    success: true,
  });
}