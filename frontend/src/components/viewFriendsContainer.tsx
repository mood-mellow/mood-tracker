"use client";
import {
  useAcceptFriendRequestMutation,
  useFriends,
  useGetPendingFriendRequests,
  type FriendRequest,
} from "~/hooks/friendHooks";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar } from "~/components/ui/gravatar";
import { useState, useEffect } from "react";

export function ViewFriendsContainer() {
  const acceptFriendRequest = useAcceptFriendRequestMutation();
  const pendingFriendRequests = useGetPendingFriendRequests();
  const [pendingRequestsState, setPendingRequestsState] = useState<
    FriendRequest[]
  >([]);
  const [render, rerender] = useState(false);
  const friends = useFriends();

  useEffect(() => {
    if (pendingFriendRequests.data)
      setPendingRequestsState(pendingFriendRequests.data);
  }, [pendingFriendRequests.data]);

  const handleAccept = (id: string) => {
    acceptFriendRequest.mutate(id);
    setPendingRequestsState((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <>
      <ul className="flex flex-col gap-2">
        {pendingRequestsState?.map((friendRequest: FriendRequest) => (
          <li
            key={friendRequest.id}
            className="flex w-full items-center justify-between"
          >
            <span className="flex items-center gap-x-4">
              <Avatar fallback={friendRequest.receiverName} />
              <span className="text-bold">{friendRequest.senderName}</span>{" "}
            </span>
            <Button onClick={() => handleAccept(friendRequest.id)}>
              Accept Friend Request
            </Button>
          </li>
        ))}
        {friends.data?.map((friend) => (
          <li key={friend.id} className="bg-muted rounded-full p-4">
            <span className="flex items-center gap-x-4">
              <Avatar fallback={friend.friendName} />
              <span className="text-bold">{friend.friendName}</span>{" "}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
