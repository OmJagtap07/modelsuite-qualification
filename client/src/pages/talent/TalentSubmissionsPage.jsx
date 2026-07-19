import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import { fetchMySubmissions } from '../../api/submissions';

const fmtDate = (raw) => {
  if (!raw) return '-';
  const d = new Date(raw);
  if (isNaN(d.valueOf())) return '-';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const REVIEW_STATUS_CLASS = {
  Pending:  'status-badge-Submitted',
  Approved: 'status-badge-Approved',
  Rejected: 'status-badge-Rejected',
};

const TASK_STATUS_CLASS = {
  Open: 'status-badge-Open',
  Claimed: 'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved: 'status-badge-Approved',
  Rejected: 'status-badge-Rejected',
  Completed: 'status-badge-Approved'
};

const TalentSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchMySubmissions();
      setSubmissions(data);
    } catch {
      setError('Unable to load your submission history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  return (
    <div className="flex min-h-screen bg-bg-dark">
      <TalentSidebar />

      <main className="ml-[220px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 220px)' }}>
        <div className="mb-8 page-section">
          <h1 className="text-[24px] font-bold tracking-tight text-text-primary mb-1">
            My Submissions
          </h1>
          <p className="text-[13px] text-text-muted">
            A chronological timeline of your submitted work.
          </p>
        </div>

        <div className="max-w-3xl page-section">
          {loading && (
            <div className="flex items-center gap-3 text-text-muted text-[14px]">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Loading submissions...
            </div>
          )}

          {!loading && error && (
            <div className="p-4 rounded-xl border border-danger/30 bg-danger/10 text-danger text-[13px]">
              {error}
            </div>
          )}

          {!loading && !error && submissions.length === 0 && (
            <div className="py-12 px-6 rounded-xl border border-border bg-bg-card text-center">
              <p className="text-text-primary font-medium text-[15px] mb-2">No submissions yet.</p>
              <p className="text-text-muted text-[13px]">
                Complete and submit a task to build your submission history.
              </p>
            </div>
          )}

          {!loading && !error && submissions.length > 0 && (
            <div className="relative border-l-2 border-border ml-4 mt-6">
              {submissions.map((sub, index) => {
                const task = sub.taskId || {};
                const reviewStatus = sub.reviewStatus || 'Pending';
                
                return (
                  <div key={sub._id} className="mb-10 ml-8 relative group page-section" style={{ animationDelay: `${index * 0.05}s` }}>
                    {/* Timeline Dot */}
                    <div className="absolute w-4 h-4 bg-bg-dark border-2 border-primary rounded-full -left-[41px] top-1.5 group-hover:bg-primary transition-colors"></div>
                    
                    <div className="bg-bg-card border border-border hover:border-border-light transition-colors rounded-xl p-5 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-[16px] font-semibold text-text-primary leading-tight mb-1">
                            {task.title || 'Unknown Task'}
                          </h3>
                          <div className="flex items-center gap-2 text-[12px] text-text-muted">
                            <span>Submitted: {fmtDate(sub.createdAt)}</span>
                            {task.dueDate && (
                              <>
                                <span>&bull;</span>
                                <span>Due: {fmtDate(task.dueDate)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold ${TASK_STATUS_CLASS[task.status] || 'status-badge-Open'}`}>
                            Task: {task.status || 'Unknown'}
                          </span>
                          <span className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold ${REVIEW_STATUS_CLASS[reviewStatus] || 'status-badge-Submitted'}`}>
                            Review: {reviewStatus}
                          </span>
                        </div>
                      </div>
                      
                      {sub.notes && (
                        <div className="mb-4 bg-bg-input rounded-lg p-3 border border-border/50">
                          <p className="text-[13px] text-text-primary italic leading-relaxed">"{sub.notes}"</p>
                        </div>
                      )}
                      
                      {sub.fileUrl && (
                        <div className="pt-3 border-t border-border">
                          <a href={sub.fileUrl} target="_blank" rel="noreferrer" 
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-primary-dark transition-colors mt-3">
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="7 10 12 15 17 10"></polyline>
                              <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            View / Download Submission File
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TalentSubmissionsPage;
