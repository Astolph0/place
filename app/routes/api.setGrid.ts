import type {ActionFunction} from "@remix-run/node";

export const action: ActionFunction = async ({request}) => {
  const body = await request.json();
  console.log(body);
  console.log(`x=${body.x}, y=${body.y}, colour=#${body.colour}`)
  console.log(!body.x, !body.y, !body.colour)
  if (!body.x || !body.y || !body.colour) {
    return new Response(JSON.stringify({
      error: "Bad parameters"
    }), {
      status: 400
    })
  }
  const users = await (await fetch(`${process.env.FIREBASE}/users.json`)).json() as {
    username: string, password: string, tokens: string[], nextPlaceDate: string
  }[];
  let token = request.headers.get("Authorization");
  let verifySuccess = false;
  let user = {} as { username: string, password: string, tokens: string[], nextPlaceDate: string };
  for (let i of users) {
    if (!i.tokens) i.tokens = [];
    if (!i.nextPlaceDate) i.nextPlaceDate = new Date().toISOString();
    for (let j of i.tokens) {
      if (j == token) {
        verifySuccess = true;
        user = i;
      }
    }
  }

  if (!verifySuccess) {
    return new Response(JSON.stringify({
      error: "Invalid token"
    }), {
      status: 401
    })
  }

  // check nextPlaceDate is in the future, if not, return error
  if (new Date(user.nextPlaceDate) > new Date()) {
    return new Response(JSON.stringify({
      error: "You cannot place another pixel yet"
    }), {
      status: 401
    })
  }

  await fetch(`${process.env.FIREBASE}/grid/${body.y}/${body.x}.json`, {
    method: "PUT", body: JSON.stringify({
      colour: body.colour, user: user.username
    })
  })

  if (user.username !== 'system' && user.username !== 'astolfo') {
    console.log('apply cooldown for user', user.username)
    await fetch(`${process.env.FIREBASE}/users/${users.indexOf(user)}/nextPlaceDate.json`, {
      method: "PUT", body: JSON.stringify(new Date(Date.now() + 1000 * 60 * 5).toISOString())
    })
  }

  return new Response(JSON.stringify({
    message: "Placed pixel successfully"
  }), {
    status: 200
  })
}