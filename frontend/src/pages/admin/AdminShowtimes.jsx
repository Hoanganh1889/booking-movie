import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  movieId: "",
  room: "",
  date: "",
  time: "",
  availableSeats: "",
};

export default function AdminShowtimes() {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMovies();
    fetchShowtimes();
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

  const fetchShowtimes = async () => {
    try {
      const res = await api.get("/showtimes");
      setShowtimes(res.data);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách suất chiếu");
    }
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find((item) => String(item._id) === String(movieId));
    return movie ? movie.title : "Chưa gắn phim";
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/showtimes/${editingId}`, form);
        alert("Cập nhật suất chiếu thành công");
      } else {
        await api.post("/showtimes", form);
        alert("Thêm suất chiếu thành công");
      }

      resetForm();
      fetchShowtimes();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Lưu suất chiếu thất bại");
    }
  };

  const handleEdit = (showtime) => {
    setEditingId(showtime._id);
    setForm({
      movieId: showtime.movieId || "",
      room: showtime.room || "",
      date: showtime.date || "",
      time: showtime.time || "",
      availableSeats: showtime.availableSeats || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa suất chiếu này?")) return;

    try {
      await api.delete(`/showtimes/${id}`);
      alert("Xóa suất chiếu thành công");

      if (editingId === id) {
        resetForm();
      }

      fetchShowtimes();
    } catch (error) {
      console.error(error);
      alert("Xóa suất chiếu thất bại");
    }
  };

  return (
    <section className="content-stack">
      <div className="admin-layout admin-layout--narrow">
        <form className="admin-form panel" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Lịch chiếu</p>
              <h3>{editingId ? "Cập nhật suất chiếu" : "Thêm suất chiếu mới"}</h3>
            </div>
          </div>

          <label className="field">
            <span>Phim</span>
            <select name="movieId" value={form.movieId} onChange={handleChange} required>
              <option value="">Chọn phim</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </label>

          <div className="form-row">
            <label className="field">
              <span>Phòng chiếu</span>
              <input name="room" value={form.room} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Ghế trống</span>
              <input name="availableSeats" type="number" value={form.availableSeats} onChange={handleChange} required />
            </label>
          </div>

          <div className="form-row">
            <label className="field">
              <span>Ngày chiếu</span>
              <input name="date" type="date" value={form.date} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Giờ chiếu</span>
              <input name="time" type="time" value={form.time} onChange={handleChange} required />
            </label>
          </div>

          <div className="action-group">
            <button className="btn" type="submit">
              {editingId ? "Lưu thay đổi" : "Thêm suất chiếu"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Hủy sửa
              </button>
            )}
          </div>
        </form>

        <div className="panel table-panel">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Danh sách</p>
              <h3>{showtimes.length} suất chiếu</h3>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Phim</th>
                  <th>Phòng</th>
                  <th>Ngày</th>
                  <th>Giờ</th>
                  <th>Ghế trống</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {showtimes.map((showtime) => (
                  <tr key={showtime._id}>
                    <td>{getMovieTitle(showtime.movieId)}</td>
                    <td>{showtime.room}</td>
                    <td>{showtime.date}</td>
                    <td>{showtime.time}</td>
                    <td>{showtime.availableSeats}</td>
                    <td>
                      <div className="action-group">
                        <button className="btn" onClick={() => handleEdit(showtime)} type="button">
                          Sửa
                        </button>
                        <button className="btn btn-secondary" onClick={() => handleDelete(showtime._id)} type="button">
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
