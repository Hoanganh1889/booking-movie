import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const initialForm = {
  title: "",
  genre: "",
  duration: "",
  price: "",
  poster: "",
  description: "",
  isShowing: true,
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [posterFile, setPosterFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get("/movies");
      setMovies(res.data);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách phim");
    }
  };

  const getPosterUrl = (poster) => {
    if (!poster) return "";
    if (poster.startsWith("/uploads")) {
      return `http://localhost:5000${poster}`;
    }
    return poster;
  };

  const previewPoster = useMemo(() => {
    if (posterFile) return URL.createObjectURL(posterFile);
    if (form.poster) return getPosterUrl(form.poster);
    return "";
  }, [posterFile, form.poster]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setPosterFile(file);
  };

  const resetForm = () => {
    setForm(initialForm);
    setPosterFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("genre", form.genre);
      formData.append("duration", form.duration);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("isShowing", form.isShowing);

      if (posterFile) {
        formData.append("posterFile", posterFile);
      } else {
        formData.append("poster", form.poster);
      }

      if (editingId) {
        await api.put(`/movies/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cập nhật phim thành công");
      } else {
        await api.post("/movies", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm phim thành công");
      }

      resetForm();
      fetchMovies();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Lưu phim thất bại");
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);
    setPosterFile(null);
    setForm({
      title: movie.title || "",
      genre: movie.genre || "",
      duration: movie.duration || "",
      price: movie.price || "",
      poster: movie.poster || "",
      description: movie.description || "",
      isShowing: !!movie.isShowing,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phim này?")) return;

    try {
      await api.delete(`/movies/${id}`);
      alert("Xóa phim thành công");

      if (editingId === id) {
        resetForm();
      }

      fetchMovies();
    } catch (error) {
      console.error(error);
      alert("Xóa phim thất bại");
    }
  };

  return (
    <section className="content-stack">
      <div className="admin-layout">
        <form className="admin-form panel" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Quản lý nội dung</p>
              <h3>{editingId ? "Cập nhật phim" : "Thêm phim mới"}</h3>
            </div>
          </div>

          <label className="field">
            <span>Tên phim</span>
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Thể loại</span>
            <input name="genre" value={form.genre} onChange={handleChange} required />
          </label>

          <div className="form-row">
            <label className="field">
              <span>Thời lượng (phút)</span>
              <input name="duration" type="number" value={form.duration} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Giá vé</span>
              <input name="price" type="number" value={form.price} onChange={handleChange} required />
            </label>
          </div>

          <label className="field">
            <span>Mô tả</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows="4" />
          </label>

          <label className="field">
            <span>Poster từ URL</span>
            <input
              name="poster"
              placeholder="https://..."
              value={form.poster}
              onChange={handleChange}
              disabled={!!posterFile}
            />
          </label>

          <label className="field">
            <span>Hoặc tải ảnh lên</span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          {previewPoster && (
            <div className="poster-preview">
              <span>Xem trước poster</span>
              <img src={previewPoster} alt="Poster preview" />
            </div>
          )}

          <label className="toggle-field">
            <input type="checkbox" name="isShowing" checked={form.isShowing} onChange={handleChange} />
            <span>Đang chiếu</span>
          </label>

          <div className="action-group">
            <button className="btn" type="submit">
              {editingId ? "Lưu thay đổi" : "Thêm phim"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Hủy sửa
              </button>
            )}
          </div>
        </form>

        <div className="content-stack">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Danh mục hiện có</p>
              <h3>{movies.length} phim</h3>
            </div>
          </div>

          <div className="movie-grid">
            {movies.map((movie) => (
              <article className="movie-card" key={movie._id}>
                <div className="movie-card__poster">
                  <img src={getPosterUrl(movie.poster)} alt={movie.title} />
                </div>
                <div className="movie-card__body">
                  <div className="movie-card__topline">
                    <span className="pill">{movie.genre}</span>
                    <span className="movie-card__price">{formatCurrency(movie.price)}</span>
                  </div>
                  <h4>{movie.title}</h4>
                  <p className="movie-card__text">{movie.description || "Chưa có mô tả."}</p>
                  <div className="movie-card__meta">
                    <span>{movie.duration} phút</span>
                    <span>{movie.isShowing ? "Đang chiếu" : "Ngừng chiếu"}</span>
                  </div>
                  <div className="action-group">
                    <button className="btn" onClick={() => handleEdit(movie)} type="button">
                      Sửa
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleDelete(movie._id)} type="button">
                      Xóa
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
