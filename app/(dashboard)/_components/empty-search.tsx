import Image from "next/image";

export const EmptySearch = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image src="/empty-search.png" alt="Empty " width={140} height={140} />
      <h2 className=" text-2xl font-semibold mt-6">No results found!</h2>
      <h2 className=" text-muted-foreground text-sm mt-2">
        Try searching for something else
      </h2>
    </div>
  );
};
