"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ApiKeyForm } from "@/components/admin/ApiKeyForm";
import { ApiKeyTable } from "@/components/admin/ApiKeyTable";
import { getApiKeys, type ApiKeyConfig } from "@/lib/apiKeyManager";

export default function AdminApiKeysPage() {
  const [apiKeys, setApiKeys] = useState(() => getApiKeys());
  const [editingApiKey, setEditingApiKey] = useState<ApiKeyConfig | null>(null);

  function refresh() {
    setApiKeys(getApiKeys());
    setEditingApiKey(null);
  }

  return (
    <AdminLayout title="API Key 管理" description="第一版为本地演示配置，生产环境 DeepSeek Key 仍从服务端环境变量读取。">
      <div className="space-y-5">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          安全提示：这里的数据保存在浏览器 localStorage，仅适合演示。真实线上环境不要把完整 API Key 暴露给前端。
        </div>
        <ApiKeyForm editingApiKey={editingApiKey} onSaved={refresh} />
        <ApiKeyTable apiKeys={apiKeys} onEdit={setEditingApiKey} onChanged={refresh} />
      </div>
    </AdminLayout>
  );
}
