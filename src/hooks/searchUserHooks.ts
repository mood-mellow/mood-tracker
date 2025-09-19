import { getCurrentUser } from "aws-amplify/auth";
import { apiFetch } from "~/lib/apiClient";
import { useMutation, useQueryClient} from "@tanstack/react-query";

export interface Stranger {
  userId: string;
  username: string;
}

const fetchOtherUsers = async (searchedUsername: string) => {
  const { userId: clientUserId } = await getCurrentUser();
  return await apiFetch<Stranger[]>(
    `http://localhost:8080/users/${clientUserId}/search/${searchedUsername}`,
  );
}

export const useGetOtherUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (searchedUsername: string) => fetchOtherUsers(searchedUsername),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["search-users"] });
    },
  });
}