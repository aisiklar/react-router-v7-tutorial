import { Form, useLoaderData } from "react-router";

import { getContact, type ContactRecord } from "../data";
import type { Route } from "../+types/root";

export async function loader({ params }: Route.LoaderArgs) {
  console.log("in loader in Contact route...");
  const contactId = params.contactId;
  const contact = await getContact(contactId);
  console.log("contact in loader: ", contact);
  if (!contact) {
    throw new Response(
      "[custom msg] Hey there, sorry, this contact is Not Found",
      { status: 404 }
    );
  }
  return { contact };
}

export default function Contact() {
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placecats.com/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  const { contact } = useLoaderData();
  console.log("contact in Contact: ", contact);

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<ContactRecord, "favorite"> }) {
  const favorite = contact.favorite;
  console.log("#1 contact in Favorite: ", contact);

  return (
    <Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}
