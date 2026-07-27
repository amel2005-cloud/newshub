import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }

    // Wait a moment for auth state to update
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-navy font-extrabold text-3xl">
            KOJB<span className="text-red">News</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Login ke Admin Dashboard</p>
        </div>

        {error && (
          <div className="bg-red/10 border border-red/30 text-red text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-red py-3 text-base disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/" className="text-red hover:underline">
            ← Kembali ke Website
          </Link>
        </p>
      </div>
    </div>
  );
}
