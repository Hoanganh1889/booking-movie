import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const fallbackGenres = ["Hành động", "Tâm lý", "Hoạt hình"];
const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [genre, setGenre] = useState("all");

  useEffect(() => {
    fetchMovies();
  }, [keyword, genre]);

  const fetchMovies = async () => {
    try {
      const params = {};

      if (keyword.trim()) {
        params.keyword = keyword.trim();
      }

      if (genre !== "all") {
        params.genre = genre;
      }

      const res = await api.get("/movies", { params });
      setMovies(res.data);
    } catch (error) {
      console.error(error);
      alert("Không tải được danh sách phim");
    }
  };

  const genres = useMemo(() => {
    const list = [...new Set(movies.map((movie) => movie.genre).filter(Boolean))];
    return list.length ? list : fallbackGenres;
  }, [movies]);

  const getPosterUrl = (poster) => {
    if (!poster) return "";
    if (poster.startsWith("/uploads")) {
      return `http://localhost:5000${poster}`;
    }
    return poster;
  };

  return (
    <section className="content-stack">
      <div className="section-heading">
        <div>
          <p className="section-heading__eyebrow">Đang mở bán</p>
          <h3>Danh sách phim</h3>
        </div>
        <p className="section-heading__meta">{movies.length} phim hiển thị</p>
      </div>

      <div className="panel filter-bar">
        <label className="field">
          <span>Tìm theo tên phim</span>
          <input
            type="text"
            placeholder="Ví dụ: Dune, Doraemon..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Thể loại</span>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="all">Tất cả thể loại</option>
            {genres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setKeyword("");
            setGenre("all");
          }}
          type="button"
        >
          Xóa lọc
        </button>
      </div>

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <article className="movie-card" key={movie._id}>
              <div className="movie-card__poster">
                <img src={getPosterUrl(movie.poster)} alt={movie.title} />
              </div>

              <div className="movie-card__body">
                <div className="movie-card__topline">
                  <span className="pill">{movie.genre || "Chưa phân loại"}</span>
                  <span className="movie-card__price">{formatCurrency(movie.price)}</span>
                </div>

                <h4>{movie.title}</h4>
                <p className="movie-card__text">{movie.description || "Chưa có mô tả cho bộ phim này."}</p>

                <div className="movie-card__meta">
                  <span>{movie.duration} phút</span>
                  <span>{movie.isShowing ? "Đang chiếu" : "Sắp cập nhật"}</span>
                </div>

                <Link className="btn" to={`/movies/${movie._id}`}>
                  Xem chi tiết
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h4>Không tìm thấy phim phù hợp</h4>
            <p>Thử bỏ bớt bộ lọc hoặc nhập từ khóa khác.</p>
          </div>
        )}
      </div>
    </section>
  );
}
