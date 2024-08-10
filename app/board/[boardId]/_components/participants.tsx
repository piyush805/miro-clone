import { Skeleton } from "@/components/ui/skeleton";

export const Participants = () => {
  return (
    <div className="absolute top-2 right-2 bg-white rounded-mg px-3 h-12 flex items-center shadow-md">
      List of Users
    </div>
  );
};

export const ParticipantsSkeleton = () => {
  return (
    <div className="absolute top-2 right-2 bg-white rounded-mg px-3 h-12 flex items-center shadow-md w-[100px]" />
  );
};
