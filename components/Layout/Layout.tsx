import { BottomNav } from "components/nav/BottomNav";
import { useFirebaseUser } from "hooks/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
  requireUser?: boolean;
}
const Layout = ({ children, requireUser = false }: LayoutProps) => {
  const router = useRouter();
  const { user, isReady } = useFirebaseUser();
  useEffect(() => {
    if (requireUser && isReady && !user) {
      router.push("/login");
    }
  }, [router, user, isReady]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {requireUser ? user && isReady && children : children}
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
