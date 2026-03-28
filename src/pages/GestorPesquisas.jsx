import { useState } from "react";
import PesquisasForm from "@/components/gestor/PesquisasForm";
import PesquisasTable from "@/components/gestor/PesquisasTable";
import { useSurveyStore, surveyStore } from "@/lib/surveyStore";

export default function GestorPesquisas() {
  const perguntas = useSurveyStore();
  const [editingItem, setEditingItem] = useState(null);

  const handleSave = (nova) => {
    if (editingItem) {
      surveyStore.update(editingItem.id, nova);
      setEditingItem(null);
    } else {
      surveyStore.add(nova);
    }
  };

  const handleEdit = (item) => setEditingItem(item);
  const handleCancelEdit = () => setEditingItem(null);
  const handleDelete = (id) => surveyStore.delete(id);
  const handleToggleStatus = (id) => surveyStore.toggleStatus(id);
  const handleReorder = (fromIndex, toIndex) => surveyStore.reorder(fromIndex, toIndex);

  return (
    <>
      <PesquisasForm onSave={handleSave} editingItem={editingItem} onCancelEdit={handleCancelEdit} />
      <PesquisasTable
        perguntas={perguntas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onReorder={handleReorder}
      />
    </>
  );
}