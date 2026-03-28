import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { useEffect, useMemo, useState } from "react";
import MovieDetail from "./pages/MovieDetail";
import Cart from "./pages/Cart";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminShowtimes from "./pages/admin/AdminShowtimes";
import AdminBookings from "./pages/admin/AdminBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import api from "./services/api";

const publicLinks = [{ to: "/", label: "Trang chủ" }];
const userLinks = [
  { to: "/cart", label: "Giỏ vé" },
  { to: "/my-bookings", label: "Booking của tôi" },
];
const adminLinks = [
  { to: "/admin/movies", label: "Phim" },
  { to: "/admin/showtimes", label: "Suất chiếu" },
  { to: "/admin/bookings", label: "Booking" },
];

const formatCurrency = (value) => `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const guestSlides = [
  {
    eyebrow: "Rạp phim trực tuyến",
    title: "Đặt vé nhanh, giao diện gọn và nhìn chuyên nghiệp hơn.",
    description: "Khu vực mở đầu tự động lướt giữa các bối cảnh, giúp giao diện sống động hơn so với đoạn text tĩnh.",
    meta: ["Giao diện rõ ràng", "Đặt vé nhanh", "Theo dõi booking"],
    background:
      "linear-gradient(135deg, rgba(187, 81, 47, 0.34), rgba(18, 16, 15, 0.3)), radial-gradient(circle at 18% 18%, rgba(255, 210, 150, 0.32), transparent 28%), linear-gradient(120deg, #7a301c 0%, #181514 100%)",
  },
  {
    eyebrow: "Booking thông minh",
    title: "Chuyển cảnh mềm, overlay đậm và typo lớn để nhấn mạnh nội dung.",
    description: "Ngay cả khi chưa lấy được poster phim, hero vẫn giữ chất lượng thị giác nhờ gradient động và bố cục hai cột.",
    meta: ["Slide tự động", "Poster nổi bật", "Nội dung linh hoạt"],
    background:
      "linear-gradient(135deg, rgba(123, 66, 41, 0.34), rgba(15, 15, 18, 0.3)), radial-gradient(circle at 82% 18%, rgba(242, 184, 108, 0.28), transparent 26%), linear-gradient(135deg, #342018 0%, #11161d 100%)",
  },
  {
    eyebrow: "Trải nghiệm hiện đại",
    title: "Mở đầu bằng hình ảnh lướt ngẫu nhiên thay vì một khối văn bản cố định.",
    description: "Khách đăng nhập hay chưa đăng nhập đều thấy được khu hero có chuyển động, nhưng vẫn giữ tông màu đồng bộ với app.",
    meta: ["Responsive", "Hiệu ứng mềm", "Ưu tiên nội dung"],
    background:
      "linear-gradient(135deg, rgba(79, 34, 22, 0.42), rgba(24, 22, 20, 0.24)), radial-gradient(circle at 50% 50%, rgba(240, 151, 70, 0.18), transparent 36%), linear-gradient(135deg, #301713 0%, #151618 100%)",
  },
];

function getPosterUrl(poster) {
  if (!poster) return "";
  if (poster.startsWith("/uploads")) {
    return `http://localhost:5000${poster}`;
  }
  return poster;
}

function summarizeDescription(description) {
  if (!description) return "";
  const normalized = description.trim();
  if (normalized.length <= 140) {
    return normalized;
  }
  return `${normalized.slice(0, 137).trimEnd()}...`;
}

