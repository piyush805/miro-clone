import Image from "next/image";

export const EmptyFavorite = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image src="/empty-favorite.png" alt="Empty " width={140} height={140} />
      <h2 className=" text-2xl font-semibold mt-6">No favorite boards!</h2>
      <h2 className=" text-muted-foreground text-sm mt-2">
        Try favoriting a board
      </h2>
    </div>
  );
};
