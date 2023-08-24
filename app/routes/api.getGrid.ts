import type {LoaderFunction} from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return await (await fetch(`${process.env.FIREBASE}/grid.json`)).json() as string[][];
}