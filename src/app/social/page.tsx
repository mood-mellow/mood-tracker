"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  useAcceptFriendRequestMutation,
  useFriends,
  useGetPendingFriendRequests,
} from "~/hooks/friendHooks";
import { Navbar01 } from "~/components/ui/shadcn-io/navbar-01";
import { SearchUsersContainer } from "~/components/searchUsersContainer";
import { Button } from "~/components/ui/button";
import { ViewFriendsContainer } from "~/components/viewFriendsContainer";

enum FriendsPanel {
  Friends,
  Search,
}

export default function SocialPage() {
  const [isReady, setIsReady] = useState(false);
  const [friendsPanel, setFriendsPanel] = useState<FriendsPanel>(
    FriendsPanel.Friends,
  );

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = "/bbblurry.svg";
    img.onload = () => setIsReady(true);
  }, []);

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
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Friends</CardTitle>
            {friendsPanel == FriendsPanel.Friends ? (
              <Button onClick={() => setFriendsPanel(FriendsPanel.Search)}>
                Add Friends
              </Button>
            ) : (
              <Button onClick={() => setFriendsPanel(FriendsPanel.Friends)}>
                Back
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {friendsPanel == FriendsPanel.Friends ? (
              <ViewFriendsContainer />
            ) : (
              <SearchUsersContainer />
            )}
            {/*
            <ul className="flex flex-col gap-2">
              {getOtherUsers.data?.map((user) => (
                <li key={user.userId} className="flex items-center gap-4">
                  {user.username}
                  {!requestedStrangerIds.includes(user.userId) ? (
                    <Button
                      onClick={() => handleSendFriendRequest(user.userId)}
                    >
                      Send Friend Request
                    </Button>
                  ) : (
                    <Button disabled>Sent</Button>
                  )}
                </li>
              ))}
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
            </ul>
*/}
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
