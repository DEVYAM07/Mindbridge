import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Users, BookOpen, Activity, ArrowLeft, Loader2, Lock, Globe } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

export default function UserPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [circles, setCircles] = useState([]);
    const [journals, setJournals] = useState([]);
    const [moods, setMoods] = useState([]);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('circles');

    useEffect(() => {
        if (!id) return;

        setLoading(true);

        const fetchData = async () => {
            try {
                const [userRes, circlesRes, journalsRes, moodsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/users/${id}`, { withCredentials: true }),
                    axios.get(`${API_BASE_URL}/api/circles/user/${id}`, { withCredentials: true }),
                    axios.get(`${API_BASE_URL}/api/journals/user/${id}`, { withCredentials: true }),
                    axios.get(`${API_BASE_URL}/api/mood/user/${id}`, { withCredentials: true })
                ]);

                if (userRes.data.success) setUserData(userRes.data.user);
                if (circlesRes.data.success) setCircles(circlesRes.data.circles);
                if (journalsRes.data.success) setJournals(journalsRes.data.journals);
                if (moodsRes.data.success) setMoods(moodsRes.data.history);

            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#509678]" size={32} />
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 font-serif text-xl mb-4">User not found.</p>
                <button onClick={() => navigate(-1)} className="text-[#509678] font-bold hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAF9] p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <button onClick={() => navigate(-1)} className="mb-6 p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-[#509678] transition-colors">
                    <ArrowLeft size={24} />
                </button>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-4xl overflow-hidden border-4 border-[#F8FAF9] shadow-inner flex-shrink-0">
                        {userData.avatarUrl ? (
                            <img src={userData.avatarUrl} alt={userData.displayName} className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} />
                        )}
                    </div>

                    <div className="text-center md:text-left flex-grow">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2D3748] mb-2">{userData.displayName || userData.name}</h1>
                        <p className="text-gray-500 text-lg mb-4 max-w-2xl">{userData.bio || "No bio added yet."}</p>

                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {userData.interests && userData.interests.map((interest, idx) => (
                                <span key={idx} className="text-xs font-bold bg-[#E8F3EE] text-[#509678] px-3 py-1 rounded-full uppercase tracking-wide">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stat Cards / Navigation */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('circles')}
                        className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-2 ${activeTab === 'circles' ? 'bg-[#509678] text-white shadow-lg shadow-[#509678]/20' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-100'}`}
                    >
                        <Users size={24} />
                        <span className="font-bold text-2xl">{circles.length}</span>
                        <span className="text-xs uppercase tracking-wider font-bold opacity-80">Circles</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('moods')}
                        className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-2 ${activeTab === 'moods' ? 'bg-[#509678] text-white shadow-lg shadow-[#509678]/20' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-100'}`}
                    >
                        <Activity size={24} />
                        <span className="font-bold text-2xl">{moods.length}</span>
                        <span className="text-xs uppercase tracking-wider font-bold opacity-80">Mood Logs</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('journals')}
                        className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-2 ${activeTab === 'journals' ? 'bg-[#509678] text-white shadow-lg shadow-[#509678]/20' : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-100'}`}
                    >
                        <BookOpen size={24} />
                        <span className="font-bold text-2xl">{journals.length}</span>
                        <span className="text-xs uppercase tracking-wider font-bold opacity-80">Journals</span>
                    </button>
                </div>

                {/* Content Section */}
                <div className="bg-[#F8FAF9] min-h-[300px]">
                    {/* Active Tab Content */}
                    {activeTab === 'circles' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {circles.length > 0 ? circles.map(circle => (
                                <div key={circle._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg text-gray-800">{circle.name}</h3>
                                        {circle.visibility === 'public' ? <Globe size={16} className="text-gray-300" /> : <Lock size={16} className="text-amber-400" />}
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{circle.description}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-400 text-xs font-bold">
                                        <Users size={14} />
                                        <span>{circle.memberCount} Members</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-12 text-gray-400">
                                    No visible circles.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'journals' && (
                        <div className="space-y-4">
                            {journals.length > 0 ? journals.map(journal => (
                                <div key={journal._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-bold text-lg text-gray-800">{journal.title}</h3>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase">{new Date(journal.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{journal.content}</p>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-gray-400">
                                    No shared journals.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'moods' && (
                        <div className="space-y-4">
                            {moods.length > 0 ? moods.map((entry, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                                        ${entry.mood === 'good' ? 'bg-green-100 text-green-600' :
                                            entry.mood === 'bad' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}
                                     `}>
                                        {entry.mood === 'good' ? '😊' : entry.mood === 'bad' ? '😔' : '😐'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 capitalize">{entry.mood}</p>
                                        <p className="text-xs text-gray-400">{new Date(entry.date).toDateString()}</p>
                                    </div>
                                    <div className="ml-auto">
                                        {entry.visibility === 'public' && <Globe size={16} className="text-gray-300" />}
                                        {entry.visibility === 'circles' && <Users size={16} className="text-[#509678]" />}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-gray-400">
                                    No mood history visible.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
