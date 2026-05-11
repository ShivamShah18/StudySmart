import React from 'react';

const features = [
  {
    icon: '📹',
    title: 'Live Focus Tracking',
    description:
      'Webcam-powered computer vision monitors your face, eye blinks, and hand position in real time to detect active study presence.',
  },
  {
    icon: '⏱',
    title: 'Focus Timer',
    description:
      'Session-synced backend timer tracks your study intervals. Start, pause, or reset without losing time accuracy.',
  },
  {
    icon: '📝',
    title: 'Task Management',
    description:
      'Add and complete tasks per session. Progress is auto-saved locally so your list persists between browser visits.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description:
      'Session metrics — focus score, blink rate, hand-off-desk events — are plotted over time to reveal productivity patterns.',
  },
];

const About = () => (
  <div className="about-page">
    <div className="about-hero">
      <span className="about-badge">StudySmart · v1.0</span>
      <h1>
        Focus smarter,<br />
        not <em>harder</em>.
      </h1>
      <p>
        A productivity companion that uses computer vision and real-time analytics
        to help you understand and improve your study sessions.
      </p>
    </div>

    <div className="feature-grid">
      {features.map((f) => (
        <div className="feature-card" key={f.title}>
          <span className="feature-icon">{f.icon}</span>
          <h3>{f.title}</h3>
          <p>{f.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default About;