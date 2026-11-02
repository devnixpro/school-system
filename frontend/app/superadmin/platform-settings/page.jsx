"use client";

import { useState, useEffect } from "react";

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 1. General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "DevNixEdu",
    supportEmail: "support@devnixedu.com",
    supportPhone: "+92 319 8018471",
    timezone: "Asia/Karachi (PKT)",
    language: "English",
  });

  // 2. Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.devnixedu.com",
    smtpPort: "587",
    smtpUser: "noreply@devnixedu.com",
    smtpPassword: "••••••••••••",
    enableTLS: true,
  });

  // 3. Notifications State
  const [notifications, setNotifications] = useState({
    newSchoolRegistration: true,
    subscriptionExpiry: true,
    paymentReceived: true,
    weeklyReports: false,
    systemAlerts: true,
  });

  // GET: Backend se settings fetch karna
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/superadmin/settings", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          // Agar backend se data aata hai toh state update karein
          if (data.general) setGeneralSettings(data.general);
          if (data.email) setEmailSettings(data.email);
          if (data.notifications) setNotifications(data.notifications);
        }
      } catch (err) {
        console.log("Settings GET endpoint not ready, using dummy data.");
      }
    };
    fetchSettings();
  }, []);

  // PUT: Settings ko backend par save karna
  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/superadmin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        // Teeno states ko ek sath backend bhej rahe hain
        body: JSON.stringify({
          general: generalSettings,
          email: emailSettings,
          notifications: notifications
        })
      });

      if (!res.ok) throw new Error("Backend endpoint not ready yet. Changes not saved.");
      
      setMessage("Settings saved successfully!");
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Input Change Handlers
  const handleGeneralChange = (e) => {
    setGeneralSettings({ ...generalSettings, [e.target.name]: e.target.value });
  };

  const handleEmailChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEmailSettings({ ...emailSettings, [e.target.name]: value });
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure platform-wide settings and preferences
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg text-sm border ${message.includes("Error") ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {["General", "Email", "Notifications", "Security"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === "General" && (
            <div className="max-w-2xl space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Platform Name</label>
                <input type="text" name="platformName" value={generalSettings.platformName} onChange={handleGeneralChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
                  <input type="email" name="supportEmail" value={generalSettings.supportEmail} onChange={handleGeneralChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Phone</label>
                  <input type="text" name="supportPhone" value={generalSettings.supportPhone} onChange={handleGeneralChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                  <select name="timezone" value={generalSettings.timezone} onChange={handleGeneralChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800 bg-white">
                    <option>Asia/Karachi (PKT)</option>
                    <option>Asia/Dubai (GST)</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Language</label>
                  <select name="language" value={generalSettings.language} onChange={handleGeneralChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800 bg-white">
                    <option>English</option>
                    <option>Urdu</option>
                  </select>
                </div>
              </div>

              <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md disabled:bg-blue-400">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === "Email" && (
            <div className="max-w-2xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Host</label>
                  <input type="text" name="smtpHost" value={emailSettings.smtpHost} onChange={handleEmailChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Port</label>
                  <input type="text" name="smtpPort" value={emailSettings.smtpPort} onChange={handleEmailChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Username</label>
                <input type="text" name="smtpUser" value={emailSettings.smtpUser} onChange={handleEmailChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Password</label>
                <input type="password" name="smtpPassword" value={emailSettings.smtpPassword} onChange={handleEmailChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="enableTLS" name="enableTLS" checked={emailSettings.enableTLS} onChange={handleEmailChange} className="rounded border-gray-300 w-4 h-4" />
                <label htmlFor="enableTLS" className="text-sm text-gray-700">Enable TLS/SSL encryption</label>
              </div>
              <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md disabled:bg-blue-400">
                {loading ? "Saving..." : "Save Email Settings"}
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "Notifications" && (
            <div className="max-w-2xl space-y-4">
              {[
                { key: "newSchoolRegistration", label: "New school registration", desc: "Get notified when a new school registers" },
                { key: "subscriptionExpiry", label: "Subscription expiry alerts", desc: "Alert when a subscription is about to expire" },
                { key: "paymentReceived", label: "Payment received", desc: "Notification for successful payments" },
                { key: "weeklyReports", label: "Weekly reports", desc: "Receive weekly analytics summary" },
                { key: "systemAlerts", label: "System alerts", desc: "Important system notifications" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button onClick={() => handleNotificationChange(item.key)} className={`relative w-12 h-6 rounded-full transition ${notifications[item.key] ? "bg-blue-600" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notifications[item.key] ? "translate-x-6" : ""}`}></span>
                  </button>
                </div>
              ))}
              <button onClick={handleSave} disabled={loading} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md disabled:bg-blue-400">
                {loading ? "Saving..." : "Save Notification Settings"}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "Security" && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">⚠️ These are critical security settings. Change them only if you know what you're doing.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Timeout (minutes)</label>
                <input type="number" defaultValue="60" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Maximum Login Attempts</label>
                <input type="number" defaultValue="5" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-800" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="2fa" defaultChecked className="rounded border-gray-300 w-4 h-4" />
                <label htmlFor="2fa" className="text-sm text-gray-700">Require two-factor authentication for admins</label>
              </div>
              <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md disabled:bg-blue-400">
                {loading ? "Saving..." : "Update Security Settings"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}