function shuffleItems(items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function NavLinkItem({ to, label, pathname }) {
  return (
    <Link className={`nav-link${pathname === to ? " is-active" : ""}`} to={to}>
      {label}
    </Link>
  );
}

function Shell() {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [heroMovies, setHeroMovies] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    let ignore = false;

    const fetchHeroMovies = async () => {
      try {
        const res = await api.get("/movies");
        const slides = shuffleItems(
          (res.data || []).filter((movie) => movie?.poster && movie?.isShowing !== false),
        )
          .slice(0, 5)
          .map((movie) => ({
            eyebrow: movie.genre || "Đang mở bán",
            title: movie.title,
            description:
              summarizeDescription(movie.description) ||
              `Giá từ ${formatCurrency(movie.price)}, thời lượng ${movie.duration || "--"} phút.`,
            image: getPosterUrl(movie.poster),
            meta: [
              formatCurrency(movie.price),
              `${movie.duration || "--"} phút`,
              movie.isShowing ? "Đang chiếu" : "Sắp cập nhật",
            ],
          }));

        if (!ignore) {
          setHeroMovies(slides);
        }
      } catch {
        if (!ignore) {
          setHeroMovies([]);
        }
      }
    };

    fetchHeroMovies();

    return () => {
      ignore = true;
    };
  }, []);

  const slides = useMemo(() => {
    return heroMovies.length ? heroMovies : guestSlides;
  }, [heroMovies]);

  useEffect(() => {
    setActiveSlide(0);
  }, [slides]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentIndex) => {
        if (slides.length <= 1) {
          return 0;
        }
        return (currentIndex + 1) % slides.length;
      });
    }, 4800);

    return () => window.clearInterval(timer);
  }, [slides]);

  const currentSlide = slides[activeSlide] || slides[0];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container app-header__inner">
          <Link className="brand" to="/">
            <span className="brand__badge">CR</span>
            <div>
              <p className="brand__eyebrow">ChiRi</p>
              <h1 className="brand__title">Đặt vé nhanh, quản lý gọn</h1>
            </div>
          </Link>

          <div className="header-side">
            <nav className="nav-cluster" aria-label="Điều hướng chính">
              <div className="nav-group">
                <span className="nav-group__label">Khách hàng</span>
                <div className="nav-group__links">
                  {publicLinks.map((link) => (
                    <NavLinkItem key={link.to} {...link} pathname={location.pathname} />
                  ))}
                  {isAuthenticated &&
                    userLinks.map((link) => (
                      <NavLinkItem key={link.to} {...link} pathname={location.pathname} />
                    ))}
                  {!isAuthenticated && (
                    <>
                      <NavLinkItem to="/login" label="Đăng nhập" pathname={location.pathname} />
                      <NavLinkItem to="/register" label="Đăng ký" pathname={location.pathname} />
                    </>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div className="nav-group nav-group--admin">
                  <span className="nav-group__label">Quản trị</span>
                  <div className="nav-group__links">
                    {adminLinks.map((link) => (
                      <NavLinkItem key={link.to} {...link} pathname={location.pathname} />
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {isAuthenticated && (
              <div className="account-chip">
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.role === "admin" ? "Admin" : "User"}</p>
                </div>
                <button className="btn btn-secondary" type="button" onClick={logout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container page-shell">
        {isHomeRoute && (
          <section className="page-hero">
            <div className="page-hero__media" aria-hidden="true">
              <div
                className="page-hero__track"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div
                    key={`${slide.title}-${index}`}
                    className="page-hero__bg"
                    style={
                      slide.image
                        ? { backgroundImage: `linear-gradient(90deg, rgba(17, 13, 12, 0.82), rgba(17, 13, 12, 0.24)), url(${slide.image})` }
                        : { backgroundImage: slide.background }
                    }
                  />
                ))}
              </div>
              <div className="page-hero__grain" />
            </div>

            <div className="page-hero__content">
              <div className="page-hero__copy">
                <p className="page-hero__eyebrow">{currentSlide?.eyebrow || "Rạp phim trực tuyến"}</p>
                <h2>
                  {isAuthenticated
                    ? `Xin chào ${user.name}, chọn phim phù hợp và hoàn tất đặt vé trong vài bước.`
                    : "Đăng nhập để đặt vé, theo dõi booking và phân quyền rõ giữa admin với user."}
                </h2>
                <p>
                  {currentSlide?.description ||
                    "User có thể đăng ký, đăng nhập, đặt vé và xem lịch sử booking của mình; admin có thêm khu vực quản trị riêng."}
                </p>
              </div>

              <div className="page-hero__side">
                <div className="page-hero__feature">
                  <span>Đang hiển thị</span>
                  <strong>{currentSlide?.title || "Booking Movie"}</strong>
                  <div className="page-hero__meta">
                    {(currentSlide?.meta || []).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <div className="page-hero__dots">
                  {slides.map((slide, index) => (
                    <button
                      key={`${slide.title}-dot-${index}`}
                      type="button"
                      className={`page-hero__dot${index === activeSlide ? " is-active" : ""}`}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Chuyển sang slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/movies"
            element={
              <ProtectedRoute requireAdmin>
                <AdminMovies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/showtimes"
            element={
              <ProtectedRoute requireAdmin>
                <AdminShowtimes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requireAdmin>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

export default App;
