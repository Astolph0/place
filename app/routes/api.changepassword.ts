import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const token = request.headers.get("Authorization") ?? '';
  const body = await request.json();
  const { password } = body;
  if (!password) {
    return new Response("Missing password", { status: 400 });
  }

  const users = await (await fetch(`${process.env.FIREBASE}/users.json`)).json() as {
    username: string;
    password: string;
    tokens: string[];
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
    return new Response("User not found", { status: 404 });
  }

  await fetch(`${process.env.FIREBASE}/users/${userId}.json`, {
    method: "PATCH",
    body: JSON.stringify({ password }),
  });

  return new Response("Password changed", { status: 200 });
}