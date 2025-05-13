
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Session } from "next-auth";
import ResponsesDashboard from "./ResponsesDashboard";


const Dashboard = ({ session }: {session: Session | null}) => {
  return (
    <div>{session?.user?.email}
      <Tabs defaultValue="responses" className="">
        <TabsList>
          <TabsTrigger value="responses">responses</TabsTrigger>
          <TabsTrigger value="analytics">analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="responses">
          <ResponsesDashboard />
        </TabsContent>
        <TabsContent value="analytics"> your analytics will show up here.</TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard;