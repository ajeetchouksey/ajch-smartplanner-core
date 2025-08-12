import React, { useState } from 'react';
import './LearningPlannerService.css';

interface LearningGoal {
  subject: string;
  timeframe: string;
  experience: string;
  goals: string;
  timeAvailable: string;
  preferences: string;
}

interface LearningPlan {
  title: string;
  duration: string;
  phases: LearningPhase[];
  dailyTasks: DailyTask[];
}

interface LearningPhase {
  name: string;
  duration: string;
  description: string;
  milestones: string[];
}

interface DailyTask {
  date: string;
  task: string;
  duration: string;
  type: 'study' | 'practice' | 'review' | 'project';
}

const LEARNING_EXAMPLES = [
  {
    title: "Learn Python Programming",
    description: "Complete beginner to job-ready in 3 months",
    timeframe: "3 months",
    dailyTime: "2 hours"
  },
  {
    title: "Master Data Science",
    description: "Statistics, ML, and analytics in 6 months",
    timeframe: "6 months", 
    dailyTime: "3 hours"
  },
  {
    title: "Web Development Bootcamp",
    description: "Full-stack development in 4 months",
    timeframe: "4 months",
    dailyTime: "4 hours"
  },
  {
    title: "Digital Marketing Certification",
    description: "SEO, SEM, and social media in 2 months",
    timeframe: "2 months",
    dailyTime: "1.5 hours"
  }
];

