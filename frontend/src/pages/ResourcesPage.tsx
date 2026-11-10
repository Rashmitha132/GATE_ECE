import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  Video, 
  BookOpen, 
  ChevronRight,
  ChevronLeft,
  Filter,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  PlayCircle,
  X
} from 'lucide-react';
import api from '../services/api';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('Study Notes');
  const [activeSubject, setActiveSubject] = useState<any | null>(null);
  const [downloadableOnly, setDownloadableOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showCategoryOverview, setShowCategoryOverview] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRes, subRes] = await Promise.all([
          api.get('/resources'),
          api.get('/subjects')
        ]);
        setResources(resRes.data);
        setSubjects(subRes.data);
      } catch (err) {
        console.error('Failed to load resources or subjects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resourceCategories = [
    { title: 'Study Notes', desc: 'Subject-wise notes, topic-wise concepts and concise explanations.', icon: '📝' },
    { title: 'Formula Sheets', desc: 'Quick revision formulas and high-yield GATE formula digests.', icon: '📐' },
    { title: 'Previous Year Questions', desc: 'GATE ECE PYQs, official papers with complete solutions.', icon: '📑' },
    { title: 'Reference Material', desc: 'Standard textbooks, core digest summaries and reference material.', icon: '📚' },
    { title: 'Video Lectures', desc: 'Official NPTEL GATE portal enrollment & IIT video series.', icon: '🎥' },
  ];

  const getItemNoun = (type: string) => {
    switch (type) {
      case 'Study Notes': return 'note(s)';
      case 'Formula Sheets': return 'formula sheet(s)';
      case 'Previous Year Questions': return 'paper(s)';
      case 'Reference Material': return 'reference material(s)';
      case 'Video Lectures': return 'lecture(s)';
      default: return 'item(s)';
    }
  };

  // Synchronize activeSubject with top selectedSubject dropdown if changed manually
  const handleSubjectDropdownChange = (subId: string) => {
    setSelectedSubject(subId);
    if (subId === 'All') {
      setActiveSubject(null);
    } else {
      const match = subjects.find(s => String(s.id) === String(subId));
      if (match) {
        setActiveSubject(match);
        setShowCategoryOverview(false);
      }
    }
  };

  const handleCategorySelect = (categoryTitle: string) => {
    setSelectedType(categoryTitle);
    setShowCategoryOverview(false);
    setActiveSubject(null);
  };

  // Get uploaded count for a specific subject within the active category
  const getSubjectResourceCount = (subjectId: number) => {
    return resources.filter(r => {
      const matchesSubject = String(r.subject_id) === String(subjectId);
      const matchesType = r.resource_type === selectedType;
      const matchesDownload = !downloadableOnly || r.is_downloadable;
      return matchesSubject && matchesType && matchesDownload;
    }).length;
  };

  // Filtered resources for the active subject when clicked
  const activeSubjectResources = resources.filter(r => {
    if (!activeSubject) return false;
    const matchesSubject = String(r.subject_id) === String(activeSubject.id);
    const matchesType = selectedType === 'All' || r.resource_type === selectedType;
    const matchesDownload = !downloadableOnly || r.is_downloadable;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      r.title.toLowerCase().includes(q) ||
      (r.author_name && r.author_name.toLowerCase().includes(q));
    return matchesSubject && matchesType && matchesDownload && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header Banner */}
      <div className="relative bg-gradient-to-r from-[#fbf5f5] via-[#f7ebeb] to-[#f4dfdf] rounded-2xl p-6 md:p-8 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#8e2137] tracking-wider bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-200">
              RESOURCES
            </span>
            <span className="text-xs text-stone-500 font-medium">
              &bull; GSSSIETW Mysore ECE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#500713]">
            Your GATE ECE Study Library
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Notes, formula sheets, previous-year papers and curated study material — all in one place.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="w-44 h-28 rounded-xl overflow-hidden shadow-sm border border-rose-200">
            <img 
              src="/images/gate-student-hero.png" 
              alt="Library Banner" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="font-serif italic text-xs text-[#701a2b] max-w-[140px] leading-tight">
            “Small steps every day lead to big results..” ♥
          </div>
        </div>
      </div>

      {/* 2. Top Search & Filter Bar (Matching Screenshot verbatim) */}
      <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#701a2b] focus:bg-white transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Subject Dropdown */}
          <select 
            value={selectedSubject}
            onChange={(e) => handleSubjectDropdownChange(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl text-xs px-3.5 py-2.5 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#701a2b] cursor-pointer"
          >
            <option value="All">All Subjects ({subjects.length})</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* Resource Type Dropdown */}
          <select 
            value={showCategoryOverview ? 'All Categories' : selectedType}
            onChange={(e) => {
              if (e.target.value === 'All Categories') {
                setShowCategoryOverview(true);
                setActiveSubject(null);
              } else {
                handleCategorySelect(e.target.value);
              }
            }}
            className="bg-stone-50 border border-stone-200 rounded-xl text-xs px-3.5 py-2.5 text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#701a2b] cursor-pointer"
          >
            <option value="Study Notes">Study Notes</option>
            <option value="Formula Sheets">Formula Sheets</option>
            <option value="Previous Year Questions">Previous Year Questions</option>
            <option value="Reference Material">Reference Material</option>
            <option value="Video Lectures">Video Lectures</option>
            <option value="All Categories">All Categories Overview</option>
          </select>

          {/* Downloadable Checkbox */}
          <label className="flex items-center gap-2 text-xs text-stone-600 select-none cursor-pointer pl-1">
            <input
              type="checkbox"
              checked={downloadableOnly}
              onChange={(e) => setDownloadableOnly(e.target.checked)}
              className="rounded text-[#701a2b] focus:ring-[#701a2b] cursor-pointer"
            />
            <span>Downloadable</span>
          </label>
        </div>
      </div>

      {/* 3. MAIN SECTION */}
      {showCategoryOverview ? (
        /* 3A. The 6 Category Cards Overview (When user clicks Close or chooses All Categories) */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-stone-900 text-lg">
              Explore Resources by Category
            </h2>
            <span className="text-xs text-stone-500">
              Select a category to view its subject-wise materials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resourceCategories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategorySelect(cat.title)}
                className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-300 transition flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                    <h3 className="font-serif font-bold text-stone-900 text-sm group-hover:text-[#701a2b] transition">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-50 flex items-center justify-between text-xs font-semibold text-[#701a2b]">
                  <span>Explore by Subject</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeSubject ? (
        /* 3B. SUBJECT NOTES VIEW (When user clicks a particular subject - ONLY that subject's notes appear) */
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-rose-100 shadow-sm space-y-6">
          {/* Header with Back button and Close */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-50">
            <div>
              <button
                onClick={() => {
                  setActiveSubject(null);
                  setSelectedSubject('All');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#701a2b] hover:underline mb-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to {selectedType} by Subject</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-serif font-bold text-[#500713]">
                  {activeSubject.name}
                </h2>
                <span className="bg-rose-50 text-[#701a2b] text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-100">
                  {selectedType}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Showing all uploaded {getItemNoun(selectedType)} for {activeSubject.name}.
              </p>
            </div>

            <button
              onClick={() => {
                setShowCategoryOverview(true);
                setActiveSubject(null);
              }}
              className="self-start sm:self-center text-xs font-semibold text-[#701a2b] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Close</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* If Video Lectures category, show NPTEL enrollment banner */}
          {selectedType === 'Video Lectures' && (
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-5 shadow-sm border border-emerald-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  OFFICIAL NPTEL / SWAYAM GATE ECE PROGRAM
                </span>
                <h3 className="text-base font-bold text-white">
                  Free Student Enrollment & IIT Video Course Portal
                </h3>
                <p className="text-xs text-emerald-100">
                  Access 500+ hours of video lectures with complete problem walk-throughs by IIT faculty.
                </p>
              </div>

              <a
                href="https://gate.nptel.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Enroll in NPTEL GATE Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* List of Notes / Materials for THIS particular subject ONLY */}
          {activeSubjectResources.length === 0 ? (
            <div className="py-12 text-center bg-stone-50/60 rounded-2xl border border-stone-100 space-y-3">
              <BookOpen className="w-8 h-8 text-stone-300 mx-auto" />
              <div className="text-stone-700 font-medium text-sm">
                No uploaded {getItemNoun(selectedType)} available yet for {activeSubject.name}.
              </div>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Faculty members can upload new materials for {activeSubject.name} via the Faculty Portal.
              </p>
              <button
                onClick={() => {
                  setActiveSubject(null);
                  setSelectedSubject('All');
                }}
                className="mt-2 text-xs font-semibold text-[#701a2b] bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                &larr; Choose another subject
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSubjectResources.map((res) => {
                const isVideo = res.resource_type === 'Video Lectures' || (res.file_url && res.file_url.startsWith('http'));

                return (
                  <div
                    key={res.id}
                    className="p-5 rounded-2xl border border-rose-100 hover:border-rose-300 hover:shadow-sm bg-white transition flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-[#701a2b] bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                          {activeSubject.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isVideo 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {isVideo ? 'VIDEO' : 'PDF'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                        {res.title}
                      </h3>

                      <div className="text-xs text-stone-400 flex items-center gap-2">
                        <span>{res.author_name || 'ECE Faculty, GSSSIETW'}</span>
                        <span>&bull;</span>
                        <span>{isVideo ? 'Online Video Portal' : `${res.file_size_mb || 0.2} MB`}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-rose-50 flex items-center justify-end">
                      {isVideo ? (
                        <a
                          href={res.file_url || 'https://gate.nptel.ac.in/'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition flex items-center gap-1.5 text-xs shadow-xs cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Enroll / Watch Video</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <a
                          href={res.file_url || '#'}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#701a2b] hover:bg-[#500713] text-white font-semibold transition flex items-center gap-1.5 text-xs shadow-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 3C. THE SUBJECTS GRID VIEW (Matching User's Screenshot Verbatim) */
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-rose-100 shadow-sm space-y-6">
          {/* Header matching Screenshot: "Study Notes by Subject" + "Close" button */}
          <div className="flex items-start sm:items-center justify-between pb-2 border-b border-rose-50">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#500713]">
                {selectedType} by Subject
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Choose a subject to view its uploaded {selectedType.toLowerCase() === 'study notes' ? 'notes' : selectedType.toLowerCase()}.
              </p>
            </div>

            <button
              onClick={() => setShowCategoryOverview(true)}
              className="text-sm font-medium text-[#701a2b] hover:underline cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Grid of Subjects matching Screenshot verbatim */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((sub) => {
              const count = getSubjectResourceCount(sub.id);

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setActiveSubject(sub);
                    setSelectedSubject(String(sub.id));
                  }}
                  className="bg-white rounded-2xl p-4.5 border border-rose-100/90 shadow-2xs hover:border-rose-300 hover:shadow-sm transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-stone-900 text-sm group-hover:text-[#701a2b] transition">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-stone-400">
                      {count} uploaded {getItemNoun(selectedType)}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#701a2b] group-hover:translate-x-0.5 transition" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Bottom Info Note */}
      <div className="bg-[#fff9f9] border border-rose-200 rounded-2xl p-4 text-xs text-stone-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#701a2b] shrink-0" />
          <span>
            Resources are continuously updated by the Department of ECE, GSSSIETW faculty members.
          </span>
        </div>
        <div className="text-stone-400 text-[11px] shrink-0">
          Total items in repository: {resources.length}
        </div>
      </div>
    </div>
  );
};
