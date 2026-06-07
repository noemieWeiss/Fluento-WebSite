import { useState } from 'react'
import { rewardsApi } from '../../../services/rewardsApi'

const EMPTY_FORM = { title: '', question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct: 'a', xp_reward: 20 }

export default function QuizzesTab({ quizzes, setQuizzes, notify }) {
  const [form, setForm] = useState(EMPTY_FORM)

  const handleCreate = async () => {
    const { title, question, option_a, option_b, option_c, option_d } = form
    if (!title || !question || !option_a || !option_b || !option_c || !option_d)
      return notify('Fill all quiz fields', 'error')
    const res = await rewardsApi.createQuiz(form)
    if (res.id) {
      notify('Quiz created and activated!')
      const fresh = await rewardsApi.getQuizzes()
      setQuizzes(fresh)
      setForm(EMPTY_FORM)
    } else notify(res.message, 'error')
  }

  const handleToggle = async (id) => {
    const res = await rewardsApi.toggleQuiz(id)
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, active: res.active } : q))
  }

  return (
    <div className="reward-grid">
      <div className="admin-card">
        <div className="admin-card-header"><h2>Create Surprise Quiz</h2></div>
        <div className="reward-form">
          <div className="field-group">
            <label>Quiz Title</label>
            <input className="admin-input" placeholder="e.g. Weekend Challenge!" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="field-group">
            <label>Question</label>
            <textarea className="admin-input admin-textarea" rows={2} placeholder="What is the Spanish word for 'cat'?" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['a', 'b', 'c', 'd'].map(opt => (
              <div key={opt} className="field-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input type="radio" name="correct" value={opt} checked={form.correct === opt} onChange={() => setForm(f => ({ ...f, correct: opt }))} />
                  Option {opt.toUpperCase()} {form.correct === opt && '✓ Correct'}
                </label>
                <input className="admin-input" placeholder={`Answer ${opt.toUpperCase()}...`} value={form[`option_${opt}`]} onChange={e => setForm(f => ({ ...f, [`option_${opt}`]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div className="field-group">
            <label>XP Reward for correct answer</label>
            <input className="admin-input" type="number" min={5} max={200} value={form.xp_reward} onChange={e => setForm(f => ({ ...f, xp_reward: Number(e.target.value) }))} />
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={handleCreate}>🎯 Launch Surprise Quiz</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Active Quizzes</h2>
          <span className="card-badge">{quizzes.filter(q => q.active).length} live</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {quizzes.length === 0 && <div className="empty-state"><div className="empty-icon">🎯</div><div>No quizzes yet</div></div>}
          {quizzes.map(q => (
            <div key={q.id} className={`quiz-item ${q.active ? 'active' : 'inactive'}`}>
              <div className="quiz-top">
                <span className="quiz-title">{q.title}</span>
                <span className={`status-badge ${q.active ? 'active' : 'suspended'}`}>{q.active ? '🟢 Live' : '⏸ Paused'}</span>
              </div>
              <div className="quiz-question">{q.question}</div>
              <div className="quiz-meta">
                <span>💎 {q.xp_reward} XP</span>
                <span>📊 {q.total_answers} answers</span>
                <span>✅ {q.correct_answers} correct</span>
              </div>
              <button className={q.active ? 'btn-ghost' : 'btn-primary'} style={{ fontSize: 12, padding: '6px 14px', marginTop: 6 }} onClick={() => handleToggle(q.id)}>
                {q.active ? '⏸ Pause' : '▶ Resume'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
