import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import BookingPage from "./screens/booking/BookingPage";
import Guestcount from "./screens/guestcount/Guestcount";
import BookingSummary from "./screens/bookingsummary/BookingSummary";
import PaymentPage from "./screens/payment/PaymentPage";
import ConfirmationPage from "./screens/conformation/ConfirmationPage";
import Home from "./screens/home/Homepage";
import FilterPage from "./screens/FilterScreen/Filter";
import ResultsPage from "./screens/FilterScreen/ResultsPage";
import ExperienceDetails from "./screens/exploreexperience/Experiencedetails";
import Navbar from "./screens/home/Navbar";
import Signin from "./screens/login/Signin";
import Signup from "./screens/login/Signup";  
import Store from "./screens/store/Store";
import StoreDetail from "./screens/store/StoreDetail";
import CategoryList from "./screens/store/CategoryList";
import Diningexperience from "./screens/dinning/Diningexperience";
import Diningdetail from "./screens/dinning/Diningdetail";
import Eventscreen from "./screens/events/Eventscreen";
import Eventdetails from "./screens/events/Eventdetail";
<<<<<<< Updated upstream
import SearchResults from "./screens/store/SearchResults";
import Checkout from "./screens/checkout/Checkout";
=======
import EventBooking from "./screens/events/EventBooking";

function RouteNavbar() {
  const { pathname } = useLocation();
  return pathname === "/signin" || pathname === "/signup" ? null : <Navbar />;
}
>>>>>>> Stashed changes

function App() {
  return (
    <BrowserRouter>
      <RouteNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/stores" element={<Store />} />
        <Route path="/store/:id" element={<StoreDetail />} />
        <Route path="/store-category/:name" element={<CategoryList />} />
        <Route path="/store-search" element={<SearchResults />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/matches" element={<ResultsPage />} />
        <Route path="/experience" element={<ExperienceDetails />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/experience/:id" element={<ExperienceDetails />} />
        <Route path="/experience/:id" element={<ExperienceDetails />} />
        <Route path="/filter/:category" element={<FilterPage />} />
        <Route path="/date-time" element={<BookingPage />} />
        <Route path="/guestcount" element={<Guestcount />} />
        <Route path="/screen2" element={<Guestcount />} />
        <Route path="/bookingsummary" element={<BookingSummary />} />
        <Route path="/screen3" element={<BookingSummary />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/screen4" element={<ConfirmationPage />} />
        <Route path="/experiencedetails" element={<ExperienceDetails />} />
        <Route path="/screen5" element={<ExperienceDetails />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
        <Route path="/dining/:id" element={<Diningdetail />} />
        <Route path="/diningmatches" element={<ResultsPage />} />
        <Route path="/dining/:id" element={<Diningdetail />} />
        <Route path="/dining" element={<Diningexperience />} />
        <Route path="/Diningexperience" element={<Diningexperience />} />
        <Route path="/events" element={<Eventscreen />} />
        <Route path="/events/:id/book" element={<EventBooking />} />
        <Route path="/events/:id" element={<Eventdetails />} />
        <Route path="/Eventdetails" element={<Eventdetails />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/screen4" element={<ConfirmationPage />} />
        <Route path="/experiencedetails" element={<ExperienceDetails />} />
        <Route path="/screen5" element={<ExperienceDetails />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;






