import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);

  const localeHeaders = request.headers.get("Accept-Language")?.split(",");
  const locale = localeHeaders?.[0] ?? "en-US";

  const createdAt = new Date(user.createdAt).toLocaleDateString(locale);
  const updatedAt = new Date(user.createdAt).toLocaleDateString(locale);
  const userWithLocaleDate = { ...user, createdAt, updatedAt };

  return json({ userWithLocaleDate });
};

const UserProfie = () => {
  const { userWithLocaleDate: user } = useLoaderData<typeof loader>();

  return (
    <main className="flex h-full">
      <article className="prose">
        <h1> {user.id} </h1>
        <h1> {user.email} </h1>
        <h1> {user.createdAt} </h1>
        <h1> {user.updatedAt} </h1>
      </article>
    </main>
  );
};

export default UserProfie;
