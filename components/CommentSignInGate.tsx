import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { signInWithGoogle, signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

// Gates only the comment section, per CLAUDE.md constraint #7 -- the rest
// of the page has no auth requirement. Uses getUser(), not getSession(),
// because getUser() revalidates against the Supabase auth server instead
// of trusting the (spoofable) cookie-decoded JWT.
export async function CommentSignInGate({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-lg border border-border p-4 text-sm">
        <p className="mb-3 text-muted-foreground">
          Sign in with Google to read and write comments.
        </p>
        <form action={signInWithGoogle}>
          <Button type="submit">Sign in with Google</Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>Signed in as {user.email}</span>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
      {children}
    </div>
  );
}
