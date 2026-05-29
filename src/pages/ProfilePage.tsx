import { useState } from "react";
import { PencilIcon, CheckCircleIcon, CloseLineIcon, UserCircleIcon, BoxCubeIcon, LockIcon } from "../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingOrg, setIsEditingOrg] = useState(false);

  const [personalData, setPersonalData] = useState({
    fullName: "John Doe",
    email: "john@company.com",
  });

  const [organizationData, setOrganizationData] = useState({
    companyName: "Acme Corporation",
    website: "https://acmecorp.com",
    phone: "+1 (234) 567-8900",
  });

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrgChange = (field: string, value: string) => {
    setOrganizationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonal = () => {
    console.log("Saving personal data:", personalData);
    setIsEditingPersonal(false);
  };

  const handleSaveOrg = () => {
    console.log("Saving organization data:", organizationData);
    setIsEditingOrg(false);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: UserCircleIcon },
    { id: "organization", label: "Organization", icon: BoxCubeIcon },
    { id: "security", label: "Security", icon: LockIcon },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your personal and organization information</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                isActive
                  ? "text-brand-600 dark:text-brand-400 border-brand-600 dark:border-brand-400"
                  : "text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              <div className="w-5 h-5">
                <IconComponent />
              </div>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
              <button
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                style={{
                  backgroundColor: isEditingPersonal ? "#f3f4f6" : "#e7f0ff",
                  color: isEditingPersonal ? "#666" : "#1e56db",
                }}
              >
                {isEditingPersonal ? (
                  <>
                    <div className="w-4 h-4">
                      <CloseLineIcon />
                    </div>
                    Cancel
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4">
                      <PencilIcon />
                    </div>
                    Edit
                  </>
                )}
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={personalData.fullName}
                    onChange={(e) => handlePersonalChange("fullName", e.target.value)}
                    disabled={!isEditingPersonal}
                    className={!isEditingPersonal ? "opacity-75 cursor-not-allowed" : ""}
                  />
                </div>

                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                    disabled={!isEditingPersonal}
                    className={!isEditingPersonal ? "opacity-75 cursor-not-allowed" : ""}
                  />
                </div>
              </div>

              {isEditingPersonal && (
                <button
                  onClick={handleSavePersonal}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <div className="w-4 h-4">
                    <CheckCircleIcon />
                  </div>
                  Save Changes
                </button>
              )}
            </div>
          </div>
        )}

        {/* Organization Tab */}
        {activeTab === "organization" && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Organization Details</h2>
              <button
                onClick={() => setIsEditingOrg(!isEditingOrg)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                style={{
                  backgroundColor: isEditingOrg ? "#f3f4f6" : "#e7f0ff",
                  color: isEditingOrg ? "#666" : "#1e56db",
                }}
              >
                {isEditingOrg ? (
                  <>
                    <div className="w-4 h-4">
                      <CloseLineIcon />
                    </div>
                    Cancel
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4">
                      <PencilIcon />
                    </div>
                    Edit
                  </>
                )}
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Company Name</Label>
                  <Input
                    type="text"
                    value={organizationData.companyName}
                    onChange={(e) => handleOrgChange("companyName", e.target.value)}
                    disabled={!isEditingOrg}
                    className={!isEditingOrg ? "opacity-75 cursor-not-allowed" : ""}
                  />
                </div>

                <div>
                  <Label>Website</Label>
                  <Input
                    type="url"
                    value={organizationData.website}
                    onChange={(e) => handleOrgChange("website", e.target.value)}
                    disabled={!isEditingOrg}
                    className={!isEditingOrg ? "opacity-75 cursor-not-allowed" : ""}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={organizationData.phone}
                    onChange={(e) => handleOrgChange("phone", e.target.value)}
                    disabled={!isEditingOrg}
                    className={!isEditingOrg ? "opacity-75 cursor-not-allowed" : ""}
                  />
                </div>
              </div>

              {isEditingOrg && (
                <button
                  onClick={handleSaveOrg}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <div className="w-4 h-4">
                    <CheckCircleIcon />
                  </div>
                  Save Changes
                </button>
              )}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>

            <div className="space-y-6">
              {/* Change Password */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div>
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Enable 2FA</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security with two-factor authentication</p>
                  </div>
                  <button className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors duration-200">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
