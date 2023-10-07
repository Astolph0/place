import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization || "";
  const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
    username: string; password: string; tokens: string[]; nextPlaceDate: string;
  }[];
  let verifySuccess = false;
  let user = {} as {
    username: string; password: string; tokens: string[]; nextPlaceDate: string;
  };
  let userIndex = 0;
  for (let i of users) {
    if (!i.tokens) i.tokens = [];
    if (!i.nextPlaceDate) i.nextPlaceDate = new Date().toISOString();
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

  const body = req.body;
  console.log(body);
  console.log(`x=${body.x}, y=${body.y}, colour=#${body.colour}`)
  console.log(!body.x, !body.y, !body.colour)
  if (!body.x || !body.y || !body.colour) {
    return res.status(400).json({
      error: "Bad parameters",
    });
  }

  await fetch(`${process.env.FIREBASE}/grid/${body.y}/${body.x}.json`, {
    method: "PUT", body: JSON.stringify({
      colour: body.colour, user: user.username,
    }),
  });

  if (user.username !== "system" && user.username !== "astolfo") {
    console.log("apply cooldown for user", user.username);
    await fetch(`${process.env.FIREBASE}/users/${userIndex}/nextPlaceDate.json`, {
      method: "PUT", body: JSON.stringify(new Date(Date.now() + 1000 * 60 * 5).toISOString()),
    });
  }

  return res.status(200).json({
    message: "Placed pixel successfully",
  });
}