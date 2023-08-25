import {LoaderFunction} from "@remix-run/node";

//register endpoint
export const loader: LoaderFunction = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const username = searchParams.get('username');
  const password = searchParams.get('password');
  if (!username || !password) {
    return new Response(JSON.stringify({
      error: 'Missing username or password'
    }), {
      status: 400
    })
  }
  
	if (username === '') {
		return new Response(JSON.stringify({
			error: 'Missing username'
		}), {
			status: 400
		})
	}

  const regex = /^[a-zA-Z0-9_-]*$/;
	if (!regex.test(username)) {
		return new Response(JSON.stringify({
			error: 'Username must only contain a-z, A-Z, 0-9, _ and -'
		}), {
			status: 400
		})
	}

  const users = await (await fetch(`${process.env.FIREBASE}/users.json`)).json() as {
    username: string,
    password: string,
    tokens: string[],
    nextPlaceDate: string
  }[]

  let verifySuccess = false;
  for (let i of users) {
    if (i.username.toLowerCase() == username.toLowerCase()) {
      verifySuccess = true;
    }
  }

  if (verifySuccess) {
    return new Response(JSON.stringify({
      error: 'Username already taken'
    }), {
      status: 401
    })
  }

  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  users.push({
    username: username,
    password: password,
    tokens: [token],
    nextPlaceDate: new Date().toISOString()
  })

  await fetch(`${process.env.FIREBASE}/users.json`, {
    method: "PUT",
    body: JSON.stringify(users)
  })

  return new Response(JSON.stringify({
    token: token
  }), {status: 200})
}