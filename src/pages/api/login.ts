import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
    username: string, password: string, tokens: string[]
  }[];

  let verifySuccess = false;
  let user = {
    username: '', password: '', tokens: []
  } as { username: string, password: string, tokens: string[] };
  let userIndex = 0

  for (let i = 0; i < users.length; i++) {
    if (users[i].username.toLowerCase() === req.body.username.toLowerCase() && users[i].password === req.body.password) {
      verifySuccess = true;
      user = users[i];
      userIndex = i;
      break;
    }
  }
}