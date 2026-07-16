import { CommentSignInGate } from "@/components/CommentSignInGate";
import { CommentThread } from "@/components/CommentThread";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-2xl font-semibold">Hello, World!</h1>

      <section>
        <h2 className="mb-3 text-lg font-medium">Comments</h2>
        <CommentSignInGate>
          <CommentThread />
        </CommentSignInGate>
      </section>
    </main>
  );
}
