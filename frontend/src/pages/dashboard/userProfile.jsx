import React from 'react';

const UserProfile = () => {
  return (
    <div>
          <nav className="bg-blue-100 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-blue-600">
              Logo
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <a
              href="/userRent"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              HOME
            </a>
            <a
              href="/userRentlist"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              My RENTALS
            </a>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <a
              href="/userprofile"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Profile
            </a>
            <a
              href="/logout"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Logout
            </a>
          </div>
        </div>
      </nav>
    <div className="container mx-auto p-6 bg-gray-100">
      <h4 className="font-bold text-2xl mb-4">Account Settings</h4>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex">
          <div className="w-1/4 bg-gray-50">
            <div className="flex flex-col">
              <a href="#account-general" className="py-3 px-6 text-gray-800 hover:bg-gray-200 active:bg-gray-300">General</a>
              <a href="#account-change-password" className="py-3 px-6 text-gray-800 hover:bg-gray-200 active:bg-gray-300">Change Password</a>
              <a href="#account-info" className="py-3 px-6 text-gray-800 hover:bg-gray-200 active:bg-gray-300">Info</a>
              <a href="#account-social-links" className="py-3 px-6 text-gray-800 hover:bg-gray-200 active:bg-gray-300">Social Links</a>
              <a href="#account-connections" className="py-3 px-6 text-gray-800 hover:bg-gray-200 active:bg-gray-300">Connections</a>
              <a href="#account-notifications" className="py-3 px-6 text-gray-800 hover:bg-gray-200 active:bg-gray-300">Notifications</a>
            </div>
          </div>
          <div className="w-3/4 p-6">
            <div className="tab-content">
              <div className="tab-pane active" id="account-general">
                <div className="flex items-center mb-4">
                  <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="Profile" className="w-20 h-20 rounded-full" />
                  <div className="ml-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">Upload new photo</button>
                    <button className="bg-gray-300 text-gray-800 py-2 px-4 rounded ml-2">Reset</button>
                    <p className="text-gray-600 text-sm mt-2">Allowed JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded" defaultValue="nmaxwell" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded" defaultValue="Nelle Maxwell" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">E-mail</label>
                    <input type="email" className="mt-1 p-2 w-full border border-gray-300 rounded" defaultValue="nmaxwell@mail.com" />
                    <div className="bg-yellow-100 p-2 mt-2 text-sm text-yellow-800">
                      Your email is not confirmed. Please check your inbox.
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input type="text" className="mt-1 p-2 w-full border border-gray-300 rounded" defaultValue="Company Ltd." />
                  </div>
                </div>
              </div>

              <div className="tab-pane" id="account-change-password">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input type="password" className="mt-1 p-2 w-full border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input type="password" className="mt-1 p-2 w-full border border-gray-300 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Repeat New Password</label>
                    <input type="password" className="mt-1 p-2 w-full border border-gray-300 rounded" />
                  </div>
                </div>
              </div>

              {/* Add other tabs (Info, Social Links, Connections, etc.) as needed */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button className="bg-blue-500 text-white py-2 px-6 rounded">Save Changes</button>
        <button className="bg-gray-300 text-gray-800 py-2 px-6 rounded">Cancel</button>
      </div>
    </div>
    </div>
  );
}

export default UserProfile;
