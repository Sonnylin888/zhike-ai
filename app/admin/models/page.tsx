"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ModelConfigForm } from "@/components/admin/ModelConfigForm";
import { ModelConfigTable } from "@/components/admin/ModelConfigTable";
import { getModels, type ModelConfig } from "@/lib/modelConfig";

export default function AdminModelsPage() {
  const [models, setModels] = useState(() => getModels());
  const [editingModel, setEditingModel] = useState<ModelConfig | null>(null);

  function refresh() {
    setModels(getModels());
    setEditingModel(null);
  }

  return (
    <AdminLayout title="模型配置" description="维护 DeepSeek 等模型的展示配置和账号绑定选项。">
      <div className="space-y-5">
        <ModelConfigForm editingModel={editingModel} onSaved={refresh} />
        <ModelConfigTable models={models} onEdit={setEditingModel} onChanged={refresh} />
      </div>
    </AdminLayout>
  );
}
