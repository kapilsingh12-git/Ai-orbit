import { Compass } from "lucide-react";
import { StateBlock } from "@/components/states";

export default function NotFound() {
  return (
    <div className="container-page py-24">
      <StateBlock
        icon={<Compass className="h-5 w-5" />}
        title="This page doesn't exist"
        body="The link may be out of date, or the task may have been renamed. Browsing all tasks is the quickest way to find it again."
        action={{ label: "Browse all tasks", href: "/tasks" }}
      />
    </div>
  );
}
