
import "./LandingPage.css";

function LandingPage() {
    return (
        <div className="landing">
            <div className="container">
                <img
                    className="bg-image"
                    src="/images/background.png"
                    alt="Space background"
                    width="1536"
                    height="1024"
                />

                <canvas id="bg" aria-hidden="true"></canvas>

                <div className="content">
                    {/* SkillsTrack logo */}
                    <img
                        className="logo"
                        src="/images/logo.png"
                        alt="SkillsTrack Logo"
                    />

                    <h1 className="welcome-heading">
                        Welcome To SkillsTrack
                    </h1>

                    <p className="subtitle">
                        Please choose role
                    </p>

                    <div className="buttons">
                        <button className="role-btn">
                            LECTURER
                        </button>

                        <button className="role-btn">
                            LEARNER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;