export const LearningPlannerService: React.FC = () => {
  const [step, setStep] = useState<'examples' | 'input' | 'plan' | 'schedule'>('examples');
  const [learningGoal, setLearningGoal] = useState<LearningGoal>({
    subject: '',
    timeframe: '',
    experience: '',
    goals: '',
    timeAvailable: '',
    preferences: ''
  });
  const [generatedPlan, setGeneratedPlan] = useState<LearningPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExampleSelect = (example: typeof LEARNING_EXAMPLES[0]) => {
    setLearningGoal({
      subject: example.title,
      timeframe: example.timeframe,
      experience: 'beginner',
      goals: example.description,
      timeAvailable: example.dailyTime,
      preferences: 'structured learning with practical projects'
    });
    setStep('input');
  };

  const generateLearningPlan = async () => {
    setIsGenerating(true);
    
    // Simulate AI plan generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const plan: LearningPlan = {
      title: `${learningGoal.subject} Learning Plan`,
      duration: learningGoal.timeframe,
      phases: [
        {
          name: "Foundation Phase",
          duration: "25% of total time",
          description: "Build core understanding and fundamentals",
          milestones: ["Complete basic concepts", "Setup development environment", "First practical exercise"]
        },
        {
          name: "Practice Phase", 
          duration: "50% of total time",
          description: "Hands-on practice and skill building",
          milestones: ["Complete 3 projects", "Master key tools", "Build portfolio piece"]
        },
        {
          name: "Mastery Phase",
          duration: "25% of total time", 
          description: "Advanced topics and real-world application",
          milestones: ["Capstone project", "Industry best practices", "Job-ready skills"]
        }
      ],
      dailyTasks: generateDailyTasks(learningGoal)
    };
    
    setGeneratedPlan(plan);
    setIsGenerating(false);
    setStep('plan');
  };

  const generateDailyTasks = (goal: LearningGoal): DailyTask[] => {
    const tasks: DailyTask[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const taskTypes: Array<DailyTask['type']> = ['study', 'practice', 'review', 'project'];
      const taskType = taskTypes[i % taskTypes.length];
      
      tasks.push({
        date: date.toISOString().split('T')[0],
        task: `${goal.subject} - ${getTaskByType(taskType, i)}`,
        duration: goal.timeAvailable,
        type: taskType
      });
    }
    
    return tasks;
  };

  const getTaskByType = (type: DailyTask['type'], day: number): string => {
    const tasks = {
      study: [`Read chapter ${Math.floor(day/4) + 1}`, 'Watch tutorial videos', 'Review documentation'],
      practice: ['Complete coding exercises', 'Build mini-project', 'Practice problems'],
      review: ['Review previous concepts', 'Take practice quiz', 'Refactor old code'],
      project: ['Work on main project', 'Add new features', 'Test and debug']
    };
    
    return tasks[type][day % tasks[type].length];
  };

  const createSchedule = () => {
    // This would integrate with the day planner
    setStep('schedule');
    // Trigger calendar integration
    const event = new CustomEvent('addLearningPlanToCalendar', {
      detail: { plan: generatedPlan }
    });
    window.dispatchEvent(event);
  };

  if (step === 'examples') {
    return (
      <div className="learning-planner-service">
        <div className="learning-header">
          <h2>🎓 AI Learning Planner</h2>
          <p>Let our AI help you create a personalized learning plan. Start with an example or create your own:</p>
        </div>
        
        <div className="learning-examples">
          {LEARNING_EXAMPLES.map((example, index) => (
            <div key={index} className="learning-example-card" onClick={() => handleExampleSelect(example)}>
              <h3>{example.title}</h3>
              <p>{example.description}</p>
              <div className="example-meta">
                <span>📅 {example.timeframe}</span>
                <span>⏰ {example.dailyTime}/day</span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="btn-custom" onClick={() => setStep('input')}>
          Create Custom Learning Plan
        </button>
      </div>
    );
  }

  if (step === 'input') {
    return (
      <div className="learning-planner-service">
        <div className="learning-header">
          <h2>📚 Tell me about your learning goals</h2>
          <p>The more details you provide, the better I can customize your learning plan:</p>
        </div>
        
        <form className="learning-form">
          <div className="form-group">
            <label>What do you want to learn?</label>
            <input
              type="text"
              value={learningGoal.subject}
              onChange={(e) => setLearningGoal({...learningGoal, subject: e.target.value})}
              placeholder="e.g., Python Programming, Digital Marketing, Data Science"
            />
          </div>
          
          <div className="form-group">
            <label>What's your timeframe?</label>
            <select
              value={learningGoal.timeframe}
              onChange={(e) => setLearningGoal({...learningGoal, timeframe: e.target.value})}
            >
              <option value="">Select timeframe</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Current experience level?</label>
            <select
              value={learningGoal.experience}
              onChange={(e) => setLearningGoal({...learningGoal, experience: e.target.value})}
            >
              <option value="">Select level</option>
              <option value="complete beginner">Complete beginner</option>
              <option value="some basics">Some basics</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>How much time can you dedicate daily?</label>
            <select
              value={learningGoal.timeAvailable}
              onChange={(e) => setLearningGoal({...learningGoal, timeAvailable: e.target.value})}
            >
              <option value="">Select daily time</option>
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="3 hours">3 hours</option>
              <option value="4+ hours">4+ hours</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>What are your specific goals?</label>
            <textarea
              value={learningGoal.goals}
              onChange={(e) => setLearningGoal({...learningGoal, goals: e.target.value})}
              placeholder="e.g., Get a job as a developer, Build my own app, Start a side business"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Learning preferences?</label>
            <textarea
              value={learningGoal.preferences}
              onChange={(e) => setLearningGoal({...learningGoal, preferences: e.target.value})}
              placeholder="e.g., Hands-on projects, Video tutorials, Reading, Practice exercises"
              rows={2}
            />
          </div>
        </form>
        
        <div className="form-actions">
          <button className="btn-secondary" onClick={() => setStep('examples')}>
            Back to Examples
          </button>
          <button 
            className="btn-primary" 
            onClick={generateLearningPlan}
            disabled={!learningGoal.subject || !learningGoal.timeframe || isGenerating}
          >
            {isGenerating ? 'Generating Plan...' : 'Generate Learning Plan'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'plan' && generatedPlan) {
    return (
      <div className="learning-planner-service">
        <div className="learning-header">
          <h2>🎯 Your Personalized Learning Plan</h2>
          <p>Here's your AI-generated learning plan based on your goals:</p>
        </div>
        
        <div className="learning-plan">
          <div className="plan-overview">
            <h3>{generatedPlan.title}</h3>
            <p>Duration: {generatedPlan.duration}</p>
          </div>
          
          <div className="plan-phases">
            <h4>Learning Phases</h4>
            {generatedPlan.phases.map((phase, index) => (
              <div key={index} className="phase-card">
                <h5>{phase.name}</h5>
                <p className="phase-duration">{phase.duration}</p>
                <p>{phase.description}</p>
                <ul>
                  {phase.milestones.map((milestone, i) => (
                    <li key={i}>{milestone}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="plan-preview">
            <h4>Next 7 Days Preview</h4>
            <div className="daily-tasks-preview">
              {generatedPlan.dailyTasks.slice(0, 7).map((task, index) => (
                <div key={index} className="task-preview">
                  <span className="task-date">{new Date(task.date).toLocaleDateString()}</span>
                  <span className="task-name">{task.task}</span>
                  <span className="task-duration">{task.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="plan-actions">
          <button className="btn-secondary" onClick={() => setStep('input')}>
            Modify Plan
          </button>
          <button className="btn-primary" onClick={createSchedule}>
            Add to My Calendar
          </button>
        </div>
      </div>
    );
  }

  if (step === 'schedule') {
    return (
      <div className="learning-planner-service">
        <div className="learning-header success">
          <h2>✅ Learning Plan Added!</h2>
          <p>Your learning plan has been added to your calendar. You can view and manage it in your Day Planner.</p>
        </div>
        
        <div className="schedule-confirmation">
          <div className="confirmation-card">
            <h3>📅 Schedule Created</h3>
            <p>Your daily learning tasks are now integrated with your calendar.</p>
            <ul>
              <li>Daily reminders will be sent</li>
              <li>Progress tracking enabled</li>
              <li>Plan can be modified anytime</li>
            </ul>
          </div>
        </div>
        
        <div className="schedule-actions">
          <button className="btn-secondary" onClick={() => setStep('examples')}>
            Create Another Plan
          </button>
          <button className="btn-primary" onClick={() => window.location.href = '/day'}>
            View in Day Planner
          </button>
        </div>
      </div>
    );
  }

  return null;
};