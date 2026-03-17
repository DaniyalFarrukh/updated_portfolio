import { Phone, Github, ExternalLink, GraduationCap, Code, Video, Cloud, MessageCircle, Youtube, ChevronRight, Shield, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import ChatAssistant from "@/components/ChatAssistant";
import { TypewriterText } from "@/components/TypewriterText";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactForm } from "@/components/ContactForm";
import Navbar from "@/components/Navbar";
import { TiltCard } from "@/components/TiltCard";
import { AnimatedStats } from "@/components/AnimatedStats";
import { FloatingGeometry } from "@/components/FloatingGeometry";
import ParticleGlobe from "@/components/ParticleGlobe";

function CursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <motion.div
      animate={{ x: pos.x - 12, y: pos.y - 12 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        position: "fixed",
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "rgba(108, 99, 255, 0.6)",
        pointerEvents: "none",
        zIndex: 9999,
        boxShadow: "0 0 20px 8px rgba(108,99,255,0.3)",
        mixBlendMode: "screen",
      }}
    />
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setPercent(Math.round(v * 100)));
    return unsub;
  }, [scrollYProgress]);
  return (
    <div className="fixed top-6 right-20 z-50 text-xs text-primary font-mono hidden md:flex items-center gap-2">
      <motion.div className="h-0.5 w-16 bg-primary/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </motion.div>
      {percent}%
    </div>
  );
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Index: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!photoRef.current) return;
    gsap.to(photoRef.current, {
      y: -18,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  const projects = [
    {
      title: "Easy Lease",
      description: "A rental website that connects users with item owners, facilitating seamless rental transactions.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      tags: ["React", "Web App", "Rental Platform"],
      liveUrl: "https://easy-lease-orpin.vercel.app",
      isYoutube: false,
    },
    {
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website built with React and Tailwind CSS.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
      tags: ["React", "Tailwind CSS", "Responsive Design"],
      liveUrl: "#",
      isYoutube: false,
    },
    {
      title: "Data Quality Control Dashboard",
      description: "Data QC at CSMS maintaining data accuracy and integrity through structured validation.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
      tags: ["Data QC", "Accuracy"],
      liveUrl: "https://www.linkedin.com/posts/daniyal-farrukh-b41107262_worked-with-the-csms-country-survey-and-ugcPost-7432847530461339648-9qVM",
      isYoutube: false,
    },
  ];

  const certifications = [
    {
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      description: "Foundational understanding of AWS Cloud services, architecture, security, and pricing models.",
      badgeUrl: "https://www.credly.com/badges/6e4ed897-a8c3-4645-9dc1-0102d34d48df/print",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    },
  ];

  const skills = [
    { icon: Code, title: "Website Development", description: "Creating responsive and modern web applications" },
    { icon: Video, title: "App Development", description: "Building mobile and web applications" },
    { icon: Cloud, title: "Website Hosting", description: "Deploying and managing web applications" },
  ];

  const socials = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/daniyal-farrukh-b41107262/" },
    { icon: Github, href: "https://github.com/DaniyalFarrukh" },
    { icon: Youtube, href: "https://www.youtube.com/@TEAMDMF69" },
    { icon: Phone, href: "tel:03284552495" },
  ];

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <CursorGlow />
      <ScrollProgress />
      <Navbar />

      {/* HERO */}
      <section id="home" className="pt-32 pb-20 min-h-screen flex items-center relative">
        <div className="absolute inset-0 z-0">
          <ParticleGlobe />
        </div>
        <FloatingGeometry />
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <p className="text-primary text-lg mb-4">Hello, I'm</p>
                <h1 className="text-5xl lg:text-7xl font-bold mb-6">Daniyal Farrukh</h1>
                <div className="text-3xl lg:text-4xl font-semibold">
                  <TypewriterText
                    texts={["Web Developer", "Full Stack Engineer", "UI/UX Designer", "Content Creator"]}
                    className="gradient-text"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button asChild className="px-8 py-6 text-lg">
                  <Link to="/resume">
                    Get Resume
                    <ChevronRight className="ml-2" size={20} />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="px-8 py-6 text-lg">
                  <a
                    href="https://github.com/DaniyalFarrukh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github size={20} />
                    My Work
                  </a>
                </Button>
              </div>

          <div className="flex gap-4">
            {socials.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="w-12 h-12 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-colors"
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-end items-center pr-0 lg:pr-8"
        >
          <div ref={photoRef} className="relative w-96 h-96">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))" }}
            />
            <motion.div
              className="absolute -inset-3 rounded-full opacity-50"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ background: "conic-gradient(from 90deg, hsl(var(--accent)), hsl(var(--primary)), transparent)", filter: "blur(8px)" }}
            />
            <motion.div
              className="absolute -inset-4 rounded-full"
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)" }}
            />
            <div className="absolute inset-2 bg-background rounded-full overflow-hidden z-10">
              <img
                src="/lovable-uploads/a0028102-d6c3-458e-8a6a-2bdc0f8bfee5.png"
                alt="Daniyal Farrukh"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </motion.div>

        </div>
        </div>
      </section>

  {/* STATS */}
  <AnimatedStats />

  {/* SERVICES + ABOUT */}
  <section id="services" className="py-20 bg-card/30">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12">

        <motion.div
          className="space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 p-6 bg-card border border-border rounded-xl hover:border-primary transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <skill.icon className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{skill.title}</h3>
                <p className="text-muted-foreground mt-2">{skill.description}</p>
              </div>
              <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          id="about"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              About <span className="gradient-text">me</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              As a BSCS graduate, I develop modern web applications, apply strong Software Quality
              Assurance principles, and bring hands-on experience in Data Quality Control to ensure
              reliable and high-performing solutions and have hands on experience using AWS Services.
            </p>
          </div>
          <div className="space-y-4">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold">BSCS - University of Central Punjab</h4>
                <p className="text-muted-foreground">Graduated in 2025</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  </section>

  <SkillsSection />

