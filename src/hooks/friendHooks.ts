import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "~/lib/apiClient";
import { getCurrentUser } from "aws-amplify/auth";

interface Friend {
  id: string;
  friendId: string;
  friendName: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  status: string;
}

interface CreateFriendRequestBody {
  senderId: string;
  receiverId: string;
}

const fetchFriends = async (): Promise<Friend[]> => {
  const { userId } = await getCurrentUser();
  return await apiFetch<Friend[]>(`http://localhost:8080/friends/${userId}`);
};

export const useFriends = () => {
  return useQuery<Friend[], Error>({
    queryKey: ["friends"],
    queryFn: () => fetchFriends(),
  });
};

const createFriendRequest = async (
  receiverId: string,
): Promise<FriendRequest> => {
  const { userId: senderId } = await getCurrentUser();

  return await apiFetch<FriendRequest>(
    `http://localhost:8080/friends/request?senderId=${senderId}&receiverId=${receiverId}`,
    {
      method: "POST",
    },
  );
};

export const useCreateFriendRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: string) => createFriendRequest(receiverId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["friend-requests"],
      });
    },
  });
};

const fetchPendingFriendRequests = async () => {
  const { userId: receiverId } = await getCurrentUser();
  return await apiFetch<FriendRequest[]>(
    `http://localhost:8080/friends/pending-request/${receiverId}`,
  );
};

export const useGetPendingFriendRequests = () => {
  return useQuery<FriendRequest[], Error>({
    queryKey: ["friend-requests"],
    queryFn: fetchPendingFriendRequests,
  });
};

const acceptFriendRequest = async (senderId: string) => {
  return await apiFetch(`http://localhost:8080/friends/accept/${senderId}`, {
    method: "PUT",
  });
};

export const useAcceptFriendRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
    },
  });
};
