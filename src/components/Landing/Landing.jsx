import { Link } from 'react-router';

const Landing = () => {
  return (
    <div className="page-container">
      {/* Logo centered at top */}
      <div className="landing-header">
        <img src="/images/logo.png" alt="SoulMail Logo" className="logo-image" />
      </div>

      {/* Main content box */}
      <div className="landing-content">
        <h1 className="landing-page-title">SoulMail: Whispers to Myself</h1>
        <p className="landing-tagline">"Write Letters to your future self"</p>

        {/* Description */}
        <div className="landing-description">
          <p>Some thoughts are too sacred for the noise of the world. This is a safe place to whisper them back to yourself.</p>

          <p>Write letters to your future self. Capture this moment—your mood, the weather, the song playing, your goals. Seal it with a delivery date and open it when the time is right.</p>

          <p>Reflect on your growth. Celebrate your progress. Remember who you were, and see how far you've come.</p>
        </div>

        {/* Action buttons */}
        <div className="landing-buttons">
          <Link to="/sign-in" className="landing-btn">
            <img
              src="/images/buttons/sign_in_but.png"
              alt="Sign In"
              className="btn-default"
            />
            <img
              src="/images/buttons/sign_in_but2.png"
              alt="Sign In"
              className="btn-hover"
            />
          </Link>

          <Link to="/sign-up" className="landing-btn">
            <img
              src="/images/buttons/sign_up_but.png"
              alt="Sign Up"
              className="btn-default"
            />
            <img
              src="/images/buttons/sign_up_but2.png"
              alt="Sign Up"
              className="btn-hover"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;