"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/app/redux/feature/profileAPI";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<File | null>(null); // Fixed spelling and type

  const router = useRouter();
  const { data: userProfile, isLoading, refetch } = useGetProfileQuery("");
  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    if (userProfile?.data) {
      setFormData({
        name: userProfile.data.name || "",
        image: userProfile.data.image || "",
      });
      // Set initial profile image if available
      if (userProfile.data.image) {
        setProfileImage(
          `${process.env.NEXT_PUBLIC_IMAGE_URL}${userProfile.data.image}`
        );
      }
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Name and phone are required!");
      return;
    }

    const formDataHere = new FormData();
    formDataHere.append("name", formData.name);

    if (avatar instanceof File) {
      formDataHere.append("image", avatar);
    }

    try {
      const res = await updateProfile(formDataHere).unwrap(); // Use unwrap for better error handling
      if (res?.success) {
        toast.success("Profile updated successfully!");
        refetch();
        router.push("/profile");
      } else {
        toast.error("Failed to update profile!");
        console.error("API Error:", res?.error);
      }
    } catch (error) {
      toast.error("Failed to update profile!");
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 w-full">
        <main className="w-full p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image Section */}
                <div className="w-full md:w-64 flex flex-col items-center rounded-md p-6 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400">
                  <div
                    className="relative mb-4 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <div className="w-32 h-32 rounded-full overflow-hidden relative">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Image
                          src="/default-profile.png" // Fallback image
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-200">
                      <Camera className="h-6 w-6 text-gray-600" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      aria-label="Upload profile image"
                    />
                  </div>
                  <span className="text-base text-gray-300">Profile</span>
                  <span className="font-medium text-xl text-gray-100">
                    Admin
                  </span>
                </div>

                {/* Form Fields Section */}
                <div className="flex-1 space-y-4">
                  <div className="relative h-12 bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 rounded-3xl">
                    <label
                      htmlFor="name"
                      className="absolute top-1/2 -translate-y-1/2 left-4 text-lg font-medium text-primary"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.00033 8.00065C9.84127 8.00065 11.3337 6.50827 11.3337 4.66732C11.3337 2.82637 9.84127 1.33398 8.00033 1.33398C6.15938 1.33398 4.66699 2.82637 4.66699 4.66732C4.66699 6.50827 6.15938 8.00065 8.00033 8.00065Z"
                          stroke="#B0B0B0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.7268 14.6667C13.7268 12.0867 11.1601 10 8.0001 10C4.8401 10 2.27344 12.0867 2.27344 14.6667"
                          stroke="#B0B0B0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 text-lg text-white bg-transparent pl-12"
                      placeholder="Enter your name"
                      aria-label="Name"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#5CE1E6] hover:bg-[#4CD4D9] text-white font-semibold rounded-full px-6 py-2 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;
