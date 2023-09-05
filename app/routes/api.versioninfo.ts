import {LoaderFunction} from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return {
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) ?? '',
  }
}