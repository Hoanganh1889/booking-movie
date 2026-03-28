import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      alert(error?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-layout">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">Tài khoản</p>
            <h3>Đăng nhập</h3>
          </div>
        </div>

        <label className="field">
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Mật khẩu</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="auth-card__footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </form>
    </section>
  );
}
