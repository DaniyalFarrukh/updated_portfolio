
import { MapPin, Phone, Mail, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row">
          {/* Profile Photo */}
          <div className="md:w-80 bg-gray-200 p-8 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
              <img 
                src="/lovable-uploads/a46e92a6-0ae9-4bf6-9011-3b36d49fcb41.png" 
                alt="Daniyal Mehmood Farrukh"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Contact Section */}
            <div className="w-full bg-gray-800 text-white p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-4 text-center">CONTACT</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span>03284552495</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span>daniyal.farrukhowp@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <LinkIcon size={16} />
                  <span>github.com/DaniyalFarrukh</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>Lahore, Pakistan</span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="w-full bg-gray-800 text-white p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-4 text-center">SKILLS</h3>
              <div className="space-y-3">
                {[
                  { skill: "Next.js", level: "90%" },
                  { skill: "React.js", level: "85%" },
                  { skill: "Node.js", level: "80%" },
                  { skill: "Python", level: "75%" },
                  { skill: "C++", level: "70%" },
                  { skill: "Linux(Ubuntu)", level: "85%" },
                  { skill: "SQL", level: "80%" }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.skill}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: item.level }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages Section */}
            <div className="w-full bg-gray-800 text-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-center">LANGUAGES</h3>
              <div className="space-y-3">
                {[
                  { language: "English", level: "95%" },
                  { language: "Urdu", level: "100%" }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.language}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: item.level }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Name and Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                DANIYAL MEHMOOD FARRUKH
              </h1>
              <h2 className="text-xl text-gray-600 font-medium">Web Developer</h2>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
                <h3 className="text-lg font-bold text-center">INTRODUCTION</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                I am a web Developer and Computer Science Graduate with a robust 
                understanding of Data Structures and Algorithms, Object-Oriented 
                Programming and Operating Systems.
              </p>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
                <h3 className="text-lg font-bold text-center">EXPERIENCE</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700">• Good understanding of HTML CSS, JavaScript, React.js, Next.js, Node.js, Express, PHP, TypeScript, Prisma, SQL, MongoDB</p>
                </div>
                <div>
                  <p className="text-gray-700">• Teaching algorithms on OS (Ubuntu) via Youtube. Channel Name: Reviving Skills</p>
                </div>
                <div>
                  <p className="text-gray-700">• Full Stack Issue Tracker Dashboard Application using Next.js and Prisma</p>
                </div>
                <div>
                  <p className="text-gray-700">• Exploration of Python, chatbots using voiceflow, machine learning and generative AI</p>
                </div>
                <div>
                  <p className="text-gray-700">• Developed a data visualization project using Streamlit for my Big Data course</p>
                </div>
                <div>
                  <p className="text-gray-700">• Social Media Application Project using React.js and Firebase</p>
                </div>
                <div>
                  <p className="text-gray-700">• Developed my own personal Portfolio by using Next.js</p>
                </div>
                <div>
                  <p className="text-gray-700">• Developed a POS system for Dough Joy by using Next.js</p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
                <h3 className="text-lg font-bold text-center">EDUCATION</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Bachelor of Computer Science
                  </h4>
                  <p className="text-blue-600 font-medium">University of Central Punjab</p>
                  <p className="text-gray-600">Graduating in 2025</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Intermediate
                  </h4>
                  <p className="text-blue-600 font-medium">Punjab Group Colleges</p>
                  <p className="text-gray-600">2018-2020</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Matric
                  </h4>
                  <p className="text-blue-600 font-medium">Beaconhouse School System</p>
                  <p className="text-gray-600">2016-2018</p>
                </div>
              </div>
            </div>

            {/* Back to Home Button */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Button 
                onClick={() => window.history.back()}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
