import React, { useState, useEffect } from "react";
import { supabase } from "@senik/api";
import type { Profile } from "@senik/types";

type UserRole = "all" | "customer" | "merchant_staff" | "rider";

type UserRow = Profile & { created_at: string };

export function AdminUsersScreen() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<UserRole>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from("profiles")
          .select("id, full_name, phone, avatar_url, role, created_at")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setUsers((data ?? []) as UserRow[]);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filtered = users.filter((u) => {
    const matchRole = filter === "all" || u.role === filter;
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      u.full_name?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term);
    return matchRole && matchSearch;
  });

  const counts: Record<UserRole, number> = {
    all: users.length,
    customer: users.filter((u) => u.role === "customer").length,
    merchant_staff: users.filter((u) => u.role === "merchant_staff").length,
    rider: users.filter((u) => u.role === "rider").length,
  };

  const roleColor: Record<string, string> = {
    customer: "bg-blue-950 text-blue-400 border-blue-800",
    merchant: "bg-amber-950 text-amber-400 border-amber-800",
    merchant_staff: "bg-amber-950 text-amber-400 border-amber-800",
    rider: "bg-emerald-950 text-emerald-400 border-emerald-800",
    admin: "bg-indigo-950 text-indigo-400 border-indigo-800",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-xs text-slate-400">
            All registered users across the platform
          </p>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 w-64 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Role filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "customer", "merchant_staff", "rider"] as const).map(
          (role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ${
                filter === role
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {role}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${filter === role ? "bg-white/20" : "bg-slate-700"}`}
              >
                {counts[role]}
              </span>
            </button>
          ),
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Loading users...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-16 text-center text-sm text-slate-400"
                  >
                    {search
                      ? "No users match your search."
                      : "No users found in this category."}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-800/60 text-xs text-slate-300 hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                          {user.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {user.full_name ?? "—"}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {user.phone ?? "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${roleColor[user.role] ?? "bg-slate-800 text-slate-400 border-slate-700"}`}
                      >
                        {user.role ?? "unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-slate-800 text-[11px] text-slate-500">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
