import React from 'react';
import CardSwap, { Card } from './CardSwap'; // adjust path as needed
import './CardSwap.css';

// ─── Project Data ────────────────────────────────────────────────
const projects = [
  {
    title: 'Easy Lease',
    description:
      'A rental website that connects users with item owners, facilitating seamless rental transactions.',
    tags: ['React', 'Web App', 'Rental Platform'],
    image: '/assets/easy-lease.jpg', // replace with your actual image paths
    demo: '#',
  },
  {
    title: 'Portfolio Website',
    description:
      'A modern, responsive portfolio website built with React and Tailwind CSS.',
    tags: ['React', 'Tailwind CSS', 'Responsive Design'],
    image: '/assets/portfolio.jpg',
    demo: '#',
  },
  {
    title: 'Data Quality Control Dashboard',
    description:
      'Data QC at CSMS maintaining data accuracy and integrity through structured validation.',
    tags: ['Data QC', 'Accuracy'],
    image: '/assets/data-qc.jpg',
    demo: '#',
  },
];

// ─── Single Project Card ─────────────────────────────────────────
const ProjectCard = ({ title, description, tags, image, demo }) => (
  <div className="fp-card-inner">
    <div className="fp-card-image">
      <img src={image} alt={title} />
    </div>
    <div className="fp-card-body">
      <h3 className="fp-card-title">{title}</h3>
      <p className="fp-card-desc">{description}</p>
      <div className="fp-card-tags">
        {tags.map((tag) => (
          <span key={tag} className="fp-tag">
            {tag}
          </span>
        ))}
      </div>
      <a href={demo} target="_blank" rel="noopener noreferrer" className="fp-demo-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Live Demo
      </a>
    </div>
  </div>
);

// ─── Featured Projects Section ───────────────────────────────────
const FeaturedProjects = () => {
  return (
    <section className="fp-section">
      {/* Background network dots — keep your existing bg or replace */}
      <div className="fp-bg" aria-hidden="true" />

      <div className="fp-content">
        {/* Left: Heading */}
        <div className="fp-left">
          <p className="fp-eyebrow">My Work</p>
          <h2 className="fp-heading">
            <span className="fp-heading-white">Featured </span>
            <span className="fp-heading-purple">Projects</span>
          </h2>
          <p className="fp-subheading">
            Explore my latest work showcasing web development and creative projects
          </p>
          <div className="fp-hint">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Cards auto-rotate every 5 seconds
          </div>
        </div>

        {/* Right: CardSwap */}
        <div className="fp-right">
          <CardSwap
            width={420}
            height={480}
            cardDistance={55}
            verticalDistance={65}
            delay={5000}
            pauseOnHover={true}
            skewAmount={5}
            easing="elastic"
          >
            {projects.map((project) => (
              <Card key={project.title} customClass="fp-swap-card">
                <ProjectCard {...project} />
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
