import NotificationsTable from "./components/notificationTables";
import DashboardLayout from '@/components/layout/DashboardLayout'


export default function NotificationPage() {
    return (
    <DashboardLayout>
      {/* <div className="flex flex-col px-2"> */}
         <div className="container mx-auto py-9 px-12">
   
           <h1 className="text-3xl font-bold mb-1 tracking-tighter">Notifications</h1>
           <p className="text-muted-foreground mb-8">
           Manage and view all system notifications.
           </p>
           <NotificationsTable />
         </div>
     
      </DashboardLayout>
    );
  }