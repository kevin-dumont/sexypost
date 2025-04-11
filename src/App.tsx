import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import PostGenerator from "./components/PostGenerator";
import { supabase } from "./lib/supabase";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <PostGenerator user={user} />
    </div>
  );
}

export default App;