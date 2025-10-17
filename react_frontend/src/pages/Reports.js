import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import ReportCard from '../components/ReportCard';
import { useTheme } from '../theme';

// PUBLIC_INTERFACE
export default function Reports() {
  /** Reports list and detail viewer. */
  const { theme } = useTheme();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.myReports();
      const arr = Array.isArray(data) ? data : (data?.items || data?.reports || []);
      setList(arr || []);
    } catch (e) {
      setError(e?.message || 'Failed to load reports');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDetail = async (rep) => {
    setDetail(null);
    try {
      const id = rep?.id || rep?._id || rep?.sessionId || rep?.session || '';
      if (!id) return;
      const d = await api.sessionReport(id);
      setDetail(d);
    } catch {
      // show nothing if fails
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports</h1>
        <p className="muted">Your session history and feedback.</p>
      </div>

      {error ? <div className="error">{error}</div> : null}
      {loading ? <div className="loading">Loading…</div> : null}

      <div className="grid two">
        <div>
          {list.length === 0 && !loading ? (
            <div className="card" style={{ background: theme.surface }}>
              <div className="card-body">
                <div className="muted">No reports available yet.</div>
              </div>
            </div>
          ) : (
            list.map((r, idx) => <ReportCard key={idx} report={r} onOpen={openDetail} />)
          )}
        </div>
        <div>
          {detail ? (
            <div className="card" style={{ background: theme.surface }}>
              <div className="card-header"><h3>Session Details</h3></div>
              <div className="card-body">
                <pre className="pre">{JSON.stringify(detail, null, 2)}</pre>
              </div>
            </div>
          ) : (
            <div className="card" style={{ background: theme.surface }}>
              <div className="card-body">
                <div className="muted">Select a report to view details.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
