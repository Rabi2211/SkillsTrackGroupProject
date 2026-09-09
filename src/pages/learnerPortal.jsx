
import "./LearnerPortal.css";

function LearnerPortal() {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <img
                    src="/images/logo.png"
                    className="dashboard-logo"
                    alt="SkillsTrack Logo"
                />

                <a
                    href="/profile"
                    className="profile-button"
                    aria-label="Open profile page"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        fill="currentColor"
                    >
                        <path d="M12 12c2.76 0 5-2.24 5-5S14.76 2 12 2 7 4.24 7 7s2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
                    </svg>
                </a>
            </header>

            <nav className="dashboard-nav">
                <a href="/learner-portal">Dashboard</a>
                <a href="#">Tasks</a>
                <a href="#">Bookings</a>
                <a href="#">Resources</a>
            </nav>

            <h1 className="welcome-title">
                Welcome To Learner Portal
            </h1>

            <div className="stats-container">
                <div className="stat-box">
                    <span className="stat-title">Total Tasks</span>
                    <span className="stat-number">0</span>
                </div>

                <div className="stat-box">
                    <span className="stat-title">Completed</span>
                    <span className="stat-number">0</span>
                </div>

                <div className="stat-box">
                    <span className="stat-title">Outstanding</span>
                    <span className="stat-number">0</span>
                </div>

                <div className="stat-box">
                    <span className="stat-title">Overdue</span>
                    <span className="stat-number">0</span>
                </div>
            </div>

            <section className="upcoming-tasks">
                <h3>Upcoming Tasks</h3>

                <button className="open-button">
                    Open
                </button>
            </section>

            <section className="progress-container">
                <div className="progress-item">
                    <div className="progress-circle">
                        <span>75%</span>
                    </div>

                    <div className="progress-label">
                        Task Average
                    </div>
                </div>

                <div className="progress-item">
                    <div className="progress-circle">
                        <span>75%</span>
                    </div>

                    <div className="progress-label">
                        Game Average
                    </div>
                </div>
            </section>

            <section className="task-progress">
                <div className="task-row">
                    <div className="task-name">
                        <span>NAME OF TASK</span>
                        <span>75%</span>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: "75%" }}
                        ></div>
                    </div>
                </div>

                <div className="task-row">
                    <div className="task-name">
                        <span>NAME OF TASK</span>
                        <span>80%</span>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: "80%" }}
                        ></div>
                    </div>
                </div>

                <div className="task-row">
                    <div className="task-name">
                        <span>NAME OF TASK</span>
                        <span>65%</span>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill blue"
                            style={{ width: "65%" }}
                        ></div>
                    </div>
                </div>

                <div className="task-row">
                    <div className="task-name">
                        <span>NAME OF TASK</span>
                        <span>Pending</span>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill pending"
                            style={{ width: "100%" }}
                        ></div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LearnerPortal;

