import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../utils/cart";

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    fetchMovie();
    fetchShowtimes();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data);
    } catch (error) {
      console.error(error);
      alert("Không tải được chi tiết phim");
    }
  };

  const fetchShowtimes = async () => {
    try {
      const res = await api.get(`/showtimes?movieId=${id}`);
      setShowtimes(res.data);
    } catch (error) {
      console.error(error);
      alert("Không tải được suất chiếu");
    }
  };

  const getPosterUrl = (poster) => {
    if (!poster) return "";
    if (poster.startsWith("/uploads")) {
      return `http://localhost:5000${poster}`;
    }
    return poster;
  };

  const handleAddToCart = () => {
    if (!selectedShowtime) {
      alert("Vui lòng chọn suất chiếu");
      return;
    }

    if (seats < 1) {
      alert("Số vé phải lớn hơn 0");
      return;
    }

    const selected = showtimes.find((item) => item._id === selectedShowtime);

    if (!selected) {
      alert("Không tìm thấy suất chiếu");
      return;
    }

    addToCart({
      movieId: movie._id,
      movieTitle: movie.title,
      showtimeId: selected._id,
      showtime: `${selected.date} ${selected.time}`,
      price: movie.price,
      seats: Number(seats),
    });

    alert("Đã thêm vào giỏ vé");
    navigate("/cart");
  };

  if (!movie) {
    return <div className="empty-state"><h4>Đang tải dữ liệu phim</h4></div>;
  }

  return (
    <section className="detail-page">
      <div className="detail-image">
        <img src={getPosterUrl(movie.poster)} alt={movie.title} />
      </div>

      <div className="detail-info panel">
        <div className="detail-info__header">
          <span className="pill">{movie.genre || "Chưa phân loại"}</span>
          <h3>{movie.title}</h3>
          <p>{movie.description || "Chưa có mô tả chi tiết."}</p>
        </div>

        <div className="detail-facts">
          <div className="stat-card">
            <span className="stat-card__label">Thời lượng</span>
            <strong>{movie.duration} phút</strong>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Giá vé</span>
            <strong>{formatCurrency(movie.price)}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Trạng thái</span>
            <strong>{movie.isShowing ? "Đang chiếu" : "Ngừng chiếu"}</strong>
          </div>
        </div>

        <div className="booking-box">
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Đặt vé</p>
              <h4>Chọn suất chiếu</h4>
            </div>
          </div>

          <label className="field">
            <span>Suất chiếu</span>
            <select value={selectedShowtime} onChange={(e) => setSelectedShowtime(e.target.value)}>
              <option value="">Chọn suất chiếu phù hợp</option>
              {showtimes.map((showtime) => (
                <option key={showtime._id} value={showtime._id}>
                  {showtime.date} - {showtime.time} - {showtime.room} - Còn {showtime.availableSeats} ghế
                </option>
              ))}
            </select>
          </label>

          <label className="field field--small">
            <span>Số lượng vé</span>
            <input
              type="number"
              min="1"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </label>

          <button className="btn" onClick={handleAddToCart} type="button">
            Thêm vào giỏ vé
          </button>
        </div>
      </div>
    </section>
  );
}
