import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Profile({ user, onUpdate, onLogout }: { user: string; onUpdate: (n: string) => void; onLogout: () => void }) {
  const [name, setName] = useState(user);
  const [email, setEmail] = useState(`${user.toLowerCase()}@traveloop.app`);
  const [lang, setLang] = useState("en");
  const [saved, setSaved] = useState("");

  const save = () => {
    onUpdate(name);
    setSaved("Saved!");
    setTimeout(() => setSaved(""), 2000);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Profile & Settings</h1>

      <Card className="p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-xl">{name[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{name}</div>
            <div className="text-sm text-muted-foreground">{email}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="pname">Full name</Label>
            <Input id="pname" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pemail">Email</Label>
            <Input id="pemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Language</Label>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={save}>Save changes</Button>
            {saved && <span className="text-sm text-emerald-600">{saved}</span>}
          </div>
        </div>
      </Card>

      <Card className="p-6 border-red-200">
        <h3 className="font-semibold text-red-600 mb-2">Danger zone</h3>
        <p className="text-sm text-muted-foreground mb-3">Log out or remove your account.</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onLogout}>Log out</Button>
          <Button variant="destructive">Delete account</Button>
        </div>
      </Card>
    </div>
  );
}
