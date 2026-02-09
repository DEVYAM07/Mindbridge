import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ArrowLeft, Users, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const INTEREST_FILTERS = [
    "Anxiety",
    "Productivity",
    "Mindfulness",
    "Sleep Quality",
    "Stress Management",
    "Focus",
    "Self-Care",
    "Social Wellness",
    "Emotional Balance"
];

export default function UserDirectory() {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Restored error state
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/api/users`, {
                    withCredentials: true
                });
                setAllUsers(response.data.users);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setError("Failed to load users. You might not be logged in or the server is unreachable.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 2. Client-side Filtering Logic
    const filteredUsers = allUsers.filter(user => {

        const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesInterests = activeFilters.length === 0 ||
            (user.interests && activeFilters.every(filter => user.interests.includes(filter)));

        return matchesSearch && matchesInterests;
    });

    const toggleFilter = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter)
                ? prev.filter(f => f !== filter)
                : [...prev, filter]
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] p-4 md:p-8 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowLeft className="text-gray-600" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Users className="text-[#509678]" size={28} />
                        <h1 className="text-3xl font-serif font-bold text-[#2D3748]">User Directory</h1>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
                    <div className="relative mb-6">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users by name, bio, or interests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#509678]/20 transition-all font-medium text-gray-700"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {INTEREST_FILTERS.map(filter => (
                            <button
                                key={filter}
                                onClick={() => toggleFilter(filter)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeFilters.includes(filter)
                                    ? 'bg-[#509678] text-white shadow-lg shadow-[#509678]/20'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-[#509678]" size={32} />
                    </div>
                ) : error ? ( // Show Error if exists
                    <div className="flex flex-col items-center justify-center py-12 text-red-500 bg-white rounded-[2.5rem] p-8 border border-red-100">
                        <AlertCircle size={48} className="mb-4 text-red-400" />
                        <p className="font-medium text-lg mb-2">{error}</p>
                        <p className="text-sm text-gray-400">Check your console for more details.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div key={user._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl overflow-hidden flex-shrink-0 border-2 border-gray-50">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={32} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-lg text-gray-800 truncate">{user.displayName || user.name}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {user.interests && user.interests.slice(0, 3).map((interest, idx) => (
                                                    <span key={idx} className="text-[10px] bg-[#E8F3EE] text-[#509678] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold truncate max-w-full">
                                                        {interest}
                                                    </span>
                                                ))}
                                                {user.interests && user.interests.length > 3 && (
                                                    <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full font-bold">
                                                        +{user.interests.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">{user.bio || "No bio added yet."}</p>
                                    <button
                                        onClick={() => navigate(`/users/${user._id}`)}
                                        className="w-full py-3 bg-[#F8FAF9] text-[#509678] rounded-2xl font-bold hover:bg-[#509678] hover:text-white transition-all mt-auto"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-400">
                                <p className="font-serif text-xl italic">No users found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
