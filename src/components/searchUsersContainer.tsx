import { type FormEvent, useState } from "react";
import { useGetOtherUsers } from "~/hooks/searchUserHooks";
import { useCreateFriendRequestMutation } from "~/hooks/friendHooks";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";

export function SearchUsersContainer() {
  const [searched, setSearched] = useState("");
  const getOtherUsers = useGetOtherUsers();
  const createFriendRequest = useCreateFriendRequestMutation();
  const [requestedStrangerIds, setRequestedStrangerIds] = useState<string[]>(
    [],
  );

  const handleSearchOtherUsers = (e: FormEvent) => {
    e.preventDefault();
    // if (searchRef.current) getOtherUsers.mutate(searchRef.current.value);
    getOtherUsers.mutate(searched);

    const userIds: string[] = [];
    getOtherUsers.data?.map((user) => {
      userIds.push(user.userId);
    });

    setRequestedStrangerIds(userIds);
  };

  const handleSendFriendRequest = (friendUserId: string) => {
    setRequestedStrangerIds((prev) => [...prev, friendUserId]);
    createFriendRequest.mutate(friendUserId, {
      onError: () => {
        setRequestedStrangerIds((prev) =>
          prev.filter((id) => id != friendUserId),
        );
      },
    });
  };
  return (
    <>
      <form onSubmit={handleSearchOtherUsers} className="flex gap-2">
        <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Find your peers..."
            className="w-full pr-9"
            value={searched}
            onChange={(e) => setSearched(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            onClick={() => {
              setSearched("");
              if (getOtherUsers.data) getOtherUsers.data.length = 0;
            }}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        </div>

        <Button type="submit">
          <SearchIcon />
        </Button>
      </form>
      <ul className="flex flex-col gap-2">
        {getOtherUsers.data?.map((user) => (
          <li key={user.userId} className="flex items-center gap-4">
            {user.username}
            {!requestedStrangerIds.includes(user.userId) ? (
              <Button onClick={() => handleSendFriendRequest(user.userId)}>
                Send Friend Request
              </Button>
            ) : (
              <Button disabled>Sent</Button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
