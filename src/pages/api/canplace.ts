import { NextApiRequest, NextApiResponse } from "next";

// export const loader: LoaderFunction = async ({request}) => {
//   const token = request.headers.get("Authorization") || "";
//   const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
//     username: string; password: string; tokens: string[]; nextPlaceDate: string;
//   }[];
//   let verifySuccess = false;
//   let user = {} as {
//     username: string; password: string; tokens: string[]; nextPlaceDate: string;
//   };
//   let userIndex = 0;
//   for (let i of users) {
//     if (!i.tokens) i.tokens = [];
//     if (!i.nextPlaceDate) i.nextPlaceDate = new Date().toISOString();
//     if (i.tokens.includes(token)) {
//       verifySuccess = true;
//       user = i;
//       userIndex = users.indexOf(i);
//     }
//   }

//   if (!verifySuccess) {
//     return new Response(JSON.stringify({
//       error: "Invalid token",
//     }), {
//       status: 401,
//     });
//   }

//   return new Response(JSON.stringify({
//     canPlace: new Date(user.nextPlaceDate) <= new Date(),
//     seconds: Math.floor((new Date(user.nextPlaceDate).getTime() - new Date().getTime()) / 1000),
//   }), {status: 200});
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  return res.status(200).json({
    canPlace: new Date(user.nextPlaceDate) <= new Date(),
    seconds: Math.floor((new Date(user.nextPlaceDate).getTime() - new Date().getTime()) / 1000),
  });
}

