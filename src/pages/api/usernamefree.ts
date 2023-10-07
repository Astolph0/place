import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.url;
  if (!url) {
    return res.status(400).json({
      error: "Missing URL",
    });
  }
  const searchParams = new URL(url).searchParams;
  if (!searchParams.has("username")) {
    return res.status(400).json({
      error: "Missing username",
    });
  }
  const username = searchParams.get("username")!.toString();
  if (username === '') {
    return res.status(400).json({
      error: 'Missing username'
    })
  }
  // username only a-z A-Z 0-9 and _ and -
  const regex = /^[a-zA-Z0-9_-]*$/;
  if (!regex.test(username)) {
    return res.status(400).json({
      error: 'Username must only contain a-z, A-Z, 0-9, _ and -'
    })
  }

  const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
    username: string; password: string; tokens: string[]; nextPlaceDate: string;
  }[];

  for (let i of users) {
    if (i.username.toLowerCase() == username.toLowerCase()) {
      return res.status(200).json({
        error: 'Username already taken'
      })
    }
  }

  return res.status(200).json({
    message: 'OK'
  });
}