import { useState } from "react";
import { Compass } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

export function LoginScreen({ onAuth }: { onAuth: (name: string) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setErr("Please enter a valid email.");
    if (password.length < 6) return setErr("Password must be at least 6 characters.");
    setErr("");
    onAuth(name || email.split("@")[0]);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-orange-50 to-amber-50 p-6">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full items-center">
        <div className="hidden md:block">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-orange-400 flex items-center justify-center text-white">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Traveloop</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Personalized travel planning made easy. Dream, design, and organize multi-city trips with ease.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✦ Build day-by-day itineraries</li>
            <li>✦ Track your budget automatically</li>
            <li>✦ Share trip plans with friends</li>
          </ul>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Log in to continue planning." : "Start planning your next adventure."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {err && <p className="text-sm text-red-500">{err}</p>}

            <Button type="submit" className="w-full">
              {mode === "login" ? "Log in" : "Sign up"}
            </Button>

            {mode === "login" && (
              <button type="button" className="text-sm text-muted-foreground hover:text-foreground w-full text-center">
                Forgot password?
              </button>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have one? "}
            <button
              className="text-primary hover:underline"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
