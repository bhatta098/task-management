import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FolderSearch,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCircle2,
  Users,
} from "lucide-react";

import api from "../services/api";
import useStore from "../store/useStore";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const EMPTY_FORM = { name: "", email: "", phone: "", address: "", dob: "" };

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dob) {
  if (!dob) return "-";
  try {
    return new Date(dob).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dob;
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const {
    user,
    refreshToken,
    logout,
    profiles,
    pagination,
    searchTerm,
    isLoading,
    error,
    setProfiles,
    setLoading,
    setError,
    setPage,
    setSearch,
  } = useStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/profiles", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
        },
      });
      setProfiles(data.data, data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profiles.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchTerm, setLoading, setError, setProfiles]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    const totalPages = Math.max(1, pagination.totalPages || 1);
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [pagination.page, pagination.totalPages]);

  const visibleProfiles = Math.min(profiles.length, pagination.limit);

  const openCreate = () => {
    setEditingProfile(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setIsDialogOpen(true);
  };

  const openEdit = (profile) => {
    setEditingProfile(profile);
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      address: profile.address || "",
      dob: profile.dob || "",
    });
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!profileToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/api/profiles/${profileToDelete.id}`);
      setProfileToDelete(null);
      await fetchProfiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete profile.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", { refreshToken });
    } catch {
      // Continue local logout even when API call fails.
    }
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(form.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      if (editingProfile) {
        await api.put(`/api/profiles/${editingProfile.id}`, form);
      } else {
        await api.post("/api/profiles", form);
      }
      setIsDialogOpen(false);
      await fetchProfiles();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMessage = profileToDelete
    ? `This will permanently remove ${profileToDelete.name} from your team directory.`
    : "";

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const roleLabel = (user?.role || "User").toString();
  const tabItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: UserCircle2 },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  const tabTitle = activeTab === "dashboard" ? "Dashboard" : activeTab === "profile" ? "Profile" : "Settings";
  const metricCards = [
    { label: "Total Profiles", value: pagination.total, icon: Users },
    { label: "Showing", value: visibleProfiles, icon: ClipboardList },
    { label: "Current Page", value: pagination.page, icon: LayoutDashboard },
    { label: "Per Page", value: pagination.limit, icon: SlidersHorizontal },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-foreground">
      <main className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6">
        <section className="space-y-5">
          <Card className="sticky top-3 z-30 border-zinc-100 bg-white/95 shadow-[0_12px_30px_rgba(0,0,0,0.05)] supports-[backdrop-filter]:backdrop-blur">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-900 text-white shadow-sm">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                      <span>Workspace</span>
                      <ChevronRight className="size-3" />
                      <span>{tabTitle}</span>
                    </div>
                    <h1 className="text-[1.65rem] font-semibold tracking-tight text-zinc-950">Dashboard Workspace</h1>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">A professional workspace for reviewing, updating, and organizing team records.</p>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <Button className="bg-zinc-900 text-white shadow-sm hover:bg-zinc-800" onClick={openCreate}>
                    <Plus className="size-4" />
                    Add Profile
                  </Button>
                  <Button variant="outline" className="border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50" onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="sticky top-[106px] z-20 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-xl border border-zinc-200 bg-white/92 p-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)] supports-[backdrop-filter]:backdrop-blur">
            <div className="inline-flex w-fit items-center rounded-xl border border-zinc-200 bg-zinc-50/80 p-1 shadow-inner">
              {tabItems.map((tab) => {
                const Icon = tab.icon;
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors ${active
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-600 hover:bg-white/70 hover:text-zinc-900"
                      }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "dashboard" && (
              <div className="relative w-full md:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search profiles..."
                  className="h-10 rounded-xl border-zinc-200 bg-white pl-9 shadow-sm"
                />
              </div>
            )}
          </div>

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metricCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.label} className="border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                            <p className="text-3xl font-semibold leading-none tracking-tight text-zinc-950">{item.value}</p>
                          </div>
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                            <Icon className="size-4" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 border-t border-zinc-100 pt-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                          <p className="text-[11px] text-zinc-500">Updated from current workspace data</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {isLoading && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Card key={idx} className="border-zinc-200 bg-white">
                      <CardHeader>
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-4 w-48" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!isLoading && error && (
                <Card className="border-zinc-200 bg-white">
                  <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                    <AlertTriangle className="size-8 text-destructive" />
                    <div>
                      <p className="font-medium text-zinc-950">Something went wrong</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                    <Button variant="outline" onClick={fetchProfiles}>Try again</Button>
                  </CardContent>
                </Card>
              )}

              {!isLoading && !error && profiles.length === 0 && (
                <Card className="border-zinc-200 bg-white">
                  <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                    <FolderSearch className="size-9 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-zinc-950">{searchTerm ? "No matching profiles" : "No profiles yet"}</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm ? "Try a different keyword." : "Create your first profile to get started."}
                      </p>
                    </div>
                    {!searchTerm && (
                      <Button onClick={openCreate}>
                        <Plus className="size-4" />
                        Create Profile
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {!isLoading && !error && profiles.length > 0 && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {profiles.map((profile) => (
                      <Card key={profile.id} className="border-zinc-200 bg-white shadow-[0_6px_16px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_10px_22px_rgba(0,0,0,0.06)]">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <Avatar size="lg" className="ring-1 ring-zinc-200">
                              <AvatarFallback className="bg-zinc-900 text-white">{getInitials(profile.name)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="truncate text-base text-zinc-950">{profile.name}</CardTitle>
                              <CardDescription className="truncate">{profile.email}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                          {profile.phone && (
                            <div className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 py-2">
                              <Phone className="mt-0.5 size-4 text-zinc-600" />
                              <span className="truncate">{profile.phone}</span>
                            </div>
                          )}
                          {profile.address && (
                            <div className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 py-2">
                              <MapPin className="mt-0.5 size-4 text-zinc-600" />
                              <span className="line-clamp-2">{profile.address}</span>
                            </div>
                          )}
                          {profile.dob && (
                            <div className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 px-3 py-2">
                              <CalendarDays className="mt-0.5 size-4 text-zinc-600" />
                              <span>{formatDate(profile.dob)}</span>
                            </div>
                          )}

                          <Separator className="my-2" />

                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" className="border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50" onClick={() => openEdit(profile)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setProfileToDelete(profile)}>
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Page {pagination.page} of {totalPages}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPage(pagination.page - 1)}
                      >
                        Previous
                      </Button>
                      {pageNumbers.map((p) => (
                        <Button
                          key={p}
                          variant={p === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage(pagination.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-zinc-200 bg-white shadow-[0_8px_18px_rgba(0,0,0,0.03)]">
                <CardHeader>
                  <CardTitle className="text-zinc-950">User Profile</CardTitle>
                  <CardDescription>Manage your account details and workspace identity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-14 ring-1 ring-zinc-300">
                        <AvatarFallback className="bg-zinc-900 text-white text-base">{getInitials(user?.name || "User")}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-zinc-950">{user?.name || "User"}</p>
                        <p className="truncate text-sm text-zinc-500">{user?.email || "No email available"}</p>
                        <Badge variant="outline" className="mt-2 border-zinc-300 bg-zinc-100 text-zinc-700">
                          {roleLabel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-zinc-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">Profiles Managed</p>
                      <p className="mt-1 text-2xl font-semibold text-zinc-950">{pagination.total}</p>
                    </div>
                    <div className="rounded-lg border border-zinc-200 bg-white p-3">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">Current Scope</p>
                      <p className="mt-1 text-2xl font-semibold text-zinc-950">Page {pagination.page}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-200 bg-white shadow-[0_8px_18px_rgba(0,0,0,0.03)]">
                <CardHeader>
                  <CardTitle className="text-zinc-950">Profile Actions</CardTitle>
                  <CardDescription>Quick actions for account and directory workflows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-zinc-950 text-white hover:bg-zinc-800" onClick={openCreate}>
                    <Plus className="size-4" />
                    Create Profile
                  </Button>
                  <Button variant="outline" className="w-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50">
                    <Mail className="size-4" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50" onClick={() => setActiveTab("dashboard")}>
                    <LayoutDashboard className="size-4" />
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Card className="border-zinc-200 bg-white shadow-[0_8px_18px_rgba(0,0,0,0.03)]">
                <CardHeader>
                  <CardTitle className="text-zinc-950">Account Settings</CardTitle>
                  <CardDescription>Administrative workspace preferences for {roleLabel.toLowerCase()} users.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Display Name</p>
                    <p className="mt-1 font-medium text-zinc-950">{user?.name || "User"}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Email</p>
                    <p className="mt-1 font-medium text-zinc-950">{user?.email || "No email available"}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Role</p>
                    <p className="mt-1 font-medium text-zinc-950">{roleLabel}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-3 text-sm text-zinc-700">
                    Workspace theme and tab layout are active for your current {roleLabel.toLowerCase()} account.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-200 bg-white shadow-[0_8px_18px_rgba(0,0,0,0.03)]">
                <CardHeader>
                  <CardTitle className="text-zinc-950">Security</CardTitle>
                  <CardDescription>Manage session and dashboard access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-3 text-sm text-zinc-600">
                    You are currently signed in as <span className="font-medium text-zinc-950">{user?.email || "user"}</span>.
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-3 text-sm text-zinc-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-zinc-600" />
                      Session state is secure and active.
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50" onClick={() => setActiveTab("profile")}>
                    <UserCircle2 className="size-4" />
                    Open Profile Tab
                  </Button>
                  <Button variant="outline" className="w-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50" onClick={handleLogout}>
                    <LogOut className="size-4" />
                    Sign out securely
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border border-zinc-100 bg-white p-0 shadow-[0_28px_80px_rgba(0,0,0,0.20)] sm:max-w-2xl">
          <DialogHeader>
            <div className="border-b border-zinc-100 px-6 py-5">
              <Badge variant="outline" className="mb-3 border-zinc-200 bg-zinc-50 text-zinc-700">
                {editingProfile ? "Edit Profile" : "New Profile"}
              </Badge>
              <DialogTitle className="text-xl text-zinc-950">{editingProfile ? "Update team profile" : "Create a new team profile"}</DialogTitle>
              <DialogDescription className="mt-1 text-zinc-600">
                Fill the required fields and save your changes.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Bandana Bhatta"
                  className="border-zinc-100 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="bandana@example.com"
                  className="border-zinc-100 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+977-98XXXXXXXX"
                  className="border-zinc-100 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dob">Date of birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm((prev) => ({ ...prev, dob: e.target.value }))}
                  className="border-zinc-100 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                rows={3}
                placeholder="City, State, Country"
                className="border-zinc-100 bg-white"
              />
            </div>

            {formError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}

            <DialogFooter className="-mx-6 -mb-6 rounded-b-xl border-zinc-100 bg-zinc-50/70 px-6 py-4">
              <Button type="button" variant="outline" className="border-zinc-100 bg-white text-zinc-700 hover:bg-zinc-100" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-zinc-950 text-white hover:bg-zinc-800">
                {isSaving ? "Saving..." : editingProfile ? "Save Changes" : "Create Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(profileToDelete)} onOpenChange={(open) => !open && !isDeleting && setProfileToDelete(null)}>
        <DialogContent className="border border-zinc-100 bg-white p-0 shadow-[0_28px_80px_rgba(0,0,0,0.20)] sm:max-w-md">
          <DialogHeader>
            <div className="border-b border-zinc-100 px-6 py-5">
              <Badge variant="outline" className="mb-3 border-red-200 bg-red-50 text-red-700">
                Delete Profile
              </Badge>
              <DialogTitle className="text-xl text-zinc-950">Confirm deletion</DialogTitle>
              <DialogDescription className="mt-1 text-zinc-600">{deleteMessage}</DialogDescription>
            </div>
          </DialogHeader>

          <div className="px-6 pb-6 pt-5">
            <div className="rounded-xl border border-red-100 bg-red-50/80 p-4">
              <p className="text-sm font-medium text-red-800">This action cannot be undone.</p>
              <p className="mt-1 text-sm text-red-700">All profile details for this team member will be removed from the dashboard.</p>
            </div>

            <DialogFooter className="-mx-6 -mb-6 mt-5 rounded-b-xl border-zinc-100 bg-zinc-50/70 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                className="border-zinc-100 bg-white text-zinc-700 hover:bg-zinc-100"
                onClick={() => setProfileToDelete(null)}
                disabled={isDeleting}
              >
                Keep Profile
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Profile"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
