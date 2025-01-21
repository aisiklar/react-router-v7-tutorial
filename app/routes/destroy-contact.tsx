import React from "react";
import type { Route } from "../+types/root";
import { redirect } from "react-router";
import { deleteContact } from "../data";

export async function action({ params }: Route.ActionArgs) {
  console.log("in action, destroy contact, params: ", params);
  deleteContact(params.contactId as string);
  return redirect("/");
}

export default function DestroyContact() {
  return <div></div>;
}
