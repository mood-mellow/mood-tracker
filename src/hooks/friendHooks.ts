import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "~/lib/apiClient";

interface Friend {
  id: string;
  friendId: string;
  friendName: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
}

const fetchFriends = async (userId: string): Promise<Friend[]> => {
  return await apiFetch<Friend[]>(`http://localhost:8080/friends/${userId}`);
};

export const useFriends = (userId: string) => {
  return useQuery<Friend[], Error>({
    queryKey: ["friends", userId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey; // queryKey = ["friends", userId]
      return fetchFriends(id as string);
    },
    enabled: !!userId,
  });
};
