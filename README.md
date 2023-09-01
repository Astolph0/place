# [Astolph0/place](https://place.mldkyt.com)

## Development

1. Set environment variable `FIREBASE` to a firebase realtime database URL.
The database has to be set to always allow writes and always allow reads.
You can set up the database to write on the root, or you can put it in a sub-key.
Also set `VERCEL_GIT_COMMIT_SHA` to something of your own that is longer than 7 letters.
2. Run `npm run dev` to start your development server.
Wait for the app to start up and navigate to the URL that gets printed into the terminal.
Stop the app using `CTRL + C`

## Production
1. Commit and push your work on this app to your fork.
2. Go to Vercel, and add the project in there.
3. Set variable `FIREBASE` under Settings > Environment Variables
4. Redeploy
