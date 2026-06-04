import React, { useState, useEffect } from "react";
import { updateUserProfile } from "../../api/auth";
import toast from "react-hot-toast";

interface PersonalInfoFormProps {
  user: {
    name?: string;
    email?: string;
  };
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Valid email is required");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      const data = await updateUserProfile(formData);
      if (data.success && data.user) {
        const isLocal = !!localStorage.getItem("user");
        const storage = isLocal ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("user-updated"));
        toast.success("Personal information updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-lg space-y-lg">
      <div className="flex items-center gap-sm mb-md">
        <span className="material-symbols-outlined text-primary text-2xl">
          person
        </span>
        <h3 className="font-display text-h3 text-on-surface font-bold">
          Personal Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="space-y-sm">
          <label className="font-label text-label text-on-surface-variant block font-medium">
            Full Name
          </label>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-sm">
          <label className="font-label text-label text-on-surface-variant block font-medium">
            Email Address
          </label>
          <input
            className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-md py-sm text-body text-on-surface-variant cursor-not-allowed opacity-75 outline-none select-none"
            type="email"
            value={email}
            readOnly
          />
        </div>
      </div>

      <div className="flex justify-end gap-md pt-sm">
        <button
          type="submit"
          disabled={isSaving}
          className="px-xl py-2 font-label text-body text-on-primary bg-primary rounded-lg shadow-md hover:bg-primary-container transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
