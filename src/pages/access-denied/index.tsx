import { signOut } from "next-auth/react";
import { Button } from "@heroui/button";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AccessDeniedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: false });
      await router.push("/sign-in");
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 dark:bg-zinc-950 text-red-600">
      <h1 className="text-4xl font-bold">Access Denied</h1>
      <p className="mt-4 text-lg">You do not have permission to view this page.</p>
      <Button 
        variant="flat" 
        color="primary" 
        onPress={handleBack} 
        isDisabled={isLoading} 
        className="mt-6"
      >
        {isLoading ? "Redirecting..." : "Back to Sign-In"}
      </Button>
    </div>
  );
}
