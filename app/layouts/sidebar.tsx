import {
  Form,
  Link,
  NavLink,
  Outlet,
  useNavigation,
  useSubmit,
} from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/sidebar";
import { useEffect } from "react";

// for client side rendering
// export async function clientLoader() {
//   console.log("in clientLoader");
//   const contacts = await getContacts();
//   return { contacts };
// }

// for ssr
export async function loader({ request }: Route.LoaderArgs) {
  console.log("#1 #2 side bar loader...");
  // console.log("sidebar loader request: ", request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  console.log("#1 #2 loader at sidebar, q: ", q);
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts, q } = loaderData;
  console.log("#1 #2 sidebar, q: ", q);
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  console.log("navigation: ", navigation);
  console.log("searching: ", searching);

  useEffect(() => {
    console.log("sidebar layout useEffect");
    const searchField = document.getElementById("q") as HTMLInputElement;
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          <Form
            id="search-form"
            role="search"
            onChange={(event) => {
              console.log("#2 event.currentTarget: ", event.currentTarget);
              const isFirstSearch = q === null;
              console.log("#2 q- isFirstSearch: ", q, isFirstSearch);
              submit(event.currentTarget, { replace: !isFirstSearch });
            }}
          >
            <input
              aria-label="Search contacts"
              className={searching ? "loading" : ""}
              id="q"
              name="q"
              placeholder="Search"
              type="search"
              defaultValue={q || ""}
            />
            <div aria-hidden hidden={!searching} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={
          navigation.state === "loading" && !searching ? "loading" : ""
        }
      >
        <Outlet />
      </div>
    </>
  );
}
