import React from "react";
import { TeacherLayout } from "../components/Layout/TeacherLayout";
import { ProfileCard } from "../components/profile/ProfileCard";
import { PersonalInfoForm } from "../components/profile/PersonalInfoForm";
import { SecurityForm } from "../components/profile/SecurityForm";
import { getMe } from "../api/auth";

export default function UserProfilePage() {
  const [currentUser, setCurrentUser] = React.useState(() => {
    return JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
    );
  });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        if (data.success && data.user) {
          const isLocal = !!localStorage.getItem("user");
          const storage = isLocal ? localStorage : sessionStorage;
          
          // Merge avatar from existing storage if not present in backend
          const existingUser = JSON.parse(storage.getItem("user") || "{}");
          const updatedUser = {
            ...data.user,
            avatar: existingUser.avatar || data.user.avatar || "",
          };
          
          storage.setItem("user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          window.dispatchEvent(new Event("user-updated"));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    const handleUserUpdate = () => {
      const updatedUser = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
      );
      setCurrentUser(updatedUser);
    };

    window.addEventListener("user-updated", handleUserUpdate);
    return () => {
      window.removeEventListener("user-updated", handleUserUpdate);
    };
  }, []);

  return (
    <TeacherLayout>
      <div className="max-w-4xl mx-auto p-xl space-y-lg">
        <div className="mb-lg">
          <h2 className="font-display text-h1 text-on-surface font-bold">Profile</h2>
          <p className="font-body text-body text-on-surface-variant">
            Manage your account and personal information.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-2xl">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
              progress_activity
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg items-stretch">
            <div className="md:col-span-1 flex flex-col h-full">
              <ProfileCard user={currentUser} />
            </div>

            <div className="md:col-span-2 space-y-lg">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden divide-y divide-outline-variant">
                <PersonalInfoForm user={currentUser} />
                <SecurityForm />
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
