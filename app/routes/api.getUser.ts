import type {LoaderFunction} from "@remix-run/node";
import { Response} from "@remix-run/node";


// api endpoint to get a user
// parameters: token in header
export const loader: LoaderFunction = async ({ request }) => {
  const token = request.headers.get('Authorization') ?? ''
  const users = await (await fetch(`${process.env.FIREBASE}/users.json`)).json() as {
    username: string,
    password: string,
    tokens: string[]
  }[]

  let user
  let verifySuccess = false
  for (let u in users) {
    if (!users[u].tokens) users[u].tokens = []
    for (let t in users[u].tokens) {
      if (users[u].tokens[t] == token) {
        verifySuccess = true
        user = users[u]
      }
    }
  }


  if (verifySuccess) {
    return new Response(JSON.stringify({
      username: user!.username
    }))
  }
  else {
    return new Response(JSON.stringify({
      error: 'Invalid token'
    }))
  }

}