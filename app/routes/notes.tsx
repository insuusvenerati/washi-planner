import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { useDrop } from "react-dnd";
import { Sticker } from "~/components/sticker";
import { getNoteListItems } from "~/models/note.server";
import { getStickers } from "~/models/stickers.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const stickers = getStickers();
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems, stickers });
}

export default function NotesPage() {
  const [basket, setBasket] = useState<string[]>([]);
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const [{ isDragging }, dropRef] = useDrop<{ sticker: string }, void, { isDragging: boolean }>({
    accept: "Sticker",
    drop: (item) => setBasket((basket) => [...basket, item.sticker]),
  });

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="navbar flex items-center justify-between bg-base-100">
        <Link to="/" className="btn-ghost btn text-xl normal-case">
          Washi Planner
        </Link>
        <Link className="link-hover link-primary link" to="/user">
          {user.email}
        </Link>
        <Form action="/logout" method="post">
          <button type="submit" className="btn-primary btn">
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full">
        <div className="h-full w-80 border-r">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol className="menu">
              {data.noteListItems.map((note) => (
                <li className="hover-bordered" key={note.id}>
                  <NavLink
                    className={({ isActive }) => `block p-4 text-xl ${isActive ? "active" : ""}`}
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="grid h-1/2 w-1/3 grid-cols-4 gap-4 p-4">
          {data.stickers.map((sticker) => (
            <div className="bg-primary shadow-xl" key={sticker}>
              <Sticker height={50} sticker={sticker} />
            </div>
          ))}
        </div>

        <div
          ref={dropRef}
          className="mr-6 grid h-1/2 w-2/3 flex-1 grid-cols-4 gap-4 rounded-lg bg-primary p-4"
        >
          {basket.map((sticker) => (
            <Sticker key={sticker} sticker={sticker} />
          ))}
          {isDragging && <div className="bg-secondary">Drop here!</div>}
        </div>

        {/* <div className="flex-1 p-6">
            <Outlet />
          </div> */}
      </main>
    </div>
  );
}