{/* PROJECTS */}
<section id="projects" className="py-20">
  <div className="max-w-7xl mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl lg:text-5xl font-bold mb-4">
        Featured <span className="gradient-text">Projects</span>
      </h2>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        Explore my latest work showcasing web development and creative projects
      </p>
    </motion.div>

    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {projects.map((project, index) => (
        <motion.div key={index} variants={staggerItem}>
          <TiltCard className="h-full">
            <Card className="bg-card border-border overflow-hidden hover:border-primary transition-all duration-500 group h-full">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <Button asChild size="sm" className="w-full">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    {project.isYoutube ? (
                      <Youtube size={16} className="mr-2" />
                    ) : (
                      <ExternalLink size={16} className="mr-2" />
                    )}
                    {project.isYoutube ? "YouTube" : "Live Demo"}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

{/* CERTIFICATIONS */}
<section id="certifications" className="py-20 bg-card/30">
  <div className="max-w-7xl mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <h2 className="text-4xl lg:text-5xl font-bold mb-4">
        Certifi<span className="gradient-text">cations</span>
      </h2>
      <p className="text-muted-foreground text-lg">
        Professional certifications validating my technical expertise
      </p>
    </motion.div>

    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {certifications.map((cert, index) => (
        <motion.div key={index} variants={staggerItem} whileHover={{ y: -5 }}>
          <Card className="bg-card border-border hover:border-primary transition-all duration-300 group h-full">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                  <img src={cert.icon} alt={cert.issuer} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight">{cert.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{cert.issuer}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{cert.description}</p>
              <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full">
                <a
                  href={cert.badgeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Shield size={16} />
                  View Certificate
                  <ExternalLink size={14} className="ml-auto" />
                </a>
              </Button>
          </CardContent>
        </Card>
              </motion.div>
            ))}
    </motion.div>
  </div>
</section>

      <ContactForm />

      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <Button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full z-50"
          size="icon"
        >
          <MessageCircle size={24} />
        </Button>
      </motion.div>

      {isChatOpen && <ChatAssistant onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default Index;