import { MapPin, Phone, Mail, Link as LinkIcon, Download, Globe, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Resume = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto bg-white">
        {/* Header Section */}
        <div className="text-center mb-6 pb-6 border-b-2 border-gray-300">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Daniyal Mehmood Farrukh
          </h1>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-4 text-gray-700 text-sm mb-3">
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>+923154390301</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>daniyal.farrukpgc@gmail.com</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe size={14} />
              <span>daniyal-folio.vercel.app</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon size={14} />
              <span>GitHub: DaniyalFarrukh</span>
            </div>
            <div className="flex items-center gap-1">
              <Linkedin size={14} />
              <span>LinkedIn: DaniyalFarrukh</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>Lahore, Pakistan</span>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 uppercase tracking-widest">
            AI Data Engineer &amp; Web Developer
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm leading-relaxed">
            Computer Science graduate with hands-on experience building full-stack web applications, production-grade REST APIs, and end-to-end MLOps pipelines. Skilled in model versioning, CI/CD automation, cloud deployment, and data engineering. Experienced in FastAPI, MLflow, Databricks, and GitHub Actions with a strong foundation in software testing and backend systems.
          </p>
        </div>

        {/* Strengths */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
            Strengths and Expertise
          </h2>
          <p className="text-gray-700 text-sm">
            Data Engineering &bull; MLOps &amp; Model Versioning &bull; REST API Development &bull; CI/CD Pipelines &bull; Cloud Computing (AWS &amp; Databricks) &bull; Full-Stack Web Development &bull; Software Testing &amp; Debugging &bull; Database Design &bull; AI &amp; RAG Systems
          </p>
        </div>

        {/* Professional Experience */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Professional Experience
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">AI Engineer — Aidx Solutions</h3>
                <span className="text-gray-600 text-sm">March 2026 – Present</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-1">
                <li>Designed and developed AI-powered solutions leveraging LLMs and RAG systems</li>
                <li>Built and deployed REST APIs integrating AI models into production environments</li>
                <li>Collaborated on end-to-end AI pipelines from data ingestion to model serving</li>
                <li>Applied prompt engineering and AI optimization techniques for real-world use cases</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">Data QC — Country Survey and Mapping Services</h3>
                <span className="text-gray-600 text-sm">Feb 2026 – March 2026</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-1">
                <li>Ensured the accuracy and reliability of GIS and survey data through systematic quality control processes</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">Freelance Web Developer</h3>
                <span className="text-gray-600 text-sm">2025 – Jan 2026</span>
              </div>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-1">
                <li>Developed full-stack web applications using React, Next.js, Node.js, and Express.js</li>
                <li>Built responsive user interfaces improving usability across desktop and mobile devices</li>
                <li>Applied clean code principles and debugging techniques to improve maintainability</li>
                <li>Independently handled deployment and project delivery</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Projects
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">AI RAG Search System</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-0.5">
                <li>Developed a multi-stage retrieval pipeline, improving code search accuracy from 87% to 95%</li>
                <li>Applied semantic &amp; contextual embeddings, BM25 hybrid search, and AI-based reranking</li>
                <li>Deployed Llama 3.2 (Ollama) locally to eliminate API costs</li>
                <li>Integrated Elasticsearch, Voyage AI, and Cohere for search, embeddings, and reranking</li>
                <li>Evaluated performance on 248 queries across 737 code chunks using Pass@K metrics</li>
                <li><span className="font-medium">Tech Stack:</span> Python, Elasticsearch, Voyage AI, Cohere, Llama 3.2 (Ollama), Docker, NumPy</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-sm">BMI &amp; Health Risk System</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-0.5">
                <li>Production REST API (FastAPI) with MLflow pyfunc model versioned across @dev/@staging/@prod</li>
                <li>Deployed via Databricks Asset Bundles (DABs) with serverless compute</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Online Rental Management System <span className="font-normal text-gray-500">(Final Year Project)</span></h3>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-0.5">
                <li>Built a complete rental platform with authentication, listings, and booking system</li>
                <li>Designed relational database schema and implemented CRUD operations</li>
                <li>Added validation and debugging to improve reliability and data consistency</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Issue Tracker Dashboard</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-0.5">
                <li>Developed project management dashboard using Next.js and Prisma</li>
                <li>Implemented task creation, filtering, and status tracking features</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Personal Portfolio Website</h3>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-0.5">
                <li>Designed and deployed responsive portfolio with optimized performance</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-sm">2D Maze Runner Game <span className="font-normal text-gray-500">(C++)</span></h3>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-0.5">
                <li>Implemented OOP concepts, collision detection, and movement mechanics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Gaming Store Database <span className="font-normal text-gray-500">(SQL)</span></h3>
              <ul className="list-disc list-inside text-gray-700 text-sm ml-4 space-y-0.5">
                <li>Designed normalized relational schema and complex queries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Technical Skills
          </h2>

          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
            <div><span className="font-semibold text-gray-900">Languages:</span> JavaScript, TypeScript, Python, C, C++</div>
            <div><span className="font-semibold text-gray-900">Frontend:</span> React.js, Next.js, HTML, CSS</div>
            <div><span className="font-semibold text-gray-900">Backend:</span> Node.js, Express.js, FastAPI</div>
            <div><span className="font-semibold text-gray-900">Databases:</span> SQL, MongoDB, PostgreSQL</div>
            <div><span className="font-semibold text-gray-900">AI / MLOps:</span> MLflow, RAG Systems, LLMs, Prompt Engineering, Ollama, Voyage AI, Cohere</div>
            <div><span className="font-semibold text-gray-900">DevOps &amp; CI/CD:</span> GitHub Actions, Docker, CI/CD Pipelines</div>
            <div className="md:col-span-2"><span className="font-semibold text-gray-900">Testing:</span> Test Case Design, Boundary Testing, Black-Box Testing, White-Box Testing, Control Flow Testing, Debugging</div>
            <div><span className="font-semibold text-gray-900">Cloud:</span> AWS Cloud Foundations (Certification), Databricks</div>
            <div><span className="font-semibold text-gray-900">Tools:</span> Git, GitHub, Prisma, VS Code, Cursor, Databricks Asset Bundles (DABs)</div>
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
            Education
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">University of Central Punjab</h3>
                <p className="text-gray-700">Bachelor of Computer Science (BSCS)</p>
              </div>
              <span className="text-gray-600">2022 – 2026</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">Punjab Group of Colleges</h3>
                <p className="text-gray-700">Intermediate</p>
              </div>
              <span className="text-gray-600">2019 – 2021</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">Beaconhouse School System</h3>
                <p className="text-gray-700">Matriculation</p>
              </div>
              <span className="text-gray-600">2017 – 2019</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4 justify-center print:hidden">
          <Button
            onClick={() => window.history.back()}
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2"
          >
            ← Back to Home
          </Button>
          <Button
            onClick={() => window.print()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
          >
            <Download size={20} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Resume;
