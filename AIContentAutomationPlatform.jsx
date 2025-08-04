import React, { useState } from 'react';
import { Play, Download, Copy, Edit, Mic, Video, Image, Upload, Settings, Check, Clock, AlertCircle } from 'lucide-react';

export default function AIContentAutomationPlatform() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState({
    title: '',
    description: '',
    tags: [],
    keywords: [],
    script: '',
    thumbnail: null,
    speech: null,
    video: null
  });
  const [workflowStatus, setWorkflowStatus] = useState({
    topic: false,
    seo: false,
    script: false,
    thumbnail: false,
    speech: false,
    video: false,
    upload: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoSettings, setVideoSettings] = useState({
    duration: '<1min',
    style: 'realistic',
    voiceGender: 'female',
    language: 'hindi',
    videoType: 'ai-avatar'
  });

  // Additional states for script generation options
  const [scriptLanguage, setScriptLanguage] = useState('hindi');
  const [scriptLength, setScriptLength] = useState('medium');
  const [scriptTone, setScriptTone] = useState('casual');

  const categories = [
    'Finance & Investing',
    'AI & Tech Tutorials', 
    'Business & Marketing',
    'Real Estate',
    'Health & Fitness',
    'Education',
    'Gaming',
    'Entertainment',
    'Ancient Philosophy + Storytelling',
    'Horror Stories (Faceless)',
    'Anime Self-Help (Motivation + Visuals)',
    'Business Documentaries',
    'Moral Stories (Animated)'
  ];

  const topicsByCategory = {
    'Finance & Investing': ['Stock Market Tips', 'Crypto Analysis', 'Mutual Fund Guide', 'Investment Strategies', 'Tax Saving Tips'],
    'AI & Tech Tutorials': ['AI Tools Review', 'Coding Tutorials', 'Tech News', 'Software Development', 'Future Tech Trends'],
    'Business & Marketing': ['Digital Marketing', 'Startup Stories', 'SEO Strategies', 'Social Media Tips', 'Brand Building'],
    'Real Estate': ['Property Investment', 'Home Buying Tips', 'Real Estate Market Analysis', 'Property Valuation', 'Real Estate Laws'],
    'Health & Fitness': ['Home Workouts', 'Nutrition Tips', 'Mental Health', 'Yoga & Meditation', 'Weight Loss Journey'],
    'Education': ['Study Tips', 'Career Guidance', 'Skill Development', 'Online Learning', 'Competitive Exams'],
    'Gaming': ['Game Reviews', 'Gaming Tips', 'Esports News', 'Game Development', 'Gaming Hardware'],
    'Entertainment': ['Movie Reviews', 'Celebrity News', 'Music Trends', 'Comedy Skits', 'Viral Content'],
    'Ancient Philosophy + Storytelling': ['Bhagavad Gita Lessons', 'Ancient Wisdom', 'Philosophical Stories', 'Mythology Explained', 'Life Lessons'],
    'Horror Stories (Faceless)': ['Paranormal Stories', 'Urban Legends', 'True Crime', 'Ghost Stories', 'Mystery Tales'],
    'Anime Self-Help (Motivation + Visuals)': ['Anime Life Lessons', 'Character Development', 'Motivational Quotes', 'Success Stories', 'Personal Growth'],
    'Business Documentaries': ['Startup Journey', 'Business Case Studies', 'Industry Analysis', 'Success Stories', 'Market Trends'],
    'Moral Stories (Animated)': ['Life Values', 'Ethical Dilemmas', 'Character Building', 'Social Messages', 'Inspirational Tales']
  };

  const generateSEOContent = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(prev => ({
        ...prev,
        title: `${selectedTopic} - Complete Guide in Hindi | 2024 Tips & Tricks`,
        description: `${selectedTopic} के बारे में complete information. Latest tips, tricks और strategies जो आपकी life को बदल देंगे। Subscribe करें और share करें! #${selectedTopic.replace(/\s+/g, '')} #Hindi #Tutorial #2024`,
        tags: ['hindi', selectedTopic.toLowerCase().replace(/\s+/g, ''), 'tutorial', 'tips', '2024', 'guide', 'education'],
        keywords: [selectedTopic, 'hindi tutorial', 'tips and tricks', 'guide', 'complete guide', 'latest 2024']
      }));
      setWorkflowStatus(prev => ({ ...prev, seo: true }));
      setIsGenerating(false);
    }, 2000);
  };

  const generateScript = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const sampleScript = `नमस्कार दोस्तों! आज हम बात करेंगे ${selectedTopic} के बारे में।

यह टॉपिक आजकल बहुत ट्रेंडिंग में है और आपको इसके बारे में पूरी जानकारी होनी चाहिए।

मैं आपको step by step बताऊंगा कि कैसे आप इसका फायदा उठा सकते हैं।

सबसे पहले आपको समझना होगा कि...

✅ Point 1: मुख्य concept को समझना
✅ Point 2: Practical implementation  
✅ Point 3: Common mistakes से बचना
✅ Point 4: Best practices follow करना

इन सभी points को detail में समझने के लिए video को last तक देखते रहिए।

अगर आपको यह video helpful लगे तो:
👍 Like करना न भूलें
🔔 Subscribe करें notification के साथ
💬 Comment में बताएं आपका experience

तो दोस्तों, यह थी आज की जानकारी। मिलते हैं अगली video में!`;

      setGeneratedContent(prev => ({
        ...prev,
        script: sampleScript
      }));
      setWorkflowStatus(prev => ({ ...prev, script: true }));
      setIsGenerating(false);
    }, 3000);
  };

  const generateThumbnail = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(prev => ({
        ...prev,
        thumbnail: '/api/placeholder/1280/720'
      }));
      setWorkflowStatus(prev => ({ ...prev, thumbnail: true }));
      setIsGenerating(false);
    }, 2500);
  };

  const generateSpeech = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(prev => ({
        ...prev,
        speech: 'generated_speech.mp3'
      }));
      setWorkflowStatus(prev => ({ ...prev, speech: true }));
      setIsGenerating(false);
    }, 4000);
  };

  const generateVideo = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(prev => ({
        ...prev,
        video: 'generated_video.mp4'
      }));
      setWorkflowStatus(prev => ({ ...prev, video: true }));
      setIsGenerating(false);
    }, 10000);
  };

  const uploadToYoutube = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setWorkflowStatus(prev => ({ ...prev, upload: true }));
      setIsGenerating(false);
      alert('Successfully uploaded to YouTube Studio!');
    }, 3000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getStepStatus = (step) => {
    const statusMap = {
      1: workflowStatus.topic,
      2: workflowStatus.seo,
      3: workflowStatus.script,
      4: workflowStatus.thumbnail,
      5: workflowStatus.speech,
      6: workflowStatus.video,
      7: workflowStatus.upload
    };
    return statusMap[step];
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setSelectedCategory('');
    setSelectedTopic('');
    setGeneratedContent({
      title: '',
      description: '',
      tags: [],
      keywords: [],
      script: '',
      thumbnail: null,
      speech: null,
      video: null
    });
    setWorkflowStatus({
      topic: false,
      seo: false,
      script: false,
      thumbnail: false,
      speech: false,
      video: false,
      upload: false
    });
    setScriptLanguage('hindi');
    setScriptLength('medium');
    setScriptTone('casual');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            AI Content Automation Platform
          </h1>
          <p className="text-xl text-gray-300">Complete AI-Powered Video Creation & YouTube Automation</p>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={resetWorkflow} className="px-4 py-2 bg-gray-600/50 rounded-lg hover:bg-gray-600/70 transition-colors">
              Reset Workflow
            </button>
            <button className="px-4 py-2 bg-blue-600/50 rounded-lg hover:bg-blue-600/70 transition-colors">
              <Settings className="w-4 h-4 inline mr-2" />
              Settings
            </button>
          </div>
        </header>

        {/* Workflow Progress */}
        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Workflow Progress</h2>
          <div className="grid grid-cols-7 gap-4">
            {[
              { step: 1, title: 'Topic', icon: '🎯' },
              { step: 2, title: 'SEO', icon: '🔍' },
              { step: 3, title: 'Script', icon: '📝' },
              { step: 4, title: 'Thumbnail', icon: '🖼️' },
              { step: 5, title: 'Speech', icon: '🎤' },
              { step: 6, title: 'Video', icon: '🎬' },
              { step: 7, title: 'Upload', icon: '📤' }
            ].map(({ step, title, icon }) => (
              <div key={step} className={`text-center p-3 rounded-lg transition-all cursor-pointer hover:scale-105 ${
                getStepStatus(step) ? 'bg-green-500/20 border-green-400' : 
                currentStep === step ? 'bg-blue-500/20 border-blue-400' : 
                'bg-gray-500/20 border-gray-600'
              } border`} onClick={() => step <= Math.max(...Object.keys(workflowStatus).map((k, i) => workflowStatus[k] ? i + 1 : 0)) + 1 && setCurrentStep(step)}>
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-sm font-medium">{title}</div>
                {getStepStatus(step) ? <Check className="w-4 h-4 text-green-400 mx-auto mt-1" /> : 
                 currentStep === step ? <Clock className="w-4 h-4 text-blue-400 mx-auto mt-1" /> : null}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Category & Topic Selection */}
        {currentStep === 1 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Step 1: Select Category & Topic</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium mb-3">Choose Category:</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedTopic('');
                  }}
                  className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="text-black">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-3">Choose Topic:</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={!selectedCategory}
                  className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white disabled:opacity-50"
                >
                  <option value="">Select Topic</option>
                  {selectedCategory && topicsByCategory[selectedCategory]?.map(topic => (
                    <option key={topic} value={topic} className="text-black">{topic}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCategory && (
              <div className="mt-4 p-4 bg-blue-500/20 rounded-lg">
                <h3 className="font-medium mb-2">Category Info: {selectedCategory}</h3>
                <p className="text-sm text-gray-300">
                  {selectedCategory === 'Finance & Investing' && 'Create educational content about financial literacy, investment strategies, and money management.'}
                  {selectedCategory === 'AI & Tech Tutorials' && 'Share the latest in AI tools, programming tutorials, and technology trends.'}
                  {selectedCategory === 'Health & Fitness' && 'Promote wellness through workout routines, nutrition advice, and mental health tips.'}
                  {selectedCategory === 'Education' && 'Educational content focused on learning strategies, career development, and skill building.'}
                  {!['Finance & Investing', 'AI & Tech Tutorials', 'Health & Fitness', 'Education'].includes(selectedCategory) && 
                   `Create engaging content in the ${selectedCategory} niche with trending topics and valuable insights.`}
                </p>
              </div>
            )}

            {selectedTopic && (
              <button
                onClick={() => {
                  setWorkflowStatus(prev => ({ ...prev, topic: true }));
                  setCurrentStep(2);
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Continue to SEO Generation →
              </button>
            )}
          </div>
        )}

        {/* Step 2: SEO Content Generation */}
        {currentStep === 2 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Step 2: SEO Content Generation</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium mb-2">Generated Title:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedContent.title}
                    onChange={(e) => setGeneratedContent(prev => ({ ...prev, title: e.target.value }))}
                    className="flex-1 p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                    placeholder="Title will be generated..."
                  />
                  <button onClick={() => copyToClipboard(generatedContent.title)} className="p-3 bg-blue-500/20 rounded-lg hover:bg-blue-500/30">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-1">Character count: {generatedContent.title.length}/100 (Recommended: 60-70)</p>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">Generated Description:</label>
                <div className="flex gap-2">
                  <textarea
                    value={generatedContent.description}
                    onChange={(e) => setGeneratedContent(prev => ({ ...prev, description: e.target.value }))}
                    className="flex-1 p-3 bg-white/20 rounded-lg border border-white/30 text-white h-24"
                    placeholder="Description will be generated..."
                  />
                  <button onClick={() => copyToClipboard(generatedContent.description)} className="p-3 bg-blue-500/20 rounded-lg hover:bg-blue-500/30">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-1">Character count: {generatedContent.description.length}/5000</p>
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">Generated Tags:</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {generatedContent.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-500/30 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-400">Tags help your video get discovered by the right audience</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={generateSEOContent}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate SEO Content'}
                </button>
                
                {workflowStatus.seo && (
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Continue to Script →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Script Generation */}
        {currentStep === 3 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Step 3: Script Generation & Editing</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium mb-2">Generated Script:</label>
                <div className="relative">
                  <textarea
                    value={generatedContent.script}
                    onChange={(e) => setGeneratedContent(prev => ({ ...prev, script: e.target.value }))}
                    className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white h-64"
                    placeholder="Script will be generated..."
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => copyToClipboard(generatedContent.script)} className="p-2 bg-blue-500/20 rounded hover:bg-blue-500/30">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-green-500/20 rounded hover:bg-green-500/30" title="Edit Script">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Word count: {generatedContent.script.trim() ? generatedContent.script.trim().split(/\s+/).length : 0} | 
                  Estimated duration: ~{Math.ceil((generatedContent.script.trim() ? generatedContent.script.trim().split(/\s+/).length : 0) / 150)} min
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-lg font-medium mb-2">Language:</label>
                  <select
                    value={scriptLanguage}
                    onChange={(e) => setScriptLanguage(e.target.value)}
                    className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                  >
                    <option value="hindi" className="text-black">Hindi</option>
                    <option value="english" className="text-black">English</option>
                    <option value="gujarati" className="text-black">Gujarati</option>
                    <option value="marathi" className="text-black">Marathi</option>
                    <option value="tamil" className="text-black">Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Script Length:</label>
                  <select
                    value={scriptLength}
                    onChange={(e) => setScriptLength(e.target.value)}
                    className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                  >
                    <option value="short" className="text-black">Short (30-60 sec)</option>
                    <option value="medium" className="text-black">Medium (1-3 min)</option>
                    <option value="long" className="text-black">Long (3-5 min)</option>
                    <option value="detailed" className="text-black">Detailed (5+ min)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-medium mb-2">Tone:</label>
                  <select
                    value={scriptTone}
                    onChange={(e) => setScriptTone(e.target.value)}
                    className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                  >
                    <option value="casual" className="text-black">Casual & Friendly</option>
                    <option value="professional" className="text-black">Professional & Formal</option>
                    <option value="motivational" className="text-black">Motivational</option>
                    <option value="humorous" className="text-black">Humorous</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={generateScript}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate Script'}
                </button>

                {workflowStatus.script && (
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Continue to Thumbnail →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Thumbnail Generation */}
        {currentStep === 4 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Step 4: AI Thumbnail Generation</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Thumbnail Preview:</h3>
                  <div className="relative aspect-video bg-white/10 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
                    {generatedContent.thumbnail ? (
                      <img 
                        src={generatedContent.thumbnail} 
                        alt="Generated Thumbnail" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Image className="w-12 h-12 mx-auto mb-2" />
                        <p>Thumbnail will appear here</p>
                      </div>
                    )}
                  </div>
                  {generatedContent.thumbnail && (
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => window.open(generatedContent.thumbnail, '_blank')}
                        className="flex-1 px-4 py-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button 
                        onClick={() => setGeneratedContent(prev => ({ ...prev, thumbnail: null }))}
                        className="px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Thumbnail Settings:</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Style:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="photorealistic" className="text-black">Photorealistic</option>
                        <option value="cartoon" className="text-black">Cartoon</option>
                        <option value="anime" className="text-black">Anime</option>
                        <option value="minimal" className="text-black">Minimal</option>
                        <option value="dramatic" className="text-black">Dramatic</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Color Scheme:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="vibrant" className="text-black">Vibrant & Eye-catching</option>
                        <option value="professional" className="text-black">Professional</option>
                        <option value="dark" className="text-black">Dark Theme</option>
                        <option value="bright" className="text-black">Bright & Cheerful</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Text Overlay:</label>
                      <input 
                        type="text" 
                        placeholder="Enter thumbnail text (optional)"
                        className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Face Expression:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="excited" className="text-black">Excited/Surprised</option>
                        <option value="confident" className="text-black">Confident</option>
                        <option value="happy" className="text-black">Happy/Smiling</option>
                        <option value="serious" className="text-black">Serious/Professional</option>
                        <option value="no-face" className="text-black">No Face (Faceless)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-300">Thumbnail Best Practices:</h4>
                    <ul className="text-sm text-yellow-200 mt-1 space-y-1">
                      <li>• Use bright, contrasting colors to stand out</li>
                      <li>• Include faces with expressions (increases CTR by 30%)</li>
                      <li>• Keep text large and readable (max 4-6 words)</li>
                      <li>• Ensure it looks good at small sizes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={generateThumbnail}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isGenerating ? 'Generating Thumbnail...' : 'Generate AI Thumbnail'}
                </button>
                
                <button className="px-6 py-3 bg-gray-600/50 rounded-lg font-medium hover:bg-gray-600/70 transition-colors">
                  Upload Custom Thumbnail
                </button>

                {workflowStatus.thumbnail && (
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Continue to Speech →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Speech Generation */}
        {currentStep === 5 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Step 5: AI Speech Generation</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Voice Settings:</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Voice Gender:</label>
                      <select 
                        value={videoSettings.voiceGender}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, voiceGender: e.target.value }))}
                        className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                      >
                        <option value="female" className="text-black">Female Voice</option>
                        <option value="male" className="text-black">Male Voice</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Language:</label>
                      <select 
                        value={videoSettings.language}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                      >
                        <option value="hindi" className="text-black">Hindi</option>
                        <option value="english" className="text-black">English</option>
                        <option value="gujarati" className="text-black">Gujarati</option>
                        <option value="marathi" className="text-black">Marathi</option>
                        <option value="tamil" className="text-black">Tamil</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Speaking Speed:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="slow" className="text-black">Slow (0.8x)</option>
                        <option value="normal" className="text-black">Normal (1.0x)</option>
                        <option value="fast" className="text-black">Fast (1.2x)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Voice Tone:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="natural" className="text-black">Natural</option>
                        <option value="enthusiastic" className="text-black">Enthusiastic</option>
                        <option value="calm" className="text-black">Calm & Soothing</option>
                        <option value="authoritative" className="text-black">Authoritative</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Audio Preview:</h3>
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    {generatedContent.speech ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <button className="p-2 bg-green-500/20 rounded-full hover:bg-green-500/30">
                            <Play className="w-5 h-5" />
                          </button>
                          <div className="flex-1 bg-white/20 rounded-full h-2">
                            <div className="bg-green-400 h-2 rounded-full w-1/3"></div>
                          </div>
                          <span className="text-sm text-gray-300">1:23 / 3:45</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-blue-500/20 rounded hover:bg-blue-500/30 flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button className="px-3 py-2 bg-purple-500/20 rounded hover:bg-purple-500/30">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <Mic className="w-12 h-12 mx-auto mb-2" />
                        <p>Audio will be generated here</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-300">Voice Quality Tips:</h4>
                        <ul className="text-sm text-blue-200 mt-1 space-y-1">
                          <li>• Natural pauses improve engagement</li>
                          <li>• Match voice tone to content style</li>
                          <li>• Clear pronunciation increases retention</li>
                          <li>• Background music can be added later</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Script for Speech Generation:</h3>
                <textarea
                  value={generatedContent.script}
                  onChange={(e) => setGeneratedContent(prev => ({ ...prev, script: e.target.value }))}
                  className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white h-32"
                  placeholder="Script content for speech generation..."
                />
                <p className="text-sm text-gray-400 mt-1">
                  Estimated speech duration: ~{Math.ceil((generatedContent.script.trim() ? generatedContent.script.trim().split(/\s+/).length : 0) / 150)} minutes
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={generateSpeech}
                  disabled={isGenerating || !generatedContent.script.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isGenerating ? 'Generating Speech...' : 'Generate AI Speech'}
                </button>
                
                <button className="px-6 py-3 bg-gray-600/50 rounded-lg font-medium hover:bg-gray-600/70 transition-colors">
                  Upload Audio File
                </button>

                {workflowStatus.speech && (
                  <button
                    onClick={() => setCurrentStep(6)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Continue to Video →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Video Generation */}
        {currentStep === 6 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Step 6: AI Video Generation</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Video Settings:</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Video Type:</label>
                      <select 
                        value={videoSettings.videoType}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, videoType: e.target.value }))}
                        className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                      >
                        <option value="ai-avatar" className="text-black">AI Avatar Presenter</option>
                        <option value="faceless" className="text-black">Faceless (Text + Visuals)</option>
                        <option value="animation" className="text-black">Animated Characters</option>
                        <option value="stock-footage" className="text-black">Stock Footage + Voiceover</option>
                        <option value="slideshow" className="text-black">Slideshow Presentation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Video Style:</label>
                      <select 
                        value={videoSettings.style}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, style: e.target.value }))}
                        className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                      >
                        <option value="realistic" className="text-black">Realistic</option>
                        <option value="cartoon" className="text-black">Cartoon</option>
                        <option value="minimalist" className="text-black">Minimalist</option>
                        <option value="cinematic" className="text-black">Cinematic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Video Duration:</label>
                      <select 
                        value={videoSettings.duration}
                        onChange={(e) => setVideoSettings(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white"
                      >
                        <option value="<1min" className="text-black">Short (< 1 min)</option>
                        <option value="1-3min" className="text-black">Medium (1-3 min)</option>
                        <option value="3-5min" className="text-black">Long (3-5 min)</option>
                        <option value="5+min" className="text-black">Extended (5+ min)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Video Quality:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="hd" className="text-black">HD (720p)</option>
                        <option value="fullhd" className="text-black">Full HD (1080p)</option>
                        <option value="4k" className="text-black">4K (2160p) - Premium</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Background Music:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="none" className="text-black">No Music</option>
                        <option value="upbeat" className="text-black">Upbeat & Energetic</option>
                        <option value="calm" className="text-black">Calm & Relaxing</option>
                        <option value="corporate" className="text-black">Corporate</option>
                        <option value="trending" className="text-black">Trending Sounds</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Video Preview:</h3>
                  <div className="aspect-video bg-white/10 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center mb-4">
                    {generatedContent.video ? (
                      <div className="relative w-full h-full">
                        <video 
                          className="w-full h-full object-cover rounded-lg" 
                          controls
                          poster={generatedContent.thumbnail}
                        >
                          <source src={generatedContent.video} type="video/mp4" />
                        </video>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <Video className="w-12 h-12 mx-auto mb-2" />
                        <p>Video will be generated here</p>
                        <p className="text-sm mt-1">Estimated generation time: 5-10 minutes</p>
                      </div>
                    )}
                  </div>

                  {generatedContent.video && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" />
                          Download Video
                        </button>
                        <button className="px-4 py-2 bg-green-500/20 rounded-lg hover:bg-green-500/30">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-400 text-center">
                        Duration: 3:45 | Size: 45.2 MB | Format: MP4
                      </div>
                    </div>
                  )}

                  <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-300">Video Generation Notes:</h4>
                        <ul className="text-sm text-purple-200 mt-1 space-y-1">
                          <li>• Higher quality = longer generation time</li>
                          <li>• Preview in multiple sizes before finalizing</li>
                          <li>• Captions can be auto-generated</li>
                          <li>• Custom intro/outro can be added</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Generation Progress:</h3>
                {isGenerating ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Generating video...</span>
                      <span>45% Complete</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full w-[45%] transition-all duration-500"></div>
                    </div>
                    <div className="text-sm text-gray-400">
                      Estimated time remaining: 4 minutes 30 seconds
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    Ready to generate video
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={generateVideo}
                  disabled={isGenerating || !generatedContent.speech || !generatedContent.script.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {isGenerating ? 'Generating Video...' : 'Generate AI Video'}
                </button>
                
                <button className="px-6 py-3 bg-gray-600/50 rounded-lg font-medium hover:bg-gray-600/70 transition-colors">
                  Upload Video File
                </button>

                {workflowStatus.video && (
                  <button
                    onClick={() => setCurrentStep(7)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium hover:scale-105 transition-transform"
                  >
                    Continue to Upload →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: YouTube Upload */}
        {currentStep === 7 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Step 7: YouTube Upload & Publishing</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Upload Settings:</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Privacy:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="public" className="text-black">Public</option>
                        <option value="unlisted" className="text-black">Unlisted</option>
                        <option value="private" className="text-black">Private</option>
                        <option value="scheduled" className="text-black">Scheduled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Category:</label>
                      <select className="w-full p-3 bg-white/20 rounded-lg border border-white/30 text-white">
                        <option value="education" className="text-black">Education</option>
                        <option value="howto" className="text-black">How-to & Style</option>
                        <option value="entertainment" className="text-black">Entertainment</option>
                        <option value="news" className="text-black">News & Politics</option>
                        <option value="tech" className="text-black">Science & Technology</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Audience:</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="audience" value="all" className="text-purple-500" />
                          <span>Not made for kids</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="audience" value="kids" className="text-purple-500" />
                          <span>Made for kids</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Monetization:</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="text-purple-500" />
                          <span>Enable monetization</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="text-purple-500" />
                          <span>Allow ads on this video</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Final Review:</h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Title:</h4>
                      <p className="text-sm text-gray-300">{generatedContent.title}</p>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Description:</h4>
                      <p className="text-sm text-gray-300 line-clamp-3">{generatedContent.description}</p>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-1">
                        {generatedContent.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/30 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Thumbnail:</h4>
                      {generatedContent.thumbnail && (
                        <img 
                          src={generatedContent.thumbnail} 
                          alt="Thumbnail" 
                          className="w-full aspect-video object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-300">Pre-Upload Checklist:</h4>
                    <ul className="text-sm text-green-200 mt-1 space-y-1">
                      <li>✅ Video content generated and reviewed</li>
                      <li>✅ Thumbnail created and optimized</li>
                      <li>✅ SEO title and description ready</li>
                      <li>✅ Tags and keywords added</li>
                      <li>✅ Audio quality checked</li>
                      <li>✅ Upload settings configured</li>
                    </ul>
                  </div>
                </div>
              </div>

              {workflowStatus.upload && (
                <div className="bg-green-600 rounded-lg p-4 text-center">
                  <Check className="w-12 h-12 mx-auto mb-3 text-white" />
                  <h3 className="text-xl font-bold text-white mb-2">Upload Successful! 🎉</h3>
                  <p className="text-green-100 mb-4">Your video has been uploaded to YouTube Studio</p>
                  <div className="flex gap-4 justify-center">
                    <button className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                      View in YouTube Studio
                    </button>
                    <button className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                      Share Video Link
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={uploadToYoutube}
                  disabled={isGenerating || !generatedContent.video}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg font-medium hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  {isGenerating ? 'Uploading...' : 'Upload to YouTube'}
                </button>
                
                <button className="px-6 py-3 bg-gray-600/50 rounded-lg font-medium hover:bg-gray-600/70 transition-colors">
                  Save as Draft
                </button>

                <button 
                  onClick={resetWorkflow}
                  className="px-6 py-3 bg-blue-600/50 rounded-lg font-medium hover:bg-blue-600/70 transition-colors"
                >
                  Create New Video
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}