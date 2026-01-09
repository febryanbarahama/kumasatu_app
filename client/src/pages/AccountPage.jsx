import React from "react";
import AccountInfoForm from "../components/account/ProfileForm.jsx";
import PasswordChangeForm from "../components/account/PasswordChangeForm.jsx";

export default function AccountPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Pengaturan Akun</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola informasi akun & keamanan Anda.
        </p>
      </div>

      {/* Update Info */}
      <AccountInfoForm />

      {/* Ganti Password */}
      <PasswordChangeForm />
    </div>
  );
}
