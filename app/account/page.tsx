import { verifySession } from "@/lib/dal";
import { logout } from "./actions";

export default async function AccountPage() {
  const user = await verifySession();

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Account</h1>
      <p className="mt-2">
        {user.email} · role: {user.role}
      </p>
      <form action={logout} className="mt-4">
        <button className="rounded border px-3 py-1">Log out</button>
      </form>
    </main>
  );
}
