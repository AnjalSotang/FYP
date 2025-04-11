import DashboardLayout from '@/components/layout/DashboardLayout'
import SettingsForm from './components/settingForm'

export default function SettingsPage() {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6 m-form-padding">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your fitness platform settings.</p>
          </div>
          
          <SettingsForm />
        </div>
      </DashboardLayout>
    )
  }