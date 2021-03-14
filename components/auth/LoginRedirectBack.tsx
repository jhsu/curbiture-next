import Link from "next/link";
import { useRouter } from "next/router";

const LoginRedirectBack = ({ children }) => {
  const router = useRouter();
  return <Link href={`/login?redirect_to=${router.pathname}`}>{children}</Link>;
};

export default LoginRedirectBack;
