import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>Welcome to Wasteless</h1>
      <Link to="/dashboard">Go to dashboard</Link>
    </>
  );
}
