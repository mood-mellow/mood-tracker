import { useRef } from "react";
import { apiFetch } from "~/lib/apiClient";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function TestApiCall() {
  const inputRef = useRef<HTMLInputElement>(null);
  async function callAPI(apiCall: string) {
    const call = await apiFetch<string>(apiCall);
    console.log(call);
  }
  return (
    <div className="m-3 grid items-center justify-center gap-4 rounded-sm border border-gray-400 p-4">
      <h3>Debug API Calls</h3>
      <Input
        placeholder="http://localhost:8080/test/hello/james"
        ref={inputRef}
      />
      <Button
        onClick={async () => {
          if (inputRef.current?.value) {
            console.log("test");
            await callAPI(inputRef.current.value);
          }
        }}
      >
        Submit
      </Button>
    </div>
  );
}
