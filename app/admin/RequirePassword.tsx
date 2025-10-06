import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// === Configuration (optional to customize via props) ===
const COOKIE_NAME_DEFAULT = "admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day
const TOKEN_CONTEXT = "admin-cookie-v1"; // HMAC context string

function deriveToken(password: string) {
  return crypto.createHmac("sha256", password).update(TOKEN_CONTEXT).digest("hex");
}

function safeEquals(a: string, b: string) {
  // constant-time-ish compare
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

type Props = {
  children: React.ReactNode;
  /**
   * Path to redirect to after login/logout. Defaults to the current path via the Referer header,
   * and falls back to "/admin".
   */
  redirectTo?: string;
  /**
   * Cookie name to store the admin token.
   */
  cookieName?: string;
  /**
   * Optional hint shown under the password field.
   */
  hint?: string;
  logoutTo?: string;
};

export default async function RequirePassword({
  children,
  redirectTo,
  cookieName = COOKIE_NAME_DEFAULT,
  hint,
  logoutTo,
}: Props) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return (
      <div className="mx-auto my-10 w-[min(900px,92%)]">
        <Card className="border-red-300 bg-red-50/70">
          <CardHeader>
            <CardTitle className="text-red-700">Admin misconfigured</CardTitle>
          </CardHeader>
          <CardContent className="text-red-800">
            Missing <code className="rounded bg-white/70 px-1 py-0.5">ADMIN_PASSWORD</code> in environment.
            Set it in your <code>.env</code> and restart the server.
          </CardContent>
        </Card>
      </div>
    );
  }

  const hdrs = await headers();
  const referer = hdrs.get("referer") || undefined;
  const fallbackRedirect = redirectTo || referer || "/admin";
  const logoutRedirect = logoutTo || "/";
  const cookieStore = await cookies();

  // one-time error cookie (set by the action on bad password)
  const errCookie = cookieStore.get("admin_auth_error")?.value;
  if (errCookie) {
    // clear it immediately so it only shows once
    try {
      cookieStore.delete("admin_auth_error");
    } catch {
      // noop
    }
  }

  const tokenFromCookie = cookieStore.get(cookieName)?.value;
  const serverToken = deriveToken(ADMIN_PASSWORD);
  const authorized = !!tokenFromCookie && safeEquals(tokenFromCookie, serverToken);

  async function login(formData: FormData) {
    "use server";
    const pw = (formData.get("password") || "").toString();
    const redirectPath = (formData.get("redirectTo") || fallbackRedirect).toString();
    const localCookies = await cookies();

    if (!pw) {
      localCookies.set("admin_auth_error", "1", { httpOnly: true, sameSite: "lax", path: "/" });
      redirect(redirectPath);
    }

    const attempt = deriveToken(pw);
    if (!safeEquals(attempt, serverToken)) {
      localCookies.set("admin_auth_error", "1", { httpOnly: true, sameSite: "lax", path: "/" });
      redirect(redirectPath);
    }

    // success → set auth cookie
    localCookies.set(cookieName, serverToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    redirect(redirectPath);
  }

  async function logout(formData: FormData) {
    "use server";
    const redirectPath = (formData.get("redirectTo") || fallbackRedirect).toString();
    const localCookies = await cookies();
    // expire cookie
    localCookies.set(cookieName, "", { httpOnly: true, sameSite: "lax", secure: true, maxAge: 0, path: "/" });
    redirect(logoutRedirect);
  }

  if (authorized) {
    // Render children with a small logout strip you can keep or remove
    return (
      <>
        <form action={logout} className="sticky top-0 z-10 mb-4 flex w-full justify-end bg-transparent p-2">
          <input type="hidden" name="redirectTo" value={fallbackRedirect} />
          <Button variant="outline" size="sm">Logout</Button>
        </form>
        {children}
      </>
    );
  }

  // Not authorized → render password card
  return (
    <div className="mx-auto my-16 w-[min(500px,92%)]">
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-center">Admin Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Enter admin password" />
              {hint ? <p className="text-xs text-gray-600">{hint}</p> : null}
              {errCookie ? (
                <p className="text-sm text-red-600">Incorrect password. Please try again.</p>
              ) : null}
            </div>
            <input type="hidden" name="redirectTo" value={fallbackRedirect} />
            <CardFooter className="flex justify-end p-0">
              <Button type="submit">Unlock</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
