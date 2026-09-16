import { redirect } from "next/navigation";

// This build ships the Tasks module only; the root sends you into it.
export default function Home() {
  redirect("/tasks");
}
