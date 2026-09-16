import { TaskCollectionSkeleton } from "@/components/states";

export default function Loading() {
  return (
    <div className="container-page py-10 lg:py-14">
      <div className="max-w-3xl">
        <div className="skeleton h-12 w-2/3" />
        <div className="skeleton mt-5 h-4 w-full max-w-xl" />
        <div className="skeleton mt-2 h-4 w-3/4 max-w-lg" />
        <div className="mt-8 flex gap-10">
          <div className="skeleton h-8 w-24" />
          <div className="skeleton h-8 w-28" />
          <div className="skeleton h-8 w-24" />
        </div>
      </div>
      <div className="mt-10 flex gap-2">
        <div className="skeleton h-11 flex-1" />
        <div className="skeleton h-11 w-[88px]" />
      </div>
      <div className="mt-4 flex gap-2">
        {[64, 80, 72, 88, 68, 76].map((w, i) => (
          <div key={i} className="skeleton h-9" style={{ width: w }} />
        ))}
      </div>
      <div className="mt-12">
        <TaskCollectionSkeleton count={9} />
      </div>
    </div>
  );
}
