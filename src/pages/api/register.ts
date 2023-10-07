import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization ?? "";
  const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
    username: string, password: string, tokens: string[], nextPlaceDate: string
  }[]

  let verifySuccess = false;
  for (let i of users) {
    if (i.tokens.includes(token)) {
      verifySuccess = true;
    }
  }

  if (!verifySuccess) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  return res.status(200).json({
    success: true,
  });
}