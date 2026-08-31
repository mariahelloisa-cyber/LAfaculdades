"use client";

import { AdminIcon } from "../adminIcons";
import { deletePost } from "./actions";

export default function DeletePostButton({ id, titulo }: { id: string; titulo: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (!confirm(`Excluir o post "${titulo}"? Essa ação não pode ser desfeita.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Excluir ${titulo}`}
        title="Excluir"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-rose text-white transition-colors hover:bg-rose-dark"
      >
        <AdminIcon name="excluir" size={16} />
      </button>
    </form>
  );
}
