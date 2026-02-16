import React from 'react'

const ActionCard = ({ title, icon, description, onSave }) => {
    return (
        <div className="card">
            <div className="cardHead">
                <div className="cardHeadLeft">
                    <div className="iconBox">{icon}</div>
                    <div className="cardTitle">{title}</div>
                </div>
                <button className="btn" onClick={onSave}>Log →</button>
            </div>
            <div className="cardBody">{description}</div>
        </div>
    )
}

export default ActionCard
