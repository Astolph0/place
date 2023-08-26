import type {ActionFunction} from "@remix-run/node";

export const action: ActionFunction = async ({request}) => {
  const data = await request.json();
  if (!data.username || !data.password) {
    return new Response(JSON.stringify({
      error: "Bad parameters"
    }), {
      status: 400
    })
  }

  const users = await (await fetch(`${process.env.FIREBASE}/users.json`)).json() as { username: string, password: string, tokens: string[] }[];
  
  let verifySuccess = false;
  let user = {
    username: '', password: '', tokens: []
  } as { username: string, password: string, tokens: string[] };
  let userIndex = 0

  for (let i = 0; i < users.length; i++) {
    if (users[i].username.toLowerCase() === data.username.toLowerCase() && users[i].password === data.password) {
      verifySuccess = true;
      user = users[i];
      userIndex = i;
      break;
    }
  }


  if (!verifySuccess) {
    return new Response(JSON.stringify({
      error: "Invalid username or password"
    }), {
      status: 401
    })
  }

  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  if (!user.tokens) user.tokens = [];
  user.tokens.push(token)
  users[userIndex] = user;
  await fetch(`${process.env.FIREBASE}/users.json`, {
    method: 'PUT',
    body: JSON.stringify(users)
  })

  return new Response(JSON.stringify({
    token: token
  }), {status: 200})
}