import type {LoaderFunction} from "@remix-run/node";

export const loader: LoaderFunction = async ({request}) => {
  const auth = request.headers.get("Authorization") ?? '';
  const users = await (await fetch(`${process.env.FIREBASE}/users.json`)).json();
  const adminUser = users.find((user: any) => user.username === "astolfo");
  if (!adminUser) return {};
  if (!adminUser.tokens) adminUser.tokens = [];
  if (!adminUser.tokens.includes(auth)) return {};

  return {
    users,
  };
};
