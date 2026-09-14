export default function LockConfirmModal({ pathName, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="panel modal-box" onClick={(e) => e.stopPropagation()}>
        <h4>Unlock {pathName}?</h4>
        <div className="warning-box">
          Opening an additional path this late means its rewards are capped —
          you'll only earn 80% of the points you would have earned on it from the start.
        </div>
        <p>You can still complete every challenge on this path. Only the point total is reduced.</p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>Cancel</button>
          <button className="btn btn-accent" onClick={onConfirm}>Unlock anyway</button>
        </div>
      </div>
    </div>
  )
}
