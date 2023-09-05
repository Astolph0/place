import {LoaderFunction} from "@remix-run/node";

export const loader: LoaderFunction = async ({request}) => {
  const token = request.headers.get("Authorization") || "";
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
    return new Response(JSON.stringify({
      error: "Invalid token",
    }), {
      status: 401,
    });
  }

  user.tokens = [];
  await fetch(`${process.env.FIREBASE}/users/${userIndex}.json`, {
    method: "PUT", body: JSON.stringify(user),
  });

  return new Response(JSON.stringify({
    message: "Logged out successfully",
  }), {status: 200});
};
