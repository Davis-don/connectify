import { useEffect, useRef } from 'react';
import './howitworks.css';

function HowItWorks() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === titleRef.current) {
            entry.target.classList.add('how-it-works-title-visible');
          } else if (entry.target === ctaRef.current) {
            entry.target.classList.add('how-it-works-cta-visible');
          } else {
            entry.target.classList.add('how-it-works-step-visible');
          }
        }
      });
    }, observerOptions);

    if (titleRef.current) observer.observe(titleRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    
    stepRefs.current.forEach(step => {
      if (step) observer.observe(step);
    });

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: 1,
      icon: '🚀',
      title: 'Get Started in Minutes',
      description: 'Sign up for free and connect your first project. Our setup wizard guides you through the entire process with no coding required.'
    },
    {
      number: 2,
      icon: '⚡',
      title: 'Automate Everything',
      description: 'Our AI-powered system learns from your workflow and automates repetitive tasks, saving you hours each week.'
    },
    {
      number: 3,
      icon: '📊',
      title: 'Track & Optimize',
      description: 'Monitor performance with real-time dashboards and get intelligent insights to continuously improve your results.'
    },
    {
      number: 4,
      icon: '🎯',
      title: 'Achieve Your Goals',
      description: 'Scale your success with advanced features and dedicated support to help you reach new milestones.'
    }
  ];

  return (
    <div className="how-it-works-overall-container">
      {/* Background Elements */}
      <div className="how-it-works-bg-element how-it-works-bg-1"></div>
      <div className="how-it-works-bg-element how-it-works-bg-2"></div>
      
      {/* Title */}
      <h1 ref={titleRef} className="how-it-works-title">
        How It Works
      </h1>
      
      {/* Steps Container */}
      <div className="how-it-works-steps-container">
        {steps.map((step, index) => (
          <div
            key={step.number}
            ref={el => { stepRefs.current[index] = el; }}
            className="how-it-works-step"
          >
            <div className="how-it-works-step-number">{step.number}</div>
            <div className="how-it-works-step-icon">{step.icon}</div>
            <h3 className="how-it-works-step-title">{step.title}</h3>
            <p className="how-it-works-step-description">{step.description}</p>
          </div>
        ))}
      </div>
      
      {/* CTA Section */}
      <div ref={ctaRef} className="how-it-works-cta-container">
        <button className="how-it-works-cta-button">
          Start Your Journey
          <span className="how-it-works-cta-icon">→</span>
        </button>
      </div>
    </div>
  );
}

export default HowItWorks;