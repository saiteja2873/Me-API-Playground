import { useEffect, useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import ProfileForm from "../components/ProfileForm";
import ProfileView from "../components/ProfileView";
import ConfirmModal from "../components/ConfirmModal";
import { Profile } from "../types/profile";

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://me-api-playground-3-hlsg.onrender.com/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data: Profile | null = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleCreate = async (data: Profile) => {
    try {
      const payload = { ...data };
      delete (payload as any).id;

      const res = await fetch("https://me-api-playground-3-hlsg.onrender.com/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create profile");

      const createdProfile: Profile = await res.json();
      setProfile(createdProfile);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create profile. Check console.");
    }
  };

  const handleUpdate = async (data: Profile) => {
    if (!data.id) {
      alert("No profile selected to update.");
      return;
    }

    try {
      const payload = { ...data };
      delete (payload as any).id;

      const res = await fetch(`https://me-api-playground-3-hlsg.onrender.com/profile/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedProfile: Profile = await res.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Check console.");
    }
  };

  const handleDeleteAndCreate = () => setShowConfirm(true);

  const confirmDelete = async () => {
    try {
      if (profile?.id) {
        await fetch(`https://me-api-playground-3-hlsg.onrender.com/profile/${profile.id}`, {
          method: "DELETE",
        });
      }
      setProfile(null);
      setIsEditing(true);
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile.");
    } finally {
      setShowConfirm(false);
    }
  };

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <div className="flex gap-3">
          {profile && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={profile ? handleDeleteAndCreate : () => setIsEditing(true)}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isEditing && (
        <ProfileForm
          initialData={profile}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {!profile && !isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mt-20 p-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-400"
        >
          <p className="text-xl mb-4">No profile found.</p>
          <p className="mb-6">Click the button above to create your profile.</p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Create Profile
            </button>
          </motion.div>
        </motion.div>
      )}

      {profile && !isEditing && <ProfileView profile={profile} />}

      {showConfirm && (
        <ConfirmModal
          message="Do you want to delete existing profile?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
