import React from 'react';
import CardSwap, { Card } from './CardSwap';
import './FeaturedProjects.css';

const projects = [
  {
    title: 'Easy Lease',
    description: 'A rental website that connects users with item owners, facilitating seamless rental transactions.',
    tags: ['React', 'Web App', 'Rental Platform'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
    demo: 'https://easy-lease-orpin.vercel.app',
  },
  {
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website built with React and Tailwind CSS.',
    tags: ['React', 'Tailwind CSS', 'Responsive Design'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    demo: '#',
  },
  {
    title: 'Data Quality Control Dashboard',
    description: 'Data QC at CSMS maintaining data accuracy and integrity through structured validation.',
    tags: ['Data QC', 'Accuracy'],
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    demo: 'https://www.linkedin.com/posts/daniyal-farrukh-b41107262_worked-with-the-csms-country-survey-and-ugcPost-7432847530461339648-9qVM',
  },
];

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  image: string;
  demo: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, tags, image, demo }) => (
  <div className="fp-card-inner">
    <div className="fp-card-image">
      <img src={image} alt={title} />
    </div>
    <div className="fp-card-body">
      <h3 className="fp-card-title">{title}</h3>
      <p className="fp-card-desc">{description}</p>
      <div className="fp-card-tags">
        {tags.map((tag) => (
          <span key={tag} className="fp-tag">{tag}</span>
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

const FeaturedProjects: React.FC = () => {
  return (
    <section className="fp-section" id="projects">
      <div className="fp-bg" aria-hidden="true" />
      <div className="fp-content">
        {/* Left */}
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
            Cards auto-rotate every 5 seconds — hover to pause
          </div>
        </div>

        {/* Right: CardSwap stack */}
        <div className="fp-right">
          <CardSwap
            width={420}
            height={460}
            cardDistance={60}
            verticalDistance={70}
            delay={5000}
            pauseOnHover={true}
            skewAmount={6}
            easing="elastic"
          >
            {projects.map((project) => (
              <Card key={project.title}>
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
