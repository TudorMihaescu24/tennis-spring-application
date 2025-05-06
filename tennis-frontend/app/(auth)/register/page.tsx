import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterPlayerForm from "@/components/RegisterPlayer";
import RegisterRefereeForm from "@/components/RegisterReferee";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  return (
    <div className="w-full h-screen max-h-screen flex items-center justify-center ">
      <Card className="w-full max-w-md py-10 px-5">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <Tabs
          defaultValue="player"
          className="flex items-center justify-center w-full"
        >
          <TabsList className="flex flex-row items-center w-[80%] border-1 ">
            <TabsTrigger value="player">Player</TabsTrigger>
            <TabsTrigger value="referee">Referee</TabsTrigger>
          </TabsList>
          <TabsContent
            value="player"
            className="h-full w-full overflow-scroll p-2"
          >
            <RegisterPlayerForm />
          </TabsContent>
          <TabsContent
            value="referee"
            className="h-full w-full overflow-auto p-2"
          >
            <RegisterRefereeForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
