import { useState } from "react";
import { useMutation } from "convex/react";

/**
 * In this types didn't work
 * But this is fun way to explore the wrapper hook function to not have to create a pending state each time we mutate
 */
export const useApiMutation = (mutationFunction: any) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = (payload: any) => {
    setPending(true);
    return apiMutation(payload)
      .finally(() => setPending(false))
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  };
  return { mutate, pending };
};
