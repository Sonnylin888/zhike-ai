"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserForm } from "@/components/admin/UserForm";
import { UserTable } from "@/components/admin/UserTable";
import { getUsers, type ZhikeUser } from "@/lib/auth";

export default function AdminUsersPage() {
  const [users, setUsers] = useState(() => getUsers());
  const [editingUser, setEditingUser] = useState<ZhikeUser | null>(null);

  function refresh() {
    setUsers(getUsers());
    setEditingUser(null);
  }

  return (
    <AdminLayout title="账号管理" description="管理经销商、学校试用、Demo 和管理员账号。">
      <div className="space-y-5">
        <UserForm editingUser={editingUser} onSaved={refresh} />
        <UserTable users={users} onEdit={setEditingUser} onChanged={refresh} />
      </div>
    </AdminLayout>
  );
}
