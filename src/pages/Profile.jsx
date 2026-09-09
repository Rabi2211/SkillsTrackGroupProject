
import "./Profile.css";

function Profile() {
    function closeProfile() {
        window.location.href = "/learner-portal";
    }

    return (
        <div className="profile-overlay">
            <img
                className="background-image"
                src="/images/background.png"
                alt="Galaxy background"
            />

            {/* Close button */}
            <button
                className="close-btn"
                aria-label="Close"
                onClick={closeProfile}
            >
                &times;
            </button>

            {/* Avatar */}
            <div className="avatar">
                <svg
                    viewBox="0 0 169 154"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="84"
                        cy="50"
                        r="40"
                        fill="#4F378B"
                    />

                    <path
                        d="M0 154c0-46.4 37.6-84 84-84s84 37.6 84 84"
                        fill="#4F378B"
                    />
                </svg>
            </div>

            {/* User information */}
            <div className="user-info">
                <div className="name">
                    [Name &amp; Surname]
                </div>

                <div className="username">
                    [username]
                </div>
            </div>

            {/* Menu card */}
            <div className="menu-card">
                <a href="#">Edit profile</a>
                <a href="#">Settings</a>
                <a href="#">Sign out</a>
            </div>
        </div>
    );
}

export default Profile;

