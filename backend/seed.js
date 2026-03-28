// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Movie = require("./Models/Movie");
// const Showtime = require("./Models/Showtime");
// const Booking = require("./Models/Booking");
// const User = require("./Models/User");
// const { hashPassword } = require("./utils/auth");

// dotenv.config();

// async function seed() {
//   await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/BOOKING_MOVIE");

//   await Promise.all([
//     Booking.deleteMany({}),
//     Showtime.deleteMany({}),
//     Movie.deleteMany({}),
//     User.deleteMany({}),
//   ]);

//   const admin = await User.create({
//     name: "Admin Booking",
//     email: "admin@movie.local",
//     passwordHash: hashPassword("admin123"),
//     role: "admin",
//   });

//   const user = await User.create({
//     name: "Nguyen Van User",
//     email: "user@movie.local",
//     passwordHash: hashPassword("user123"),
//     role: "user",
//   });

//   const movies = await Movie.insertMany([
//     {
//       title: "Dune: Part Two",
//       genre: "Khoa học viễn tưởng",
//       duration: 166,
//       price: 120000,
//       poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
//       description: "Cuộc chiến quyền lực trên hành tinh cát trở lại với quy mô lớn hơn.",
//       isShowing: true,
//     },
//     {
//       title: "How to Train Your Dragon",
//       genre: "Hoạt hình",
//       duration: 104,
//       price: 95000,
//       poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
//       description: "Hành trình phiêu lưu của một cậu bé và người bạn rồng đầy cảm xúc.",
//       isShowing: true,
//     },
//     {
//       title: "Past Lives",
//       genre: "Tâm lý",
//       duration: 106,
//       price: 90000,
//       poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=900&q=80",
//       description: "Một câu chuyện về ký ức, thời gian và những mối liên kết không dứt.",
//       isShowing: true,
//     },
//   ]);

//   const showtimes = await Showtime.insertMany([
//     {
//       movieId: movies[0]._id,
//       room: "Cinema 01",
//       date: "2026-03-29",
//       time: "19:00",
//       availableSeats: 46,
//     },
//     {
//       movieId: movies[0]._id,
//       room: "Cinema 03",
//       date: "2026-03-30",
//       time: "21:00",
//       availableSeats: 40,
//     },
//     {
//       movieId: movies[1]._id,
//       room: "Cinema 02",
//       date: "2026-03-29",
//       time: "18:00",
//       availableSeats: 56,
//     },
//     {
//       movieId: movies[2]._id,
//       room: "Cinema 04",
//       date: "2026-03-31",
//       time: "20:30",
//       availableSeats: 36,
//     },
//   ]);

//   await Booking.create({
//     showtimeId: showtimes[0]._id,
//     userId: user._id,
//     customerName: user.name,
//     phone: "0900000001",
//     movieTitle: movies[0].title,
//     showtime: `${showtimes[0].date} ${showtimes[0].time}`,
//     seats: 2,
//     total: 240000,
//     status: "pending",
//   });

//   console.log("Seed hoàn tất");
//   console.log("Admin:", admin.email, "/ admin123");
//   console.log("User:", user.email, "/ user123");

//   await mongoose.disconnect();
// }

// seed().catch(async (error) => {
//   console.error(error);
//   await mongoose.disconnect();
//   process.exit(1);
// });
