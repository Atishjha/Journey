import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiService, TravelPlan } from '../lib/api';

function Dashboard() {
  const { user, logout } = useAuth();
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTravelPlans();
  }, []);

  const loadTravelPlans = async () => {
    try {
      const plans = await apiService.getTravelPlans();
      setTravelPlans(plans);
    } catch (error: any) {
      console.error('Failed to load travel plans:', error);
      setError('Failed to load travel plans');
    } finally {
      setLoading(false);
    }
  };

  const createTravelPlan = async (planData: any) => {
    try {
      setError('');
      const newPlan = await apiService.createTravelPlan(planData);
      setTravelPlans([newPlan, ...travelPlans]);
      setShowCreateForm(false);
    } catch (error: any) {
      console.error('Failed to create travel plan:', error);
      setError('Failed to create travel plan');
    }
  };

  const generateItinerary = async (plan: TravelPlan) => {
    try {
      setError('');
      const itinerary = await apiService.generateItinerary({
        destination: plan.destination,
        budget: plan.budget,
        duration: plan.duration,
        interests: plan.interests
      });

      // Update the plan with the generated itinerary
      await apiService.updateTravelPlan(plan.id, { 
        itinerary,
        total_cost: itinerary.total_estimated_cost 
      });

      // Reload plans to show updated data
      loadTravelPlans();
    } catch (error: any) {
      console.error('Failed to generate itinerary:', error);
      setError('Failed to generate itinerary');
    }
  };

  const deletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this travel plan?')) {
      try {
        await apiService.deleteTravelPlan(planId);
        setTravelPlans(travelPlans.filter(plan => plan.id !== planId));
      } catch (error: any) {
        console.error('Failed to delete travel plan:', error);
        setError('Failed to delete travel plan');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your travel plans...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}! ✈️</h1>
          <p>Plan your next adventure</p>
        </div>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="dashboard-content">
        <div className="plans-section">
          <div className="plans-header">
            <h2>Your Travel Plans ({travelPlans.length})</h2>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="create-btn"
            >
              + Create New Plan
            </button>
          </div>

          {travelPlans.length === 0 ? (
            <div className="empty-state">
              <h3>🌍 Ready for your first adventure?</h3>
              <p>Create your first travel plan and let AI help you plan the perfect trip!</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="create-first-plan-btn"
              >
                Create Your First Plan
              </button>
            </div>
          ) : (
            <div className="plans-grid">
              {travelPlans.map(plan => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan} 
                  onGenerateItinerary={() => generateItinerary(plan)}
                  onDelete={() => deletePlan(plan.id)}
                />
              ))}
            </div>
          )}
        </div>

        {showCreateForm && (
          <CreatePlanModal
            onSubmit={createTravelPlan}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </div>
    </div>
  );
}

// Plan Card Component
interface PlanCardProps {
  plan: TravelPlan;
  onGenerateItinerary: () => void;
  onDelete: () => void;
}

function PlanCard({ plan, onGenerateItinerary, onDelete }: PlanCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const hasItinerary = plan.itinerary && Object.keys(plan.itinerary).length > 0;

  return (
    <div className="plan-card">
      <div className="plan-card-header">
        <h3>{plan.destination}</h3>
        <div className="plan-actions">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="details-btn"
          >
            {showDetails ? '−' : '+'}
          </button>
          <button onClick={onDelete} className="delete-btn">
            🗑️
          </button>
        </div>
      </div>

      <div className="plan-info">
        <div className="info-item">
          <span className="label">Duration:</span>
          <span>{plan.duration} days</span>
        </div>
        <div className="info-item">
          <span className="label">Budget:</span>
          <span>${plan.budget.toLocaleString()}</span>
        </div>
        <div className="info-item">
          <span className="label">Dates:</span>
          <span>{formatDate(plan.start_date)} - {formatDate(plan.end_date)}</span>
        </div>
        <div className="info-item">
          <span className="label">Interests:</span>
          <div className="interests">
            {plan.interests.map((interest, index) => (
              <span key={index} className="interest-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {!hasItinerary && (
        <button 
          onClick={onGenerateItinerary}
          className="generate-btn"
        >
          🤖 Generate AI Itinerary
        </button>
      )}

      {showDetails && hasItinerary && (
        <div className="itinerary-summary">
          <h4>Itinerary Summary</h4>
          <p>Total Estimated Cost: ${plan.total_cost?.toLocaleString()}</p>
          <p>Days planned: {plan.itinerary.days?.length || 0}</p>
        </div>
      )}

      {hasItinerary && (
        <div className="plan-status">
          ✅ Itinerary Generated
        </div>
      )}
    </div>
  );
}

// Create Plan Modal Component
interface CreatePlanModalProps {
  onSubmit: (planData: any) => void;
  onCancel: () => void;
}

function CreatePlanModal({ onSubmit, onCancel }: CreatePlanModalProps) {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    duration: '',
    interests: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        budget: parseFloat(formData.budget),
        duration: parseInt(formData.duration),
        interests: formData.interests.split(',').map(s => s.trim()).filter(s => s.length > 0)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="create-plan-form">
          <h3>Create New Travel Plan</h3>
          
          <div className="form-group">
            <label>Destination</label>
            <input
              placeholder="e.g., Paris, France"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Budget ($)</label>
              <input
                type="number"
                placeholder="2000"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Duration (days)</label>
              <input
                type="number"
                placeholder="7"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Interests</label>
            <input
              placeholder="culture, food, history, adventure (comma-separated)"
              value={formData.interests}
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;