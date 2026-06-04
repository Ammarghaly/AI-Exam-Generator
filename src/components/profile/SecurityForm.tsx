import React, { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../api/auth";

export function SecurityForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (!password) {
      toast.error("Password cannot be empty");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSaving(true);
    try {
      const res = await changePassword(currentPassword, password);
      if (res && res.success) {
        toast.success(res.message || "Password updated successfully");
        setCurrentPassword("");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res?.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update password",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-lg space-y-lg">
      <div className="flex items-center gap-sm mb-md">
        <span className="material-symbols-outlined text-primary text-2xl">
          security
        </span>
        <h3 className="font-display text-h3 text-on-surface font-bold">
          Password &amp; Security
        </h3>
      </div>

      <div className="space-y-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="space-y-sm">
            <label className="font-label text-label text-on-surface-variant block font-medium">
              Current Password
            </label>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="••••••••"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-sm">
            <label className="font-label text-label text-on-surface-variant block font-medium">
              New Password
            </label>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-sm">
            <label className="font-label text-label text-on-surface-variant block font-medium">
              Confirm Password
            </label>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSaving}
            />
          </div>
        </div>
        <p className="font-body text-small text-on-surface-variant">
          Password must be at least 8 characters and include a mix of letters,
          numbers, and symbols.
        </p>
      </div>

      <div className="flex justify-end gap-md pt-sm">
        <button
          type="submit"
          disabled={isSaving}
          className="px-xl py-2 font-label text-body text-on-primary bg-primary rounded-lg shadow-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}
