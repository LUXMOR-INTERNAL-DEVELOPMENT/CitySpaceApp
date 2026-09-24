import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Experincedetails.css";

const ExperienceDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const stateExperience = location.state?.experience;
    const experienceId = location.state?.experienceId || stateExperience?.id;
    const experienceName = location.state?.experienceName || stateExperience?.name;
    const [experience, setExperience] = useState(stateExperience || null);
    const [loading, setLoading] = useState(!stateExperience);

    useEffect(() => {
        if (stateExperience) {
            return;
        }

        const fetchExperience = async () => {
            try {
                const response = await fetch("/db.json");
                if (!response.ok) throw new Error("Could not load db.json");

                const data = await response.json();
                const records = Array.isArray(data.Filter)
                    ? data.Filter
                    : Array.isArray(data.Filters)
                        ? data.Filters
                        : Object.values(data.Filter || data.Filters || {}).flatMap((value) =>
                        Array.isArray(value) ? value : []
                        );
                const match = records.find((item) =>
                    (experienceId != null &&
                        String(item.id ?? item._id) === String(experienceId)) ||
                    (experienceName && item.name === experienceName)
                );

                setExperience(match || null);
            } catch (error) {
                console.error("Failed to load experience:", error);
                setExperience(null);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [experienceId, experienceName, stateExperience]);

    if (loading) {
        return <h2>Loading experience...</h2>;
    }

    if (!experience) {
        return <h2>No experience selected</h2>;
    }

    return (
        <div className="experience-page">

            {/* Top Section */}
            <div className="experience-header">
                <div className="step-label">
                    04 Experience Details
                </div>

                <h1>{experience.name}</h1>

                <p className="rating">
                    {experience.category} · {experience.location} · {experience.rating} ★
                </p>
            </div>

            {/* Main Content */}
            <div className="experience-content">

                {/* LEFT SIDE */}
                <div className="left-content">

                    {/* Experience Image */}
                    <div className="image-wrapper">
                        <img
                            src={experience.image}
                            alt={experience.name}
                        />
                    </div>


                    {/* About Section */}
                    <div className="about-section">

                        <div className="about-title">
                            <div className="about-icon">
                                <h1> {experience.icon}</h1>
                            </div>

                            <h2>About this experience</h2>
                        </div>

                        <p>
                            Enjoy this {experience.category?.toLowerCase()} experience in {experience.location}.
                            Available on {experience.date}.
                        </p>

                        <div className="experience-details">
                            <div>
                                <span>Category</span>
                                <strong>{experience.category}</strong>
                            </div>
                            <div>
                                <span>Date</span>
                                <strong>{experience.date}</strong>
                            </div>
                            <div>
                                <span>Rating</span>
                                <strong>{experience.rating} ★</strong>
                            </div>
                            <div>
                                <span>Distance</span>
                                <strong>{experience.distance} km away</strong>
                            </div>
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="right-content">

                    {/* Pricing Card */}
                    <div className="price-card">

                        <h2>
                            From ₹{experience.price} / guest
                        </h2>

                        <p className="price-description">
                            Includes a 3-course menu, welcome drink and city-view
                            seating.
                        </p>

                        <div className="features">

                            <div>✓ Instant confirmation</div>

                            <div>✓ Free cancellation up to 24 hours</div>

                            <div>✓ Vegetarian options</div>

                        </div>

                        <button
                            className="select-button"
                            onClick={() => navigate("/booking", { state: { experience } })}
                        >
                            Book now
                        </button>

                    </div>

                    {/* Location Card */}
                    <div className="location-card">

                        <h3>Location</h3>
                        <p>
                            {experience.location}
                            <br />
                            {experience.distance} km away
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ExperienceDetails;