import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="pb-3">Welcome to Wasteless</h1>
      <div className="flex flex-col gap-2 items-start">
        <Link
          to="/dashboard"
          className="
      btn btn-outline
      border-blue-900
      text-blue-900
      hover:bg-blue-900/13
    "
        >
          Go to dashboard
        </Link>
        <Link
          to="/contextTest"
          className="
      btn btn-outline
      border-blue-900
      text-blue-900
      hover:bg-blue-900/13
    "
        >
          Go see test
        </Link>
      </div>
    </div>
  );
}
