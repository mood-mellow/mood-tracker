"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"; // import your input component
import { getCurrentUser } from "aws-amplify/auth";
import {
  type FriendRequest,
  useAcceptFriendRequestMutation,
  useCreateFriendRequestMutation,
  useFriends,
  useGetPendingFriendRequests,
} from "~/hooks/friendHooks";
import { Navbar01 } from "~/components/ui/shadcn-io/navbar-01";
import { useGetOtherUsers, type Stranger } from "~/hooks/searchUserHooks";
import type { UseMutationResult } from "@tanstack/react-query";

export default function SocialPage() {
  const [searched, setSearched] = useState("");
  const createFriendRequest = useCreateFriendRequestMutation();
  const [isReady, setIsReady] = useState(false);
  const acceptFriendRequest = useAcceptFriendRequestMutation();
  const getOtherUsers = useGetOtherUsers();
  const getFriends = useFriends();
  const {
    data: friendRequests,
    isLoading: isLoadingRequests,
    error: requestErrors,
  } = useGetPendingFriendRequests();

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = "/bbblurry.svg";
    img.onload = () => setIsReady(true);
  }, []);

  // useEffect(() => {
  //   async function fetchUserUid() {
  //     try {
  //       const { userId } = await getCurrentUser();
  //       setUserUid(userId);
  //     } catch (error) {
  //       console.error("Error retrieving current user:", error);
  //       setUserUid(null);
  //     }
  //   }
  //
  //   fetchUserUid();
  // }, []);

  const handleSearchOtherUsers = (e: FormEvent) => {
    e.preventDefault();
    getOtherUsers.mutate(searched);
    setSearched("");
  };

  /*
  const handleAddFriend = (e: FormEvent) => {
    e.preventDefault();
    if (!searched.trim() || !userUid) return;
    createFriendRequest.mutate({
      senderId: userUid,
      receiverId: searched,
    });
    console.log("Adding friend:", searched);
    setSearched(""); // clear input
  };
*/

  // Until ready and UID fetched, show a loader or skeleton
  if (!isReady) {
    return (
      <>
        <Navbar01 />
        <div className="bg-background flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground animate-pulse">Loading…</p>
        </div>
      </>
    );
  }

  return (
    <main
      className={`min-h-screen bg-cover bg-center bg-no-repeat p-4 transition-opacity duration-700 md:p-8 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: "url(/bbblurry.svg)" }}
    >
      <span className="text-muted-foreground mb-4 block text-sm">
        {/*{userUid ? `Your UID: ${userUid}` : ""}*/}
      </span>

      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1fr_2fr]">
        {/* Friends Panel */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Friends</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Add Friend Form */}
            <form onSubmit={handleSearchOtherUsers} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter friend's name or ID"
                value={searched}
                onChange={(e) => setSearched(e.target.value)}
              />
              <Button type="submit">Add Friend</Button>
            </form>

            {getFriends.isLoading && (
              <p className="text-muted-foreground text-sm">
                Loading friends...
              </p>
            )}
            {getFriends.error && (
              <p className="text-sm">Start adding friends!</p>
            )}

            <ul className="flex flex-col gap-2">
              {getOtherUsers.data?.map((user) => (
                <li key={user.userId}>
                  {user.username}
                  <Button
                    onClick={() => createFriendRequest.mutate(user.userId)}
                  >
                    Accept
                  </Button>
                </li>
              ))}
              {/*
              {friendRequests?.map((friendRequest: FriendRequest) => (
                <li key={friendRequest.id}>
                  {friendRequest.senderName} PENDING REQ
                  <Button
                    onClick={() =>
                      acceptFriendRequest.mutate(friendRequest.id)
                    }
                  >
                    Accept
                  </Button>
                </li>
              ))}
              {friends?.map((friend) => (
                <li key={friend.id} className="bg-muted rounded-full p-4">
                  {friend.friendName}
                </li>
              ))}
*/}
            </ul>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="bg-muted rounded-md p-4">
              Alice liked your post.
            </div>
            <div className="bg-muted rounded-md p-4">
              Bob commented: “Great job!”
            </div>
            <div className="bg-muted rounded-md p-4">
              Charlie added a new photo.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
