import { PageHeader } from "../../AdminUI";
import PostForm from "../PostForm";
import { createPost } from "../actions";

export default function NovoPostPage() {
  return (
    <div>
      <PageHeader icon="blog" title="Novo post" description="Publique um novo artigo no blog." />
      <div className="mt-6 max-w-3xl rounded-2xl bg-white p-6 ring-1 ring-navy-950/5">
        <PostForm action={createPost} submitLabel="Publicar post" />
      </div>
    </div>
  );
}
