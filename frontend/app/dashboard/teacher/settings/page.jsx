export default function TeacherSettingsPage() {
  return (
    <div className="min-h-screen bg-[#f4f6f9] p-2 text-gray-800 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your teacher account with help from your school administrator.
          </p>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Profile and security</h2>
          <p className="mt-2 text-sm text-gray-600">
            Contact your school administrator to update your profile or account
            security details.
          </p>
        </section>
      </div>
    </div>
  );
}