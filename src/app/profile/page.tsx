"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { User, MapPin, Briefcase, Facebook, Twitter, Linkedin, Instagram, Pencil } from "lucide-react";
import { profileData } from "@/hooks/useDashboardData";

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">User Profile</h1>
      </div>

      {/* Profile Header Card */}
      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Cover */}
        <div className="h-40 bg-gradient-to-r from-primary to-primary/60" />

        <div className="relative px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-5">
            <div className="-mt-14 flex h-28 w-28 items-center justify-center rounded-full border-4 border-card bg-primary/10">
              <User className="h-14 w-14 text-primary" />
            </div>
            <div className="mt-3 flex-1 text-center sm:mt-0 sm:text-left">
              <h2 className="text-xl font-bold text-card-foreground">{profileData.name}</h2>
              <div className="mt-1 flex flex-col items-center gap-2 sm:flex-row">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" /> {profileData.role}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {profileData.location}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 sm:mt-0">
              <div className="flex items-center gap-1.5">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <button
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm">
                <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Personal Information */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-card-foreground">Personal Information</h3>
            <Button variant="ghost" size="sm">
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "First Name", value: profileData.firstName },
              { label: "Last Name", value: profileData.lastName },
              { label: "Email", value: profileData.email },
              { label: "Phone", value: profileData.phone },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="mt-1 text-sm font-medium text-card-foreground">{field.value}</p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Bio</p>
              <p className="mt-1 text-sm text-card-foreground">{profileData.bio}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold text-card-foreground">Address</h3>
            <Button variant="ghost" size="sm">
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Country", value: profileData.country },
              { label: "City/State", value: profileData.city },
              { label: "Postal Code", value: profileData.postalCode },
              { label: "TAX ID", value: profileData.taxId },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-xs text-muted-foreground">{field.label}</p>
                <p className="mt-1 text-sm font-medium text-card-foreground">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

