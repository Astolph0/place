import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const token = request.headers.get("Authorization") ?? "";
  const users = (await (
    await fetch(`${process.env.FIREBASE}/users.json`)
  ).json()) as {
    username: string;
    password: string;
    tokens: string[];
    nextPlaceDate: string;
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
    return new Response(
      JSON.stringify({
        error: "Invalid token",
      }),
      {
        status: 401,
      }
    );
  }

  users.splice(index, 1);
  await fetch(`${process.env.FIREBASE}/users.json`, {
    method: "PUT",
    body: JSON.stringify(users),
  });

  return new Response(
    JSON.stringify({
      success: true,
    }),
    { status: 200 }
  );
};
