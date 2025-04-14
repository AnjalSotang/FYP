import NotificationsTable from "./components/notificationTables";
import RootLayout from "../../../components/layout/UserLayout";


export default function NotificationPage() {
  return (
    <RootLayout>
      {/* <div className="flex flex-col px-2"> */}
      <div className="container mx-auto py-9 px-12">

        <h1 className="text-3xl font-bold mb-1 tracking-tighter">Notifications</h1>
        <p className="text-muted-foreground mb-4">
        Manage and view all notifications.
        </p>
        <NotificationsTable />
      </div>
  
    </RootLayout>
  );
}