import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await api.post("/auth/register", form);
      login(res.data);
      navigate("/", { replace: true });
    } catch (error) {
      alert(error?.response?.data?.message || "Đăng ký thất bại");
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
            <h3>Đăng ký</h3>
          </div>
        </div>

        <label className="field">
          <span>Họ tên</span>
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Email</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Mật khẩu</span>
          <input
            name="password"
            type="password"
            minLength="6"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>

        <p className="auth-card__footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </section>
  );
}
