import React, { useRef, useState } from "react";
import { updateUserProfile } from "../../api/auth";
import toast from "react-hot-toast";

interface ProfileCardProps {
  user: {
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    subjects_taught?: string;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const data = await updateUserProfile(formData);
      if (data.success && data.user) {
        const isLocal = !!localStorage.getItem("user");
        const storage = isLocal ? localStorage : sessionStorage;
        storage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("user-updated"));
        toast.success("Profile photo updated successfully!");
      } else {
        toast.error("Failed to update profile photo");
      }
    } catch  {
      toast.error("Failed to update profile photo");
    } finally {
      setIsUpdating(false);
    }
  };

  const defaultAvatar =
    "https://res.cloudinary.com/dgjw80t8x/image/upload/q_auto/f_auto/v1780575623/mostafamagdy_hsjbw3.png";

  return (
    <div className="bg-surface-container-lowest p-lg rounded-xl shadow-sm border border-outline-variant text-center flex flex-col items-center justify-center h-full min-h-[350px]">
      <div className="relative w-32 h-32 mx-auto mb-md group cursor-pointer">
        <img
          alt="User Avatar"
          className="w-full h-full rounded-full object-cover border-4 border-surface-container-high shadow-md transition-all group-hover:opacity-85"
          src={user.avatar || defaultAvatar}
        />
        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined text-white text-3xl">
            photo_camera
          </span>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUpdating}
          />
        </label>
      </div>
      <h3 className="font-display text-h3 text-on-surface font-bold mb-1">
        {user.name || ""}
      </h3>
      <p className="font-body text-small text-on-surface-variant mb-xs">
        {user.role || "Teacher"}
      </p>
      {user.subjects_taught ? (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs mb-lg">
          <span className="material-symbols-outlined text-xs">menu_book</span>
          <span>{user.subjects_taught}</span>
        </div>
      ) : (
        <div className="h-7 mb-lg" />
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUpdating}
        className="w-full py-2 px-md border border-outline text-primary font-bold rounded-lg hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer disabled:opacity-50"
      >
        {isUpdating ? "Updating..." : "Update Photo"}
      </button>
    </div>
  );
}
