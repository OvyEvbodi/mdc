import Dashboard from "@/components/Dashboard";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "My Data Collection form responses",
  description: "All forms submissions appear here",
};

const DashboardPage = async () => {
  const session = await auth();
  if(!session) redirect("/");
  return (
    <div>DashboardPage
      <Dashboard session={session} />
    </div>
  )
}

export default DashboardPage;
