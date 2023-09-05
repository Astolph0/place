import {LoaderFunction} from "@remix-run/node";

export const loader: LoaderFunction = async ({request}) => {
  const searchParams = new URL(request.url).searchParams;
  if (!searchParams.has("username")) {
    return new Response(JSON.stringify({
      error: "Missing username",
    }), {
      status: 400,
    });
  }
  const username = searchParams.get("username")!.toString();
  if (username === '') {
    return new Response(JSON.stringify({
      error: 'Missing username'
    }), {
      status: 400
    })
  }
  // username only a-z A-Z 0-9 and _ and -
  const regex = /^[a-zA-Z0-9_-]*$/;
  if (!regex.test(username)) {
    return new Response(JSON.stringify({
      error: 'Username must only contain a-z, A-Z, 0-9, _ and -'
    }), {
      status: 400
    })
  }

  const users = (await (await fetch(`${process.env.FIREBASE}/users.json`)).json()) as {
    username: string; password: string; tokens: string[]; nextPlaceDate: string;
  }[];

  for (let i of users) {
    if (i.username.toLowerCase() == username.toLowerCase()) {
      return new Response(JSON.stringify({
        error: 'Username already taken'
      }), {
        status: 200
      })
    }
  }

  return new Response(JSON.stringify({
    message: 'OK'
  }), {status: 200});
};
