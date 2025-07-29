import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="account">
          <TabsList className="w-full">
            <Skeleton className="h-10 w-1/2 rounded-md" />
            <Skeleton className="h-10 w-1/2 rounded-md" />
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-3/4" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </CardDescription>
              </CardHeader>
              <form>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Skeleton className="h-4 w-20" /> {/* Label */}
                    <Skeleton className="h-11 w-full" /> {/* Input */}
                  </div>
                  <div className="grid gap-3">
                    <Skeleton className="h-4 w-20" /> {/* Label */}
                    <Skeleton className="h-11 w-full" /> {/* Input */}
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-11 w-full" />{" "}
                  {/* Button placeholder */}
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-3/4" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </CardDescription>
              </CardHeader>
              <form>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Skeleton className="h-4 w-20" /> {/* Label */}
                    <Skeleton className="h-11 w-full" /> {/* Input */}
                  </div>
                  <div className="grid gap-3">
                    <Skeleton className="h-4 w-20" /> {/* Label */}
                    <Skeleton className="h-11 w-full" /> {/* Input */}
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-11 w-full" /> {/* Button */}
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
