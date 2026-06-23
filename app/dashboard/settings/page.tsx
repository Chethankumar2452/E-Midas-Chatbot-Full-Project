"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, User, Database, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    leadNotifications: true,
    weeklyReports: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Account settings updated successfully");
  };

  const handleNotificationUpdate = () => {
    toast.success("Notification settings updated");
  };

  const handleSecurityUpdate = () => {
    toast.success("Security settings updated");
  };

  const SettingTab = ({
    icon: Icon,
    label,
    value,
    onClick,
  }: {
    icon: any;
    label: string;
    value: string;
    onClick: () => void;
  }) => (
    <motion.button
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        activeTab === value
          ? "bg-gradient-primary text-white shadow-lg"
          : "bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-800/50"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 space-y-2">
            <SettingTab icon={User} label="Account" value="account" onClick={() => setActiveTab("account")} />
            <SettingTab icon={Bell} label="Notifications" value="notifications" onClick={() => setActiveTab("notifications")} />
            <SettingTab icon={Shield} label="Security" value="security" onClick={() => setActiveTab("security")} />
            <SettingTab icon={Database} label="Data" value="data" onClick={() => setActiveTab("data")} />
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Account Settings */}
          {activeTab === "account" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>

              <form onSubmit={handleAccountUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-6 border-t border-white/20">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition font-medium"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h2>

              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Receive notifications when this event occurs
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleNotificationUpdate}
                className="w-full mt-6 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                Save Preferences
              </button>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactor}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        twoFactor: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/30 dark:bg-slate-800/30 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Login Alerts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={securitySettings.loginAlerts}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        loginAlerts: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <select
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        sessionTimeout: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 glass-bg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSecurityUpdate}
                className="w-full mt-6 px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                Update Security
              </button>
            </motion.div>
          )}

          {/* Data Settings */}
          {activeTab === "data" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Data & Storage</h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-blue-900 dark:text-blue-300">Storage Usage</p>
                  <div className="mt-3 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: "35%" }} />
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">350 MB of 1 GB used</p>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="font-semibold text-amber-900 dark:text-amber-300 mb-3">Data Export</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
                    Download all your data in a secure format
                  </p>
                  <button className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition">
                    Export Data
                  </button>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-900 dark:text-red-300 mb-3">Danger Zone</p>
                  <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                    This action cannot be undone
                  </p>
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                    Delete All Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
