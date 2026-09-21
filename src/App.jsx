import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Cart from "./pages/Cart";
import MyCourses from "./pages/MyCourses";
import Learn from "./pages/Learn";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import AdminNew from "./pages/AdminNew";
import Player from "./pages/Player";

import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Faq from "./pages/Faq";
import Certificate from "./components/Certificate";

function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<Course />} />
        <Route path="/course/:id/learn" element={<Learn />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminNew />} />
        <Route path="/player" element={<Player />} />
        
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/certificate/:id" element={<Certificate />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;