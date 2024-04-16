import React, { useState, useEffect, useRef } from 'react';
import { AiFillCheckSquare, AiOutlineEdit, AiOutlineClose } from 'react-icons/ai';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';

const MonthGoalsCard = () => {
    const [goals, setGoals] = useState([
       
            { id: 1, text: 'Read 2 books', isCompleted: false },
            { id: 2, text: 'Sports every day', isCompleted: false },
            { id: 3, text: 'Complete the course', isCompleted: false },
            { id: 4, text: 'Bend down with a parachute', isCompleted: false },
            { id: 5, text: 'Learn to bake', isCompleted: false },
            { id: 6, text: 'Write a daily journal', isCompleted: false },
            { id: 7, text: 'Practice meditation', isCompleted: false },
            { id: 8, text: 'Learn a new language', isCompleted: false },
            { id: 9, text: 'Take a daily walk', isCompleted: false },
            { id: 10, text: 'Explore a new hobby', isCompleted: false },
            { id: 11, text: 'Improve cooking skills', isCompleted: false },
            { id: 12, text: 'Start a fitness routine', isCompleted: false },
            { id: 13, text: 'Plan a weekly budget', isCompleted: false },
            { id: 14, text: 'Try a new recipe every week', isCompleted: false },
            { id: 15, text: 'Practice mindfulness', isCompleted: false },
          
    ]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const modalRef = useRef();

    const toggleGoal = (goalId) => {
        setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, isCompleted: !goal.isCompleted } : goal)));
    };

    const saveGoal = () => {
        if (currentGoal && currentGoal.id) {
            const updatedGoals = goals.map((g) => (g.id === currentGoal.id ? currentGoal : g));
            setGoals(updatedGoals);
        } else {
            const newId = goals.length > 0 ? Math.max(...goals.map(g => g.id)) + 1 : 1;
            setGoals([...goals, { ...currentGoal, id: newId, isCompleted: false }]);
        }
        setIsEditing(false);
        setCurrentGoal(null);
    };

    const toggleModal = () => {
        setIsEditing(!isEditing);
        setCurrentGoal(null);
    };

    // Click outside to close modal
    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                toggleModal();
            }
        }
        if (isEditing) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditing]);

    return (
        <div className="bg-white p-5 rounded-xl shadow-md w-64 relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Monthly goals:</h2>
                <AiOutlineEdit className="ml-2 cursor-pointer" onClick={toggleModal} />
            </div>
            <div style={{ maxHeight: '139px', overflowY: 'scroll', paddingTop: '10px' }}>
                {goals.map((goal) => (
                    <div key={goal.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div onClick={() => toggleGoal(goal.id)}>
                                {goal.isCompleted ? (
                                    <AiFillCheckSquare className="text-lg text-red-500" />
                                ) : (
                                    <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                                )}
                            </div>
                            <span
                                className={`ml-2 text-black ${goal.isCompleted ? 'line-through' : ''}`}
                                style={{ flexGrow: 1 }}
                                onClick={() => toggleGoal(goal.id)}
                            >
                                {goal.text}
              </span>
                        </div>
                        <AiOutlineClose className="text-red-500 cursor-pointer" onClick={() => setGoals(goals.filter(g => g.id !== goal.id))} />
                    </div>
                ))}
            </div>
            {isEditing && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full" ref={modalRef}>
                        <h3 className="text-lg font-semibold mb-4">{currentGoal?.id ? 'Edit Goal' : 'Add New Goal'}</h3>
                        <input
                            type="text"
                            value={currentGoal ? currentGoal.text : ''}
                            onChange={(e) => setCurrentGoal({ ...currentGoal, text: e.target.value })}
                            className="border p-2 w-full mb-4"
                            placeholder="Enter goal"
                        />
                        <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-full" onClick={saveGoal}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthGoalsCard;
