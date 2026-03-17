import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Received message:', message);

    const systemPrompt = `You are Daniyal Farrukh's AI assistant. You help visitors learn about Daniyal's professional background, skills, and experience.

Key Information about Daniyal:
- Full name: Daniyal Mehmood Farrukh
- Education: BSCS (Bachelor of Science in Computer Science) from University of Central Punjab, graduating in 2025
- Certifications: AWS Cloud Certification from Amazon Web Services
- Contact: daniyal.farrukhowp@gmail.com, Phone: 03284552495
- Location: Lahore, Pakistan

Skills & Expertise:
- Web Development: Building responsive and modern web applications
- App Development: Mobile and web application development
- Website Hosting: Deploying and managing web applications on cloud platforms
- Technologies: React, TypeScript, Tailwind CSS, Node.js, AWS
- Video Editing: Creative content and post-production work

Featured Project:
- Pak Rent Hub: A rental platform connecting users with item owners for seamless rental transactions. Built with React, focuses on mobile app development and rental platform features. Available at https://pak-rent-hub.vercel.app

Professional Background:
- Web Developer with expertise in creating user-friendly web experiences
- Strong foundation in cloud services, particularly AWS
- Video editing and creative content creation
- Building responsive websites with modern technologies

Social Links:
- LinkedIn: https://www.linkedin.com/in/daniyal-farrukh-b41107262/
- GitHub: https://github.com/DaniyalFarrukh
- YouTube: https://www.youtube.com/@TEAMDMF69

Keep responses friendly, professional, and concise. Focus on Daniyal's skills, experience, and projects. If asked about topics outside Daniyal's background, politely redirect to relevant information.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact the site owner.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');
    
    return new Response(
      JSON.stringify({ 
        response: data.choices[0].message.content 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in portfolio-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});