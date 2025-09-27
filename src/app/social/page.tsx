"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

  return (
    <>
      <Navbar01 />
      <main
        className={`min-h-screen bg-cover bg-center bg-no-repeat p-4 transition-opacity duration-700 md:p-8 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: "url(/bbblurry.svg)" }}
      >
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
    </>
  );
}
